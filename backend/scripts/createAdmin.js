require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get admin details from command line arguments or use defaults
    const args = process.argv.slice(2);
    const email = args[0] || "admin@example.com";
    const password = args[1] || "Admin1234";
    const fullName = args[2] || "Admin User";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      if (existingAdmin.role === "admin") {
        console.log("❌ Admin user already exists with this email!");
        process.exit(1);
      } else {
        // Update existing user to admin
        existingAdmin.role = "admin";
        const hashedPassword = await bcrypt.hash(password, 10);
        existingAdmin.password = hashedPassword;
        existingAdmin.fullName = fullName;
        await existingAdmin.save();
        console.log("✅ Existing user updated to admin!");
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        process.exit(0);
      }
    }

    // Check if any admin exists
    const anyAdmin = await User.findOne({ role: "admin" });
    if (anyAdmin) {
      console.log("⚠️  An admin user already exists in the system.");
      console.log("   If you want to create another admin, use the database directly.");
      process.exit(1);
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "admin",
      status: "active"
    });

    console.log("✅ Admin user created successfully!");
    console.log(`   Full Name: ${admin.fullName}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${admin.role}`);
    console.log("\n⚠️  Please change the password after first login!");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();

