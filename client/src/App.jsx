import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import TravelSearchInterface from "./components/TravelSearchInterface";

export default function App() {
  const [authed, setAuthed] = useState(null);

  useEffect(() => {
    fetch("/api/auth/profile", { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          setAuthed(true);
        } else {
          setAuthed(false);
        }
      })
      .catch((err) => {
        setAuthed(false);
      });
  }, []);

  if (authed === null) {
    // Mientras esperamos la respuesta del servidor…
    return <p>Cargando…</p>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz: si estás auth vas al buscador, si no al login */}
        <Route
          index
          element={
            authed ? (
              <Navigate to="/search" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login y registro */}
        <Route
          path="/login"
          element={
            authed ? (
              <Navigate to="/search" replace />
            ) : (
              <Login onLoginSuccess={() => setAuthed(true)} />
            )
          }
        />
        <Route
          path="/register"
          element={authed ? <Navigate to="/search" replace /> : <Register />}
        />

        {/* Buscador de viajes, solo accesible si estás autenticado */}
        <Route
          path="/search"
          element={
            authed ? (
              <TravelSearchInterface />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Cualquier otra URL redirige a “/” */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
