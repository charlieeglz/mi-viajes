const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

(async () => {
  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || "127.0.0.1",
      dialect: "mysql",
      logging: false,
    }
  );

  try {
    await sequelize.authenticate();
    console.log("🔌 Conectado a la BD");

    const Destination = sequelize.define(
      "Destination",
      {
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

    await Destination.sync({ force: true });
    console.log("🗑 Tabla Destinations recreada");

    const data = [
      {
        name: "Viena",
        country: "Austria",
        language: "Alemán",
        audience: ["música clásica", "parejas"],
      },
      {
        name: "Bruselas",
        country: "Bélgica",
        language: "Francés / Neerlandés",
        audience: ["negocios", "familias"],
      },
      {
        name: "Sofía",
        country: "Bulgaria",
        language: "Búlgaro",
        audience: ["historia", "viajeros"],
      },
      {
        name: "Zagreb",
        country: "Croacia",
        language: "Croata",
        audience: ["parejas", "cultura"],
      },
      {
        name: "Praga",
        country: "Chequia",
        language: "Checo",
        audience: ["parejas", "estudiantes"],
      },
      {
        name: "Copenhague",
        country: "Dinamarca",
        language: "Danés",
        audience: ["familias", "diseño"],
      },
      {
        name: "Tallin",
        country: "Estonia",
        language: "Estonio",
        audience: ["nómadas digitales", "historia"],
      },
      {
        name: "Helsinki",
        country: "Finlandia",
        language: "Finés",
        audience: ["naturaleza", "tecnología"],
      },
      {
        name: "Atenas",
        country: "Grecia",
        language: "Griego",
        audience: ["historia", "familias"],
      },
      {
        name: "Budapest",
        country: "Hungría",
        language: "Húngaro",
        audience: ["estudiantes", "turismo termal"],
      },
      {
        name: "Dublín",
        country: "Irlanda",
        language: "Inglés",
        audience: ["jóvenes", "música"],
      },
      {
        name: "Reykjavik",
        country: "Islandia",
        language: "Islandés",
        audience: ["naturaleza", "aventura"],
      },
      {
        name: "Riga",
        country: "Letonia",
        language: "Letón",
        audience: ["historia", "parejas"],
      },
      {
        name: "Vilna",
        country: "Lituania",
        language: "Lituano",
        audience: ["cultura", "fotografía"],
      },
      {
        name: "Luxemburgo",
        country: "Luxemburgo",
        language: "Luxemburgués / Francés / Alemán",
        audience: ["negocios", "turismo"],
      },
      {
        name: "Valeta",
        country: "Malta",
        language: "Maltés / Inglés",
        audience: ["sol y playa", "historia"],
      },
      {
        name: "Chisinau",
        country: "Moldavia",
        language: "Rumano",
        audience: ["cultura", "viajeros"],
      },
      {
        name: "Podgorica",
        country: "Montenegro",
        language: "Montenegrino",
        audience: ["aventura", "parejas"],
      },
      {
        name: "Oslo",
        country: "Noruega",
        language: "Noruego",
        audience: ["naturaleza", "familias"],
      },
      {
        name: "Varsovia",
        country: "Polonia",
        language: "Polaco",
        audience: ["historia", "jóvenes"],
      },
      {
        name: "Lisboa",
        country: "Portugal",
        language: "Portugués",
        audience: ["parejas", "música"],
      },
      {
        name: "Bucarest",
        country: "Rumanía",
        language: "Rumano",
        audience: ["historia", "estudiantes"],
      },
      {
        name: "Moscu",
        country: "Rusia",
        language: "Ruso",
        audience: ["cultura", "negocios"],
      },
      {
        name: "San_Marino",
        country: "San Marino",
        language: "Italiano",
        audience: ["historia", "curiosidades"],
      },
      {
        name: "Belgrado",
        country: "Serbia",
        language: "Serbio",
        audience: ["vida nocturna", "historia"],
      },
      {
        name: "Bratislava",
        country: "Eslovaquia",
        language: "Eslovaco",
        audience: ["parejas", "viajeros"],
      },
      {
        name: "Liubliana",
        country: "Eslovenia",
        language: "Esloveno",
        audience: ["naturaleza", "jóvenes"],
      },
      {
        name: "Estocolmo",
        country: "Suecia",
        language: "Sueco",
        audience: ["diseño", "familias"],
      },
      {
        name: "Berna",
        country: "Suiza",
        language: "Alemán / Francés",
        audience: ["naturaleza", "turismo"],
      },
      {
        name: "Kiev",
        country: "Ucrania",
        language: "Ucraniano",
        audience: ["historia", "resiliencia"],
      },
      {
        name: "Ciudad_del_Vaticano",
        country: "Ciudad del Vaticano",
        language: "Italiano / Latín",
        audience: ["religión", "turismo"],
      },
      {
        name: "Andorra_la_Vella",
        country: "Andorra",
        language: "Catalán",
        audience: ["naturaleza", "compras"],
      },
      {
        name: "Skopie",
        country: "Macedonia del Norte",
        language: "Macedonio",
        audience: ["cultura", "curiosidades"],
      },
      {
        name: "Mónaco",
        country: "Mónaco",
        language: "Francés",
        audience: ["lujo", "turismo"],
      },
      {
        name: "Tirana",
        country: "Albania",
        language: "Albanés",
        audience: ["viajeros", "aventura"],
      },
      {
        name: "Tokio",
        country: "Japón",
        language: "Japonés",
        audience: ["cultura", "tecnología"],
      },
      {
        name: "Nueva_York",
        country: "EE.UU.",
        language: "Inglés",
        audience: ["negocios", "turismo"],
      },
    ];

    await Destination.bulkCreate(data);
    console.log(`Insertados ${data.length} destinos`);
  } catch (err) {
    console.error("Error en seedDestinations:", err);
  } finally {
    await sequelize.close();
    process.exit();
  }
})();
