const Sequelize = require("sequelize");
const path = require("path");

const DATABASE = new Sequelize({
  dialect: "sqlite",
  logging: console.log,
  storage: path.join(__dirname, "db.sqlite"),
});

async () => {
  try {
    console.log("Database is connecting.....connected!");
    DATABASE.authenticate();
  } catch (error) {
    console.error("An error occurred while connecting to the database");
  }
};

module.exports = DATABASE