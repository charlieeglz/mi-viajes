const { Sequelize, DataTypes } = require("sequelize");
const { faker } = require("@faker-js/faker");
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

    const CountryCostIndex = sequelize.define(
      "CountryCostIndex",
      {
        country: { type: DataTypes.STRING, primaryKey: true },
        bigMacIndex: { type: DataTypes.FLOAT, allowNull: false },
      },
      { tableName: "CountryCostIndex", timestamps: false }
    );
    await CountryCostIndex.sync({ force: true });
    console.log("Tabla CountryCostIndex creada");

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
      { country: "Ucrania", bigMacIndex: 1.8 },
      { country: "Rusia", bigMacIndex: 2.2 },
      { country: "Japón", bigMacIndex: 2.6 },
      { country: "EE.UU.", bigMacIndex: 5.66 },
    ]);
    console.log("✔ CountryCostIndex poblada");

    // 4) Definir modelo Destination para cargar IDs, nombres y país
    const Destination = sequelize.define(
      "Destination",
      {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        country: { type: DataTypes.STRING, allowNull: false },
      },
      { tableName: "Destinations", timestamps: false }
    );
    await Destination.sync();

    // 5) Recuperar lista de destinos con coordenadas válidas
    const originCoords = {
      Madrid: { lat: 40.4168, lon: -3.7038 },
      Paris: { lat: 48.8566, lon: 2.3522 },
      Londres: { lat: 51.5074, lon: -0.1278 },
      Roma: { lat: 41.9028, lon: 12.4964 },
      Berlin: { lat: 52.52, lon: 13.405 },
      Tirana: { lat: 41.3317, lon: 19.8172 },
      Andorra_la_Vella: { lat: 42.5075, lon: 1.5218 },
      Viena: { lat: 48.2092, lon: 16.3728 },
      Minsk: { lat: 53.9678, lon: 27.5766 },
      Bruselas: { lat: 50.8371, lon: 4.3676 },
      Sarajevo: { lat: 43.8608, lon: 18.4214 },
      Sofia: { lat: 42.6977, lon: 23.3219 },
      Zagreb: { lat: 45.815, lon: 15.9819 },
      Nicosia: { lat: 35.1856, lon: 33.3823 },
      Praga: { lat: 50.0755, lon: 14.4378 },
      Copenhague: { lat: 55.6761, lon: 12.5683 },
      Tallin: { lat: 59.437, lon: 24.7536 },
      Helsinki: { lat: 60.1699, lon: 24.9384 },
      Budapest: { lat: 47.4979, lon: 19.0402 },
      Dublin: { lat: 53.3498, lon: -6.2603 },
      Reykjavik: { lat: 64.1466, lon: -21.9426 },
      Riga: { lat: 56.9496, lon: 24.1052 },
      Vilna: { lat: 54.6872, lon: 25.2797 },
      Luxemburgo: { lat: 49.6116, lon: 6.1319 },
      Valeta: { lat: 35.8997, lon: 14.5146 },
      Chisinau: { lat: 47.0105, lon: 28.8638 },
      Monaco: { lat: 43.7384, lon: 7.4246 },
      Podgorica: { lat: 42.4304, lon: 19.2594 },
      Amsterdam: { lat: 52.3676, lon: 4.9041 },
      Skopie: { lat: 41.9973, lon: 21.428 },
      Oslo: { lat: 59.9139, lon: 10.7522 },
      Varsovia: { lat: 52.2297, lon: 21.0122 },
      Lisboa: { lat: 38.7223, lon: -9.1393 },
      Bucarest: { lat: 44.4268, lon: 26.1025 },
      Moscu: { lat: 55.7558, lon: 37.6173 },
      San_Marino: { lat: 43.9333, lon: 12.45 },
      Belgrado: { lat: 44.7866, lon: 20.4489 },
      Bratislava: { lat: 48.1486, lon: 17.1077 },
      Liubliana: { lat: 46.0569, lon: 14.5058 },
      Estocolmo: { lat: 59.3293, lon: 18.0686 },
      Berna: { lat: 46.948, lon: 7.4474 },
      Kiev: { lat: 50.4501, lon: 30.5234 },
      Ciudad_del_Vaticano: { lat: 41.9029, lon: 12.4534 },
    };

    const destCoords = {
      Madrid: { lat: 40.4168, lon: -3.7038 },
      Paris: { lat: 48.8566, lon: 2.3522 },
      Londres: { lat: 51.5074, lon: -0.1278 },
      Roma: { lat: 41.9028, lon: 12.4964 },
      Berlin: { lat: 52.52, lon: 13.405 },
      Tirana: { lat: 41.3317, lon: 19.8172 },
      Andorra_la_Vella: { lat: 42.5075, lon: 1.5218 },
      Viena: { lat: 48.2092, lon: 16.3728 },
      Minsk: { lat: 53.9678, lon: 27.5766 },
      Bruselas: { lat: 50.8371, lon: 4.3676 },
      Sarajevo: { lat: 43.8608, lon: 18.4214 },
      Sofia: { lat: 42.6977, lon: 23.3219 },
      Zagreb: { lat: 45.815, lon: 15.9819 },
      Nicosia: { lat: 35.1856, lon: 33.3823 },
      Praga: { lat: 50.0755, lon: 14.4378 },
      Copenhague: { lat: 55.6761, lon: 12.5683 },
      Tallin: { lat: 59.437, lon: 24.7536 },
      Helsinki: { lat: 60.1699, lon: 24.9384 },
      Budapest: { lat: 47.4979, lon: 19.0402 },
      Dublin: { lat: 53.3498, lon: -6.2603 },
      Reykjavik: { lat: 64.1466, lon: -21.9426 },
      Riga: { lat: 56.9496, lon: 24.1052 },
      Vilna: { lat: 54.6872, lon: 25.2797 },
      Luxemburgo: { lat: 49.6116, lon: 6.1319 },
      Valeta: { lat: 35.8997, lon: 14.5146 },
      Chisinau: { lat: 47.0105, lon: 28.8638 },
      Monaco: { lat: 43.7384, lon: 7.4246 },
      Podgorica: { lat: 42.4304, lon: 19.2594 },
      Amsterdam: { lat: 52.3676, lon: 4.9041 },
      Skopie: { lat: 41.9973, lon: 21.428 },
      Oslo: { lat: 59.9139, lon: 10.7522 },
      Varsovia: { lat: 52.2297, lon: 21.0122 },
      Lisboa: { lat: 38.7223, lon: -9.1393 },
      Bucarest: { lat: 44.4268, lon: 26.1025 },
      Moscu: { lat: 55.7558, lon: 37.6173 },
      San_Marino: { lat: 43.9333, lon: 12.45 },
      Belgrado: { lat: 44.7866, lon: 20.4489 },
      Bratislava: { lat: 48.1486, lon: 17.1077 },
      Liubliana: { lat: 46.0569, lon: 14.5058 },
      Estocolmo: { lat: 59.3293, lon: 18.0686 },
      Berna: { lat: 46.948, lon: 7.4474 },
      Kiev: { lat: 50.4501, lon: 30.5234 },
      Ciudad_del_Vaticano: { lat: 41.9029, lon: 12.4534 },
      Tokio: { lat: 35.6895, lon: 139.6917 },
      Nueva_York: { lat: 40.7128, lon: -74.006 },
    };

    const rawDests = await Destination.findAll({
      attributes: ["id", "name", "country"],
    });
    const destList = rawDests
      .map((d) => ({ id: d.id, name: d.name, country: d.country }))
      .filter((d) => destCoords[d.name]);
    if (destList.length === 0)
      throw new Error("No hay destinos con coordenadas válidas");

    // 6) Definir modelo Trip y (re)crear tabla
    const Trip = sequelize.define(
      "Trip",
      {
        origin: { type: DataTypes.STRING, allowNull: false },
        destinationId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "destination_id",
        },
        cost: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        daysMin: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "days_min",
        },
        daysMax: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "days_max",
        },
        seasonType: {
          type: DataTypes.ENUM("high", "low"),
          allowNull: false,
          field: "season_type",
        },
      },
      { tableName: "Trips", underscored: true, timestamps: true }
    );
    await Trip.sync({ force: true });
    console.log("🗑 Tabla Trips (re)creada");

    // Haversine para distancia km
    const toRad = (x) => (x * Math.PI) / 180;
    const haversine = (a, b) => {
      const R = 6371;
      const dLat = toRad(b.lat - a.lat);
      const dLon = toRad(b.lon - a.lon);
      const sinDlat = Math.sin(dLat / 2);
      const sinDlon = Math.sin(dLon / 2);
      const h =
        sinDlat * sinDlat +
        sinDlon * sinDlon * Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat));
      return 2 * R * Math.asin(Math.sqrt(h));
    };

    // 7) Carga índices de coste para normalizar lodging
    const indices = await CountryCostIndex.findAll();
    const baseIndex = indices.find((i) => i.country === "EE.UU.").bigMacIndex;
    const indexMap = indices.reduce(
      (acc, i) => ((acc[i.country] = i.bigMacIndex), acc),
      {}
    );

    // 8) Generar y poblar viajes
    const transportCostPerKm = 0.1;
    const trips = [];

    for (const originCity of Object.keys(originCoords)) {
      for (const dest of destList) {
        const { id, name, country } = dest;

        if (originCity === name) continue; // evitar viajes a sí mismo

        const oCoord = originCoords[originCity];
        const dCoord = destCoords[name];
        if (!oCoord || !dCoord) continue;

        for (const seasonType of ["high", "low"]) {
          const daysMin = faker.number.int({ min: 2, max: 5 });
          const daysMax = daysMin + faker.number.int({ min: 0, max: 7 });

          // transporte según distancia
          const km = haversine(oCoord, dCoord);
          const transportCost = km * transportCostPerKm;

          // lodging según Big Mac index
          const destIndex = indexMap[country] || baseIndex;
          const factor = destIndex / baseIndex;
          const baseLodgingCost = 100 * factor;
          const lodgingCostPerDay = baseLodgingCost * 1.1 + 20;
          const avgDays = (daysMin + daysMax) / 2;
          const lodgingCost = avgDays * lodgingCostPerDay;

          const totalCost = parseFloat(
            (transportCost + lodgingCost).toFixed(2)
          );

          trips.push({
            origin: originCity,
            destinationId: id,
            daysMin,
            daysMax,
            seasonType,
            cost: totalCost,
          });
        }
      }
    }

    console.log(`Generadas ${trips.length} combinaciones únicas`);
    await Trip.bulkCreate(trips);
    console.log(
      `✔ Insertados ${trips.length} viajes con combinaciones completas`
    );
  } catch (err) {
    console.error("Error en seedTrips:", err);
  } finally {
    await sequelize.close();
    process.exit();
  }
})();
