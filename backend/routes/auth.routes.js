const express = require("express");
const router = express.Router();
const { signup, login, getMe } = require("../controllers/auth.controller");
const protect = require("../middlewares/auth.middleware");
const handleValidationErrors = require("../middlewares/validation.middleware");
const {
  signupValidation,
  loginValidation
} = require("../validators/auth.validator");

router.post("/signup", signupValidation, handleValidationErrors, signup);
router.post("/login", loginValidation, handleValidationErrors, login);
router.get("/me", protect, getMe);

module.exports = router;
