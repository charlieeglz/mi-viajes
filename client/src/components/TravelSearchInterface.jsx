import React, { useState } from "react";
import { useSearch } from "../hooks/useSearch";
import "../styles.css";

const PIXABAY_API_KEY = "51764905-8e303a287ef32fadf628f8018";

export default function TravelSearchInterface() {
  const [origin, setOrigin] = useState("");
  const [budget, setBudget] = useState("");
  const [daysMin, setDaysMin] = useState("");
  const [daysMax, setDaysMax] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filters, setFilters] = useState({});
  const [sortOrder, setSortOrder] = useState("asc");
  const [countryImages, setCountryImages] = useState({});

  const cityCodeMap = {
    Roma: "rom",
    Berlin: "ber",
    Londres: "lon",
    Madrid: "mad",
    Paris: "par",
    Amsterdam: "ams",
    Tokio: "tyo",
    Nueva_York: "nyc",
    Viena: "vie",
    Bruselas: "bru",
    Sofia: "sof",
    Zagreb: "zag",
    Praga: "prg",
    Copenhague: "cph",
    Tallin: "tll",
    Helsinki: "hel",
    Atenas: "ath",
    Budapest: "bud",
    Dublin: "dub",
    Reykjavik: "rek",
    Riga: "rix",
    Vilna: "vil",
    Luxemburgo: "lux",
    Valeta: "mlt",
    Chisinau: "kiv",
    Podgorica: "tgd",
    Oslo: "osl",
    Varsovia: "waw",
    Lisboa: "lis",
    Bucarest: "otp",
    Moscu: "mow",
    San_Marino: "smr",
    Belgrado: "beg",
    Bratislava: "bts",
    Liubliana: "lju",
    Estocolmo: "sto",
    Berna: "brn",
    Ciudad_del_Vaticano: "vta",
    Andorra_la_Vella: "alc",
    Skopie: "skp",
    Monaco: "mcm",
    Tirana: "tia",
    Oporto: "opo",
    Barcelona: "bcn",
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
      selectedMonth,
    });
  };

  const formatSkyscannerDate = (date) => {
    const yy = String(date.getFullYear()).slice(2);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yy}${mm}${dd}`;
  };

  const fetchCountryImage = async (countryName) => {
    if (countryImages[countryName]) return;

    const trySearch = async (query) => {
      const res = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(
          query
        )}&image_type=photo&category=places&safesearch=true&per_page=3`
      );
      const data = await res.json();
      return data?.hits?.[0]?.webformatURL || null;
    };

    try {
      let imageUrl = await trySearch(countryName);

      const fallbackMap = {
        "EE.UU.": "USA",
        "Reino Unido": "United Kingdom",
        "Países Bajos": "Netherlands",
        Chequia: "Czech Republic",
        San_Marino: "San Marino",
        "Ciudad del Vaticano": "Vatican City",
        Mónaco: "Monaco",
        Alemania: "Germany",
        Italia: "Italy",
        España: "Spain",
        Francia: "France",
        Portugal: "Portugal",
        Japón: "Japan",
        Austria: "Austria",
        Bélgica: "Belgium",
        Bulgaria: "Bulgaria",
        Croacia: "Croatia",
        Dinamarca: "Denmark",
        Estonia: "Estonia",
        Finlandia: "Finland",
        Grecia: "Greece",
        Hungría: "Hungary",
        Irlanda: "Ireland",
        Islandia: "Iceland",
        Letonia: "Latvia",
        Lituania: "Lithuania",
        Luxemburgo: "Luxembourg",
        Malta: "Malta",
        Moldavia: "Moldova",
        Montenegro: "Montenegro",
        Noruega: "Norway",
        Polonia: "Poland",
        Rumanía: "Romania",
        Rusia: "Russia",
        Serbia: "Serbia",
        Eslovaquia: "Slovakia",
        Eslovenia: "Slovenia",
        Suecia: "Sweden",
        Suiza: "Switzerland",
        Ucrania: "Ukraine",
        Andorra: "Andorra",
        "Macedonia del Norte": "North Macedonia",
        Albania: "Albania",
        Vaticano: "Vatican City",
      };

      if (!imageUrl && fallbackMap[countryName]) {
        imageUrl = await trySearch(fallbackMap[countryName]);
      }
      if (!imageUrl) {
        imageUrl = await trySearch("europe travel landscape");
      }

      if (imageUrl) {
        setCountryImages((prev) => ({ ...prev, [countryName]: imageUrl }));
      } else {
        console.warn(`No se encontró imagen para ${countryName}`);
      }
    } catch (err) {
      console.error(`Error al buscar imagen para ${countryName}:`, err);
    }
  };

  const filtered = results.filter((dest) => {
    const originCode = cityCodeMap[origin];
    const destCode = cityCodeMap[dest.name];
    return originCode && destCode && originCode !== destCode;
  });

  const sorted = filtered
    .slice()
    .sort((a, b) =>
      sortOrder === "asc" ? a.avgCost - b.avgCost : b.avgCost - a.avgCost
    );

  return (
    <>
      <div className="top-bar">
        <button
          className="btn-theme"
          onClick={() => {
            document.body.classList.toggle("light-mode");
            localStorage.setItem(
              "theme",
              document.body.classList.contains("light-mode") ? "light" : "dark"
            );
          }}
        >
          Cambiar tema
        </button>

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
            <input
              type="text"
              list="origin-options"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
              className="input-field"
            />
            <datalist id="origin-options">
              {Object.entries(cityCodeMap).map(([cityName]) => (
                <option key={cityName} value={cityName} />
              ))}
            </datalist>
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
            <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
              <input
                type="number"
                value={daysMin}
                onChange={(e) => setDaysMin(e.target.value)}
                required
              />
              <input
                type="number"
                value={daysMax}
                onChange={(e) => setDaysMax(e.target.value)}
                required
              />
            </div>
          </label>

          <label>
            Mes de salida
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              required
            >
              <option value="">—</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i.toString()}>
                  {new Date(0, i).toLocaleString("es-ES", { month: "long" })}
                </option>
              ))}
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

                  if (!countryImages[dest.country]) {
                    fetchCountryImage(dest.country);
                  }

                  const today = new Date();
                  const year = today.getFullYear();

                  let departureBaseDate = new Date(year, selectedMonth, 10); // Día 10 por defecto
                  if (departureBaseDate < today) {
                    departureBaseDate.setFullYear(year + 1); // Si ya pasó este año, ir al siguiente
                  }

                  const departureDate = formatSkyscannerDate(departureBaseDate);
                  const returnDate = formatSkyscannerDate(
                    new Date(
                      departureBaseDate.getTime() +
                        daysMin * 24 * 60 * 60 * 1000
                    )
                  );
                  const skyscannerUrl = `https://www.skyscanner.es/transporte/vuelos/${originCode}/${destCode}/${departureDate}/${returnDate}/`;

                  return (
                    <div key={dest.id} className="card">
                      {countryImages[dest.country] && (
                        <img
                          src={countryImages[dest.country]}
                          alt={`Paisaje de ${dest.country}`}
                          className="country-image"
                        />
                      )}
                      <h3 className="card-title">
                        {dest.name}, {dest.country}
                      </h3>
                      {dest.minCost.toFixed(2) !== dest.maxCost.toFixed(2) ? (
                        <p>
                          <strong>Precio:</strong> €{dest.minCost.toFixed(2)} –
                          €{dest.maxCost.toFixed(2)}
                        </p>
                      ) : (
                        <p>
                          <strong>Precio:</strong> €{dest.minCost.toFixed(2)}
                        </p>
                      )}
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
