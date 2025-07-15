const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);

// Import models
const User = require("./User")(sequelize, DataTypes);
const Room = require("./Room")(sequelize, DataTypes);
const Log = require("./Log")(sequelize, DataTypes);

// Sync all models
sequelize.sync({ alter: true });

module.exports = {
  sequelize,
  User,
  Room,
  Log,
};
