// seedDestinations.js
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

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

const Destination = sequelize.define(
  "Destination",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false },
    language: { type: DataTypes.STRING },
    audience: { type: DataTypes.JSON },
  },
  {
    tableName: "Destinations",
    timestamps: false,
  }
);

const destinations = [
  {
    name: "Oporto",
    country: "Portugal",
    language: "Portugués",
    audience: ["vino", "cultura", "historia"],
  },
  {
    name: "Barcelona",
    country: "España",
    language: "Español / Catalán",
    audience: ["playas", "arte", "vida nocturna"],
  },
  {
    name: "Roma",
    country: "Italia",
    language: "Italiano",
    audience: ["historia", "cultura", "gastronomía"],
  },
  {
    name: "Berlín",
    country: "Alemania",
    language: "Alemán",
    audience: ["arte moderno", "música", "historia"],
  },
  {
    name: "Londres",
    country: "Reino Unido",
    language: "Inglés",
    audience: ["museos", "moda", "vida nocturna"],
  },
  {
    name: "Madrid",
    country: "España",
    language: "Español",
    audience: ["cultura", "gastronomía", "deporte"],
  },
  {
    name: "París",
    country: "Francia",
    language: "Francés",
    audience: ["romanticismo", "arte", "moda"],
  },
  {
    name: "Ámsterdam",
    country: "Países Bajos",
    language: "Neerlandés",
    audience: ["bicicleta", "arte", "canales"],
  },
  {
    name: "Tokio",
    country: "Japón",
    language: "Japonés",
    audience: ["tecnología", "anime", "gastronomía"],
  },
  {
    name: "Nueva York",
    country: "EE.UU.",
    language: "Inglés",
    audience: ["negocios", "arte", "moda"],
  },
  {
    name: "Viena",
    country: "Austria",
    language: "Alemán",
    audience: ["música clásica", "arquitectura", "museos"],
  },
  {
    name: "Bruselas",
    country: "Bélgica",
    language: "Francés / Neerlandés",
    audience: ["chocolate", "cerveza", "arte"],
  },
  {
    name: "Sofía",
    country: "Bulgaria",
    language: "Búlgaro",
    audience: ["historia", "naturaleza", "turismo cultural"],
  },
  {
    name: "Zagreb",
    country: "Croacia",
    language: "Croata",
    audience: ["naturaleza", "historia", "turismo"],
  },
  {
    name: "Praga",
    country: "Chequia",
    language: "Checo",
    audience: ["arquitectura", "cerveza", "historia"],
  },
  {
    name: "Copenhague",
    country: "Dinamarca",
    language: "Danés",
    audience: ["diseño", "bicicleta", "arquitectura"],
  },
  {
    name: "Tallin",
    country: "Estonia",
    language: "Estonio",
    audience: ["historia", "naturaleza", "turismo cultural"],
  },
  {
    name: "Helsinki",
    country: "Finlandia",
    language: "Finés",
    audience: ["tecnología", "naturaleza", "arte moderno"],
  },
  {
    name: "Atenas",
    country: "Grecia",
    language: "Griego",
    audience: ["historia antigua", "playas", "gastronomía"],
  },
  {
    name: "Budapest",
    country: "Hungría",
    language: "Húngaro",
    audience: ["estudiantes", "turismo termal", "arquitectura"],
  },
  {
    name: "Dublín",
    country: "Irlanda",
    language: "Inglés",
    audience: ["música", "pubs", "literatura"],
  },
  {
    name: "Reykjavik",
    country: "Islandia",
    language: "Islandés",
    audience: ["naturaleza", "auroras", "relax"],
  },
  {
    name: "Riga",
    country: "Letonia",
    language: "Letón",
    audience: ["historia", "parejas", "cultura"],
  },
  {
    name: "Vilna",
    country: "Lituania",
    language: "Lituano",
    audience: ["historia", "naturaleza", "familias"],
  },
  {
    name: "Luxemburgo",
    country: "Luxemburgo",
    language: "Luxemburgués",
    audience: ["negocios", "cultura", "naturaleza"],
  },
  {
    name: "Valeta",
    country: "Malta",
    language: "Maltés / Inglés",
    audience: ["playas", "historia", "idiomas"],
  },
  {
    name: "Chisináu",
    country: "Moldavia",
    language: "Rumano",
    audience: ["historia", "vino", "naturaleza"],
  },
  {
    name: "Podgorica",
    country: "Montenegro",
    language: "Montenegrino",
    audience: ["playas", "naturaleza", "aventura"],
  },
  {
    name: "Oslo",
    country: "Noruega",
    language: "Noruego",
    audience: ["naturaleza", "arquitectura", "arte"],
  },
  {
    name: "Varsovia",
    country: "Polonia",
    language: "Polaco",
    audience: ["historia", "turismo urbano", "cultura"],
  },
  {
    name: "Lisboa",
    country: "Portugal",
    language: "Portugués",
    audience: ["parejas", "música", "playas"],
  },
  {
    name: "Bucarest",
    country: "Rumanía",
    language: "Rumano",
    audience: ["historia", "arquitectura", "vida nocturna"],
  },
  {
    name: "Moscú",
    country: "Rusia",
    language: "Ruso",
    audience: ["historia", "arquitectura", "turismo cultural"],
  },
  {
    name: "San_Marino",
    country: "San Marino",
    language: "Italiano",
    audience: ["historia", "turismo", "cultura"],
  },
  {
    name: "Belgrado",
    country: "Serbia",
    language: "Serbio",
    audience: ["vida nocturna", "historia", "música"],
  },
  {
    name: "Bratislava",
    country: "Eslovaquia",
    language: "Eslovaco",
    audience: ["historia", "cultura", "gastronomía"],
  },
  {
    name: "Liubliana",
    country: "Eslovenia",
    language: "Esloveno",
    audience: ["naturaleza", "historia", "gastronomía"],
  },
  {
    name: "Estocolmo",
    country: "Suecia",
    language: "Sueco",
    audience: ["tecnología", "museos", "diseño"],
  },
  {
    name: "Berna",
    country: "Suiza",
    language: "Alemán / Francés",
    audience: ["naturaleza", "turismo", "chocolate"],
  },
  {
    name: "Ciudad del Vaticano",
    country: "Vaticano",
    language: "Latín / Italiano",
    audience: ["religión", "historia", "arte"],
  },
  {
    name: "Andorra la Vella",
    country: "Andorra",
    language: "Catalán",
    audience: ["compras", "esquí", "naturaleza"],
  },
  {
    name: "Skopie",
    country: "Macedonia del Norte",
    language: "Macedonio",
    audience: ["historia", "turismo", "naturaleza"],
  },
  {
    name: "Mónaco",
    country: "Mónaco",
    language: "Francés",
    audience: ["lujo", "casino", "Fórmula 1"],
  },
  {
    name: "Tirana",
    country: "Albania",
    language: "Albanés",
    audience: ["historia", "playas", "naturaleza"],
  },
];

export default destinations;
async function run() {
  try {
    await sequelize.authenticate();
    await Destination.sync({ force: true });
    await Destination.bulkCreate(destinations);
    console.log("Destinos insertados correctamente.");
  } catch (err) {
    console.error("Error insertando destinos:", err);
  } finally {
    await sequelize.close();
  }
}

run();
