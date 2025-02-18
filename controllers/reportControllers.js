const path = require("path");

const User = require("../models/userModel");
const Expense = require("../models/expenseModel");
const Download = require("../models/downloadModel");

const { Op } = require("sequelize");

const S3services = require("../services/S3services");

exports.getDailyData = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyData = await Expense.findAll({
      where: {
        UserId: userId,
        createdAt: {
          [Op.gte]: today,
        },
      },
    });
    res.status(200).json(dailyData);
  } catch (error) {
    console.log("Error fetching daily data:", error);
    res.status(500).json({ message: "Error fetching daily data" });
  }
};

exports.getWeeklyData = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weeklyData = await Expense.findAll({
      where: {
        UserId: userId,
        createdAt: {
          [Op.gte]: today.setDate(today.getDate() - 7),
        },
      },
    });
    res.status(200).json(weeklyData);
  } catch (error) {
    console.log("Error fetching weekly data:", error);
    res.status(500).json({ message: "Error fetching weekly data" });
  }
};

exports.getMonthlyData = async (req, res) => {
  try {
    const userId = req.userId;
    const currentMonth = new Date().getMonth();

    const monthlyData = await Expense.findAll({
      where: {
        UserId: userId,
        createdAt: {
          [Op.gte]: new Date(new Date().setMonth(currentMonth - 1)),
        },
      },
    });
    res.status(200).json(monthlyData);
  } catch (error) {
    console.log("Error fetching monthly data:", error);
    res.status(500).json({ message: "Error fetching monthly data" });
  }
};

exports.downloadReport = async (req, res) => {
  const userId = req.userId;
  const expenses = await Expense.findAll({
    where: {
      UserId: userId,
    },
  });
  console.log(expenses);
  const stringifiedExpenses = JSON.stringify(expenses);

  // it should depend upon the userId

  const filename = `Expense${userId}/${new Date()}.txt`;
  const fileURL = await S3services.uploadToS3(stringifiedExpenses, filename);
  console.log(fileURL);

  await Download.create({
    UserId: userId,
    fileURL: fileURL,
    filename: filename,
  });

  res.status(200).json({ fileURL, success: true });
};

exports.getDownloadHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const downloads = await Download.findAll({
      where: {
        UserId: userId,
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(downloads);
  } catch (error) {
    console.log("Error fetching download history:", error);
    res.status(500).json({ message: "Error fetching download history" });
  }
};
