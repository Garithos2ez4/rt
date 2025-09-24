const { Sequelize } = require("sequelize");
require('dotenv').config();

const env = process.env;

console.log("Iniciando conexión a la base de datos...");

const db = new Sequelize(env.DB_NAME, env.USER_DB, env.PASSWORD_DB, {
  host: env.HOST,
  dialect: "mssql",
  logging: (msg) => console.log("[Sequelize]", msg), // log de todas las queries
  timezone: "+00:00",
  dialectOptions: {
    options: {
      encrypt: false, // false si es local
      trustServerCertificate: true,
      requestTimeout: 30000
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
});


// Función para probar la conexión
async function testConnection() {
  try {
    console.log("Probando conexión...");
    await db.authenticate();
    console.log("✅ Conexión a la base de datos exitosa!");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:");
    console.error("Mensaje:", error.message);
    console.error("Código:", error.original?.code || error.code);
    console.error("Stack trace:", error.stack);
  }
}

// Ejecutar la prueba al arrancar
testConnection();

module.exports = { db };
process.env.DEBUG = "tedious:*";
