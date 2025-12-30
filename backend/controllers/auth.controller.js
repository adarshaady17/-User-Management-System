const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/jwt");

exports.signup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Check if this is the first user - make them admin
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "user";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token: generateToken(user._id),
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    if (user.status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Please contact admin."
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};
