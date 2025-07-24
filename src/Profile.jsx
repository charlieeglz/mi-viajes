import React, { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/profile", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  if (!user) return <p>No estás autenticado.</p>;

  return (
    <div>
      <h2>Bienvenido, {user.email}</h2>
      <button
        onClick={async () => {
          await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });
          window.location.reload();
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
