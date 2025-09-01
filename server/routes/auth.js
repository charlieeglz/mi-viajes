const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db"); // subir un nivel para encontrar db.js

// Registro
router.post("/register", async (req, res) => {
  console.log("LLegó POST /api/auth/register, body=", req.body);
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    "INSERT INTO users (email, password_hash, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
    [email, hash]
  );
  req.session.userId = result.insertId;
  res.status(201).send({ message: "Usuario creado" });
});

// Login
router.post("/login", async (req, res) => {
  console.log(" LLegó POST /api/auth/login, body=", req.body);
  const { email, password } = req.body;
  const [rows] = await db.query(
    "SELECT id, password_hash FROM users WHERE email = ?",
    [email]
  );
  const user = rows[0];
  if (!user) {
    console.log(" Login: usuario no encontrado");
    return res.status(401).send({ error: "Credenciales inválidas" });
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    console.log("Login: contraseña incorrecta");
    return res.status(401).send({ error: "Credenciales inválidas" });
  }

  // guarda la sesión
  req.session.userId = user.id;
  console.log("Login OK, userId=", req.session.userId);

  // responde OK
  res.send({ message: "Sesión iniciada" });
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send({ error: "Error cerrando sesión" });
    res.clearCookie("connect.sid").send({ message: "Sesión cerrada" });
  });
});

// Middleware de protección
function requireAuth(req, res, next) {
  if (req.session.userId) return next();
  res.status(401).send({ error: "No autorizado" });
}

// Perfil protegido
router.get("/profile", requireAuth, async (req, res) => {
  console.log(" LLegó GET /api/auth/profile, cookies=", req.headers.cookie);

  const [rows] = await db.query("SELECT id, email FROM users WHERE id = ?", [
    req.session.userId,
  ]);
  res.send(rows[0]);
});

module.exports = router;
