// seedBigMac.js
require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

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

    const CountryCostIndex = sequelize.define(
      "CountryCostIndex",
      {
        country: { type: DataTypes.STRING, primaryKey: true },
        bigMacIndex: { type: DataTypes.FLOAT, allowNull: false },
      },
      { tableName: "CountryCostIndex", timestamps: false }
    );

    await CountryCostIndex.sync({ force: true });
    console.log("🗑 Tabla CountryCostIndex recreada");

    await CountryCostIndex.bulkCreate([
      { country: "España", bigMacIndex: 3.5 },
      { country: "Italia", bigMacIndex: 4.0 },
      { country: "Alemania", bigMacIndex: 4.2 },
      { country: "Francia", bigMacIndex: 4.1 },
      { country: "Reino Unido", bigMacIndex: 3.8 },
      { country: "Países Bajos", bigMacIndex: 4.5 },
      { country: "Portugal", bigMacIndex: 3.4 },
      { country: "Irlanda", bigMacIndex: 4.8 },
      { country: "Bélgica", bigMacIndex: 4.3 },
      { country: "Suiza", bigMacIndex: 6.5 },
      { country: "Austria", bigMacIndex: 4.4 },
      { country: "Suecia", bigMacIndex: 5.2 },
      { country: "Noruega", bigMacIndex: 5.6 },
      { country: "Dinamarca", bigMacIndex: 5.0 },
      { country: "Finlandia", bigMacIndex: 4.6 },
      { country: "Polonia", bigMacIndex: 3.0 },
      { country: "Chequia", bigMacIndex: 3.3 },
      { country: "Hungría", bigMacIndex: 2.9 },
      { country: "Eslovaquia", bigMacIndex: 3.2 },
      { country: "Eslovenia", bigMacIndex: 3.6 },
      { country: "Croacia", bigMacIndex: 3.7 },
      { country: "Rumanía", bigMacIndex: 2.8 },
      { country: "Bulgaria", bigMacIndex: 2.5 },
      { country: "Grecia", bigMacIndex: 3.6 },
      { country: "Chipre", bigMacIndex: 3.9 },
      { country: "Malta", bigMacIndex: 4.0 },
      { country: "Letonia", bigMacIndex: 3.2 },
      { country: "Lituania", bigMacIndex: 3.1 },
      { country: "Estonia", bigMacIndex: 3.5 },
      { country: "Luxemburgo", bigMacIndex: 4.7 },
      { country: "Mónaco", bigMacIndex: 6.0 },
      { country: "Andorra", bigMacIndex: 4.3 },
      { country: "San Marino", bigMacIndex: 4.5 },
      { country: "Vaticano", bigMacIndex: 4.0 },
      { country: "Serbia", bigMacIndex: 2.6 },
      { country: "Montenegro", bigMacIndex: 2.7 },
      { country: "Macedonia del Norte", bigMacIndex: 2.5 },
      { country: "Albania", bigMacIndex: 2.3 },
      { country: "Bosnia y Herzegovina", bigMacIndex: 2.4 },
      { country: "Moldavia", bigMacIndex: 2.2 },
      { country: "Bielorrusia", bigMacIndex: 2.1 },
      { country: "Rusia", bigMacIndex: 2.2 },
      { country: "Japón", bigMacIndex: 2.6 },
      { country: "EE.UU.", bigMacIndex: 5.66 },
    ]);

    console.log("✔ CountryCostIndex poblada con éxito");
  } catch (err) {
    console.error("❌ Error en seedBigMac:", err);
  } finally {
    await sequelize.close();
    process.exit();
  }
})();
