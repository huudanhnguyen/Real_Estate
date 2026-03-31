require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to database successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
  }
}

module.exports = {
  sequelize,
  testConnection,
};
