const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Downloads = sequelize.define("Download", {
  downloadId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  filename: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fileURL: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Downloads;
