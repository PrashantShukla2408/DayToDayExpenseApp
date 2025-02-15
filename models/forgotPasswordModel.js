const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ForgotPassword = sequelize.define("ForgotPassword", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  expiry: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = ForgotPassword;
