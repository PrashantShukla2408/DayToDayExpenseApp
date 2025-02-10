const path = require("path");

const User = require("../models/userModel");
exports.postUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({
      name: name,
      email: email,
      password: password,
    });
    res.status(201).json("User created successfully");
  } catch (err) {
    console.log("Error creating user:", err);
    res.status(500).json({ message: "Error creating user", err });
  }
};
