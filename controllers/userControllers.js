const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sibApiV3Sdk = require("sib-api-v3-sdk");
const crypto = require("crypto");
const { Op } = require("sequelize");

const User = require("../models/userModel");
const Expense = require("../models/expenseModel");
const ForgotPassword = require("../models/forgotPasswordModel");

const apiInstance = new sibApiV3Sdk.TransactionalEmailsApi();
const apiKey = sibApiV3Sdk.ApiClient.instance.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;
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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000;

    await ForgotPassword.create({
      userId: user.id,
      token: resetToken,
      expiry: resetTokenExpiry,
    });

    const resetUrl = `http://localhost:5000/password/resetPassword/${resetToken}`;
    const sendSmtpEmail = new sibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: user.email }];
    sendSmtpEmail.sender = {
      email: "prashantshukla1999@gmail.com",
      name: "Prashant",
    };
    sendSmtpEmail.subject = "Reset Password";
    sendSmtpEmail.htmlContent = `
    <p>Click on the link below to reset your password</p>
    <a href="${resetUrl}">Reset password</a>`;
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending reset link", error });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetToken = req.params.resetToken;
    const { password } = req.body;

    const resetTokenData = await ForgotPassword.findOne({
      where: { token: resetToken, expiry: { [Op.gt]: Date.now() } },
    });

    if (!resetTokenData) {
      return res.status(404).json({ message: "Token invalid or expired" });
    }

    const user = await User.findByPk(resetTokenData.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    await resetTokenData.destroy();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error });
  }
};
