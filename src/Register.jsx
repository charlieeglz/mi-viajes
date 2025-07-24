import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!regRes.ok) {
        const err = await regRes.json().catch(() => ({}));
        throw new Error(err.error || "Error al registrar");
      }

      // 2) Auto‐login
      const logRes = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!logRes.ok) {
        const err = await logRes.json().catch(() => ({}));
        throw new Error(err.error || "Registro OK, fallo al iniciar sesión");
      }

      navigate("/search", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="register-form">
      <h2>Registro</h2>
      {error && <p className="error-text">{error}</p>}

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
        />
      </label>

      <label>
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />
      </label>

      <button type="submit" className="btn-submit">
        Registrar y entrar
      </button>
    </form>
  );
}
