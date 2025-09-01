MiViajes es una aplicación web que permite a los usuarios encontrar destinos de viaje que se ajusten a su presupuesto, disponibilidad de días y preferencias. Utiliza datos económicos reales, como el índice Big Mac, para estimar costes de viaje, e integra un buscador visual con sugerencias de vuelos a través de Skyscanner.

Características

- Búsqueda personalizada de destinos basada en:

  - Ciudad de origen

  - Presupuesto disponible

  - Rango de días disponibles

  - Mes de salida

- Cálculo realista de costes utilizando:

  - Índice Big Mac para estimar coste de vida

  - Distancias reales mediante fórmula de Haversine

  - Variación de precios según temporada alta o baja

  - Visualización con imágenes dinámicas de los países (Pixabay API)

  - Enlace directo a Skyscanner para búsqueda de vuelos

  - Modo claro y oscuro disponible

  - Interfaz adaptable a dispositivos móviles

- Tecnologías utilizadas
  Frontend Backend Base de Datos Otros servicios
  React Node.js (Express) PostgreSQL (Sequelize ORM) API de Skyscanner, API de Pixabay
  CSS personalizado Autenticación con JWT Seeders dinámicos Fórmula de Haversine para distancias
  Estructura del proyecto
  .
  ├── client/ # Aplicación React
  ├── server/ # Backend con Express
  │ ├── models/ # Modelos Sequelize
  │ ├── routes/ # Rutas de la API
  │ ├── utils/ # Lógica de cálculo (Haversine, etc.)
  │ └── seed/ # Archivos para poblar la base de datos
  ├── public/ # Archivos estáticos
  ├── .env # Variables de entorno
  ├── README.md
  └── package.json

# Instalación y ejecución local

- Requisitos

  - Node.js (v18 o superior)

  - PostgreSQL

  - Clave API de Pixabay

  - (Opcional) Clave API de Skyscanner

# Pasos

- Clonar el repositorio

git clone https://github.com/charlieeglz/mi-viajes
cd mi-viajes

- Instalar dependencias

# Backend

cd server
npm install

# Frontend

cd ../client
npm install

- Configurar el archivo .env en la carpeta server con las variables necesarias

DATABASE_URL=postgres://usuario:contraseña@localhost:5432/nombre_bd
PIXABAY_API_KEY=tu_api_key

- Poblar la base de datos con los datos iniciales

node seed/seedDestinations.js
node seed/seedCostIndex.js

- Ejecutar el proyecto

# Backend

cd server
npm run dev

# Frontend

cd ../client
npm start

# Mejoras previstas

- Posibilidad de guardar destinos favoritos

- Nuevos filtros por tipo de viaje, clima o idioma

- Autenticación OAuth

- Traducción de la interfaz a varios idiomas

# Autor

Carlos González Portela
Este proyecto forma parte de mi portfolio personal como desarrollador full-stack.
