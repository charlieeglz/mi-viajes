require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { Sequelize, DataTypes } = require("sequelize");
const db = require("./db");
const coordinates = require("./utils/coordinates");
const haversine = require("./utils/haversine");

const app = express();
const port = process.env.PORT || 5000;

const authRoutes = require("./routes/auth");
const requireAuth = (req, res, next) => {
  if (req.session.userId) return next();
  res.status(401).send({ error: "No autorizado" });
};

// Middleware
app.use(
  cors({
    origin: "http://localhost:5003",
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

// Rutas
app.use("/api/auth", authRoutes);

// Conexión Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

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

// Sincronizar
sequelize
  .sync()
  .then(() => {
    console.log("Base de datos sincronizada");
    app.listen(port, () => console.log(`Servidor en puerto ${port}`));
  })
  .catch((err) => console.error("Error sincronizando BD:", err));

// Rutas adicionales
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await db.query("INSERT INTO users (email, password_hash) VALUES (?, ?)", [
    email,
    hash,
  ]);
  res.status(201).send({ message: "Usuario registrado" });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.query(
    "SELECT id, password_hash FROM users WHERE email = ?",
    [email]
  );
  const user = rows[0];
  if (!user) return res.status(401).send({ error: "Credenciales inválidas" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).send({ error: "Credenciales inválidas" });

  req.session.userId = user.id;
  res.send({ message: "Sesión iniciada" });
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send({ error: "No se pudo cerrar sesión" });
    res.clearCookie("connect.sid").send({ message: "Sesión cerrada" });
  });
});

app.get("/api/auth/profile", requireAuth, async (req, res) => {
  const [rows] = await db.query("SELECT id, email FROM users WHERE id = ?", [
    req.session.userId,
  ]);
  res.send(rows[0]);
});
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

    let lodgingPerDay = 70 * costFactor * 1.1; // auste por coste de vida

    // Aplicar lógica de temporada alta/baja
    if (isHighSeason) {
      lodgingPerDay *= 1.6;
    } else {
      lodgingPerDay *= 0.8;
    }

    const lodgingMin = Number(daysMin) * lodgingPerDay;
    const lodgingMax = Number(daysMax) * lodgingPerDay;

    const minCost = transportCost + lodgingMin;
    const maxCost = transportCost + lodgingMax;
    const avgCost = (minCost + maxCost) / 2;
    const avgDays = (Number(daysMin) + Number(daysMax)) / 2;

    if (maxCost > Number(budget)) continue;

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
