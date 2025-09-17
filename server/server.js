require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { Sequelize, DataTypes } = require("sequelize");
const coordinates = require("./utils/coordinates");
const haversine = require("./utils/haversine");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Ajusta si es necesario
    credentials: true,
  })
);
app.use(express.json());
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);

// Autenticación
const requireAuth = (req, res, next) => {
  if (req.session.userId) return next();
  res.status(401).send({ error: "No autorizado" });
};

// Conexión Sequelize con PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

// Modelos
const Destination = sequelize.define(
  "Destination",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false },
    language: { type: DataTypes.STRING },
    audience: { type: DataTypes.JSON },
  },
  { tableName: "Destinations", timestamps: false }
);

const CountryCostIndex = sequelize.define(
  "CountryCostIndex",
  {
    country: { type: DataTypes.STRING, primaryKey: true },
    bigMacIndex: { type: DataTypes.FLOAT, allowNull: false },
  },
  { tableName: "CountryCostIndex", timestamps: false }
);

const User = sequelize.define(
  "User",
  {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: true,
  }
);

// Rutas de autenticación
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, password_hash: hash });
    res.status(201).send({ message: "Usuario registrado" });
  } catch (err) {
    res.status(500).send({ error: "Error al registrar usuario" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).send({ error: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).send({ error: "Credenciales inválidas" });

    req.session.userId = user.id;
    res.send({ message: "Sesión iniciada" });
  } catch (err) {
    res.status(500).send({ error: "Error al iniciar sesión" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send({ error: "No se pudo cerrar sesión" });
    res.clearCookie("connect.sid").send({ message: "Sesión cerrada" });
  });
});

app.get("/api/auth/profile", requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId, {
      attributes: ["id", "email"],
    });
    res.send(user);
  } catch (err) {
    res.status(500).send({ error: "Error al obtener perfil" });
  }
});

// Ruta principal de búsqueda
app.get("/api/search", requireAuth, async (req, res) => {
  const { origin, budget, daysMin, daysMax, selectedMonth } = req.query;

  if (
    !origin ||
    !budget ||
    !daysMin ||
    !daysMax ||
    selectedMonth === undefined
  ) {
    return res.status(400).json({ error: "Faltan parámetros" });
  }

  const originCoords = coordinates[origin];
  if (!originCoords) {
    return res
      .status(400)
      .json({ error: "Coordenadas de origen no encontradas" });
  }

  const allDestinations = await Destination.findAll();
  const costIndices = await CountryCostIndex.findAll();
  const indexMap = Object.fromEntries(
    costIndices.map((i) => [i.country, i.bigMacIndex])
  );
  const baseIndex = 5;

  const month = parseInt(selectedMonth);
  const highSeasonMonths = [0, 6, 7, 11];
  const isHighSeason = highSeasonMonths.includes(month);

  const results = [];

  for (const dest of allDestinations) {
    if (dest.name === origin) continue;

    const destCoords = coordinates[dest.name];
    if (!destCoords) continue;

    const km = haversine(originCoords, destCoords);
    const transportCost = km * 0.1;

    const costFactor = indexMap[dest.country]
      ? indexMap[dest.country] / baseIndex
      : 1;
    let lodgingPerDay = 70 * costFactor * 1.1;

    if (isHighSeason) lodgingPerDay *= 1.6;
    else lodgingPerDay *= 0.8;

    const lodgingMin = Number(daysMin) * lodgingPerDay;
    const lodgingMax = Number(daysMax) * lodgingPerDay;
    const minCost = transportCost + lodgingMin;
    const maxCost = transportCost + lodgingMax;

    if (maxCost > Number(budget)) continue;

    const avgCost = (minCost + maxCost) / 2;
    const avgDays = (Number(daysMin) + Number(daysMax)) / 2;

    results.push({
      id: dest.id,
      name: dest.name,
      country: dest.country,
      language: dest.language,
      audience: dest.audience,
      minCost,
      maxCost,
      avgCost,
      avgDays,
    });
  }

  return res.json(results);
});

// Arrancar el servidor después de sincronizar Sequelize
sequelize
  .sync()
  .then(() => {
    console.log("Base de datos sincronizada");
    app.listen(port, () => console.log(`Servidor en puerto ${port}`));
  })
  .catch((err) => console.error("Error sincronizando BD:", err));
