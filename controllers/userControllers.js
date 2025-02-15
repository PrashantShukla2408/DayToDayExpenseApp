const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const Expense = require("../models/expenseModel");
exports.postUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    res.status(201).json("User created successfully");
  } catch (err) {
    console.log("Error creating user:", err);
    res.status(500).json({ message: "Error creating user", err });
  }
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRETKEY);

    res.status(200).json({ message: "Login successful", token: token });
  } catch (err) {
    console.log("Error logging in: ", err);
    res.status(500).json({ message: "Error logging in", err });
  }
};

exports.getUserStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId);
    res.json({ isPremiumUser: user.isPremium });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user status", error });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboardofUsers = await User.findAll({
      attributes: ["id", "name", "totalExpense"],
      order: [["totalExpense", "DESC"]],
    });
    res.json(leaderboardofUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard", error });
  }
};
