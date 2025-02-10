const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Expense = sequelize.define("Expense", {
  expenseId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
});
module.exports = Expense;
