// src/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(body.error || "Login fallido");
      }

      // Avisamos a App que ya estamos autenticados
      onLoginSuccess();

      // Redirigimos al buscador
      navigate("/search", { replace: true });
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="login-form">
      <h2>Iniciar sesión</h2>
      {error && <p className="error-text">{error}</p>}

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label>
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      <button type="submit" className="btn-submit">
        Entrar
      </button>

      <p className="text-small" style={{ marginTop: "1rem" }}>
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="link">
          Regístrate aquí
        </Link>
      </p>
    </form>
  );
}
