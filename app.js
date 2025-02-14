const path = require("path");
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/users");
const expenseRoutes = require("./routes/expenses");
const paymentRoutes = require("./routes/payments");

const rootDir = require("./util/path");

const sequelize = require("./util/database");

const User = require("./models/userModel");
const Expense = require("./models/expenseModel");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/users", userRoutes);
app.use("/expenses", expenseRoutes);
app.use(paymentRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize
  .sync()
  .then((result) => {
    console.log(result);
    app.listen(5000, () => {
      console.log("Server is running successfully");
    });
  })
  .catch((err) => {
    console.log(err);
  });
