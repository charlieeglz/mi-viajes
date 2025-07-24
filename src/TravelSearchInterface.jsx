import React, { useState } from "react";
import { useSearch } from "./hooks/useSearch";
import "./styles.css";

export default function TravelSearchInterface() {
  const [origin, setOrigin] = useState("");
  const [budget, setBudget] = useState("");
  const [daysMin, setDaysMin] = useState("");
  const [daysMax, setDaysMax] = useState("");
  const [seasonType, setSeasonType] = useState("");
  const [filters, setFilters] = useState({});
  const [sortOrder, setSortOrder] = useState("asc");

  // Mapa ciudad → código IATA
  const cityCodeMap = {
    Roma: "rom",
    Berlín: "ber",
    Londres: "lon",
    Madrid: "mad",
    París: "par",
    Ámsterdam: "ams",
    Tokio: "tyo",
    "Nueva York": "nyc",
    Viena: "vie",
    Bruselas: "bru",
    Sofía: "sof",
    Zagreb: "zag",
    Praga: "prg",
    Copenhague: "cph",
    Tallin: "tll",
    Helsinki: "hel",
    Atenas: "ath",
    Budapest: "bud",
    Dublín: "dub",
    Reykjavik: "rek",
    Riga: "rix",
    Vilna: "vil",
    Luxemburgo: "lux",
    Valeta: "mlt",
    Chisináu: "kiv",
    Podgorica: "tgd",
    Oslo: "osl",
    Varsovia: "waw",
    Lisboa: "lis",
    Bucarest: "otp",
    Moscú: "mow",
    San_Marino: "smr",
    Belgrado: "beg",
    Bratislava: "bts",
    Liubliana: "lju",
    Estocolmo: "sto",
    Berna: "brn",
    Kiev: "iev",
    "Ciudad del Vaticano": "vta",
    "Andorra la Vella": "alc",
    Skopie: "skp",
    Mónaco: "mcm",
    Tirana: "tia",
  };

  const { data: results = [], isFetching: loading, error } = useSearch(filters);

  const handleSearch = () => {
    if (!origin) {
      return alert("Por favor selecciona un punto de salida válido.");
    }

    setFilters({
      origin,
      budget: Number(budget),
      daysMin: Number(daysMin),
      daysMax: Number(daysMax),
      seasonType,
    });
  };

  const formatSkyscannerDate = (date) => {
    const yy = String(date.getFullYear()).slice(2);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yy}${mm}${dd}`;
  };

  // Filtrado por diferencia entre origen y destino
  const filtered = results.filter((dest) => {
    const originCode = cityCodeMap[origin];
    const destCode = cityCodeMap[dest.name];
    return originCode && destCode && originCode !== destCode;
  });

  // Ordenamiento
  const sorted = filtered
    .slice()
    .sort((a, b) =>
      sortOrder === "asc" ? a.avgCost - b.avgCost : b.avgCost - a.avgCost
    );

  return (
    <>
      <div className="logout-fixed">
        <button
          className="btn-logout"
          onClick={async () => {
            await fetch("/api/auth/logout", {
              method: "POST",
              credentials: "include",
            });
            window.location.href = "/login";
          }}
        >
          Cerrar sesión
        </button>
      </div>

      <div className="container">
        <aside className="sidebar">
          <h2>Filtros</h2>

          <label>
            Punto de salida
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            >
              <option value="">—</option>
              {Object.entries(cityCodeMap).map(([cityName, code]) => (
                <option key={code} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
          </label>

          <label>
            Presupuesto máximo (€)
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </label>

          <label>
            Días (mín – máx)
            <input
              type="number"
              value={daysMin}
              onChange={(e) => setDaysMin(e.target.value)}
              required
            />
            {" – "}
            <input
              type="number"
              value={daysMax}
              onChange={(e) => setDaysMax(e.target.value)}
              required
            />
          </label>

          <label>
            Temporada
            <select
              value={seasonType}
              onChange={(e) => setSeasonType(e.target.value)}
              required
            >
              <option value="">—</option>
              <option value="high">Alta</option>
              <option value="low">Baja</option>
            </select>
          </label>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn-search"
          >
            {loading ? "Buscando…" : "Buscar"}
          </button>

          {error && <p className="error-text">Error al cargar resultados.</p>}
        </aside>

        <section className="content">
          <h2>Resultados</h2>

          <div className="results-controls">
            <label>
              Ordenar por precio:
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Menor primero</option>
                <option value="desc">Mayor primero</option>
              </select>
            </label>
          </div>

          <div className="card-grid">
            {sorted.length > 0
              ? sorted.map((dest) => {
                  const originCode = cityCodeMap[origin];
                  const destCode = cityCodeMap[dest.name];
                  if (!originCode || !destCode) return null;

                  const today = new Date();
                  const departureDate = formatSkyscannerDate(today);
                  const returnDate = formatSkyscannerDate(
                    new Date(today.getTime() + daysMin * 24 * 60 * 60 * 1000)
                  );

                  const skyscannerUrl = `https://www.skyscanner.es/transporte/vuelos/${originCode}/${destCode}/${departureDate}/${returnDate}/`;

                  return (
                    <div key={dest.id} className="card">
                      <h3 className="card-title">
                        {dest.name}, {dest.country}
                      </h3>
                      <p>
                        <strong>Precio:</strong> €{dest.minCost.toFixed(2)} – €
                        {dest.maxCost.toFixed(2)}
                      </p>
                      <p>
                        <strong>Idioma:</strong> {dest.language || "N/A"}
                      </p>
                      <p>
                        <strong>Público:</strong>{" "}
                        {(dest.audience || []).join(", ") || "N/A"}
                      </p>
                      <p>
                        <a
                          href={skyscannerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-search-flight"
                        >
                          Buscar vuelo
                        </a>
                      </p>
                    </div>
                  );
                })
              : !loading && <p>Realiza una búsqueda para ver resultados.</p>}
          </div>
        </section>
      </div>
    </>
  );
}
