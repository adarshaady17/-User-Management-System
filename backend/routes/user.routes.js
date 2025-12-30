const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/role.middleware");
const handleValidationErrors = require("../middlewares/validation.middleware");
const {
  getAllUsers,
  updateStatus,
  updateProfile,
  changePassword
} = require("../controllers/user.controller");
const {
  updateProfileValidation,
  changePasswordValidation,
  updateStatusValidation
} = require("../validators/user.validator");

// Admin routes
router.get("/", protect, isAdmin, getAllUsers);
router.put(
  "/:id/status",
  protect,
  isAdmin,
  updateStatusValidation,
  handleValidationErrors,
  updateStatus
);

// User routes
router.put(
  "/profile",
  protect,
  updateProfileValidation,
  handleValidationErrors,
  updateProfile
);
router.put(
  "/change-password",
  protect,
  changePasswordValidation,
  handleValidationErrors,
  changePassword
);

module.exports = router;
