require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes, Op } = require("sequelize");
const session = require("express-session");
const bcrypt = require("bcrypt");
const db = require("./db"); // módulo de conexión a MySQL

const app = express();
const port = process.env.PORT || 5000;

const authRoutes = require("./routes/auth");

// CORS — antes de todo, para que los navegadores permitan llamadas cross-site
app.use(
  cors({
    origin: "http://localhost:5003", // o el dominio/puerto del front
    credentials: true,
  })
);

// JSON parser — para que req.body deje de ser undefined
app.use(express.json());

// Sesiones — para que req.session exista en todas las rutas
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

// (Opcional) trust proxy si el usuario detrás de un proxy
app.set("trust proxy", 1);

app.use("/api/auth", authRoutes);

// Conexión a MySQL con Sequelize
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

// Modelo Destination
const Destination = sequelize.define(
  "Destination",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    audience: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "Destinations",
    timestamps: false,
  }
);

sequelize
  .sync({ alter: true })
  .then(() => console.log("Base de datos sincronizada"))
  .catch((err) => console.error("Error al sincronizar BD", err))
  .finally(() => {
    app.listen(port, () => console.log(`API en puerto ${port}`));
  });
//Modelo actualizado
const Trip = sequelize.define(
  "Trip",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destinationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "destination_id",
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    daysMin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "days_min",
    },
    daysMax: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "days_max",
    },
    seasonType: {
      type: DataTypes.ENUM("high", "low"),
      allowNull: false,
      field: "season_type",
    },
    audience: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Trips",
    underscored: true,
    timestamps: true,
  }
);

//creacion de la tabla para almacenar usuarios
const User = sequelize.define(
  "User",
  {
    email: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: true,
  }
);

sequelize
  .sync()
  .then(() => {
    console.log("Tabla “users” sincronizada");
    app.listen(port, () => console.log(`API en puerto ${port}`));
  })
  .catch((err) => console.error("Error creando tabla users:", err));

// server.js, dentro de app.post('/api/search', …)
app.get("/api/search", requireAuth, async (req, res) => {
  const { origin, budget, daysMin, daysMax, seasonType } = req.query;

  // 1) Filtrar trips y sacar sólo MIN y MAX cost por destino
  const stats = await Trip.findAll({
    where: {
      origin,
      cost: { [Op.lte]: budget },
      daysMin: { [Op.gte]: daysMin },
      daysMax: { [Op.lte]: daysMax },
      seasonType,
    },
    attributes: [
      "destinationId",
      [sequelize.fn("MIN", sequelize.col("cost")), "minCost"],
      [sequelize.fn("MAX", sequelize.col("cost")), "maxCost"],
    ],
    group: ["destinationId"],
  });

  // 2) Convertir a JS y calcular avgCost y avgDays
  const userAvgDays = (Number(daysMin) + Number(daysMax)) / 2;
  const statsByDest = stats.map((s) => {
    const minCost = parseFloat(s.get("minCost"));
    const maxCost = parseFloat(s.get("maxCost"));
    return {
      id: s.destinationId,
      minCost,
      maxCost,
      avgCost: (minCost + maxCost) / 2, // cálculo propio
      avgDays: userAvgDays, // cálculo propio
    };
  });

  // 3) Recuperar datos de destinos
  const destinations = await Destination.findAll({
    where: { id: statsByDest.map((s) => s.id) },
    attributes: ["id", "name", "country", "language", "audience"],
  });

  // 4) Scoring usando avgCost y avgDays
  const results = destinations.map((dest) => {
    const { minCost, maxCost, avgCost, avgDays } = statsByDest.find(
      (s) => s.id === dest.id
    );

    // a) Score presupuesto
    const budgetScore = 1 - Math.abs(avgCost - budget) / budget;

    // b) Score duración
    const daysScore = 1 - Math.abs(avgDays - userAvgDays) / userAvgDays;

    // c) Score temporada (puedes ajustar factor)
    const seasonScore = 1; // ya filtraste por seasonType

    // d) Combinar
    let rawScore = budgetScore * 0.6 + daysScore * 0.4;
    rawScore = Math.max(0, Math.min(1, rawScore));
    const costLevel = Math.round(rawScore * 100);

    return {
      id: dest.id,
      name: dest.name,
      country: dest.country,
      language: dest.language,
      audience: dest.audience,
      minCost,
      maxCost,
      avgCost,
      avgDays,
      costLevel,
    };
  });

  return res.json(results);
});

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

function requireAuth(req, res, next) {
  if (req.session.userId) return next();
  res.status(401).send({ error: "No autorizado" });
}

app.get("/api/auth/profile", requireAuth, async (req, res) => {
  const [rows] = await db.query("SELECT id, email FROM users WHERE id = ?", [
    req.session.userId,
  ]);
  res.send(rows[0]);
});

// Arranca servidor
app.listen(port, () => {
  console.log(`Servidor Express escuchando en puerto ${port}`);
});
