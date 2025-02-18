const path = require("path");
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const morgan = require("morgan");

const userRoutes = require("./routes/users");
const expenseRoutes = require("./routes/expenses");
const paymentRoutes = require("./routes/payments");
const premiumroutes = require("./routes/premiums");
const passwordRoutes = require("./routes/passwords");
const reportRoutes = require("./routes/reports");

const rootDir = require("./util/path");

const sequelize = require("./util/database");

const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const Download = require("./models/downloadModel");

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/users", userRoutes);
app.use("/expenses", expenseRoutes);
app.use(paymentRoutes);
app.use("/premium", premiumroutes);
app.use("/password", passwordRoutes);
app.use(reportRoutes);

app.get("/password/resetPassword/:resetToken", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "resetPassword.html"));
});

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Download);
Download.belongsTo(User);

console.log(process.env.NODE_ENV);

sequelize
  .sync()
  .then((result) => {
    console.log(result);
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server is running successfully");
    });
  })
  .catch((err) => {
    console.log(err);
  });
