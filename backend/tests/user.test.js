const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User.model");
const generateToken = require("../utils/jwt");
require("dotenv").config();

describe("User Management API", () => {
  let adminToken;
  let userToken;
  let adminId;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/test");
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    const bcrypt = require("bcryptjs");

    // Create admin user
    const adminPassword = await bcrypt.hash("Admin1234", 10);
    const admin = await User.create({
      fullName: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
      status: "active"
    });
    adminId = admin._id;
    adminToken = generateToken(admin._id);

    // Create regular user
    const userPassword = await bcrypt.hash("User1234", 10);
    const user = await User.create({
      fullName: "Regular User",
      email: "user@example.com",
      password: userPassword,
      role: "user",
      status: "active"
    });
    userId = user._id;
    userToken = generateToken(user._id);
  });

  describe("GET /api/users (Admin only)", () => {
    it("should get all users with pagination for admin", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.users).toBeInstanceOf(Array);
      expect(response.body.pagination).toBeDefined();
    });

    it("should reject non-admin users", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    it("should reject unauthenticated requests", async () => {
      const response = await request(app).get("/api/users");

      expect(response.status).toBe(401);
    });
  });

  describe("PUT /api/users/:id/status (Admin only)", () => {
    it("should update user status for admin", async () => {
      const response = await request(app)
        .put(`/api/users/${userId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "inactive" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.status).toBe("inactive");
    });

    it("should prevent admin from deactivating themselves", async () => {
      const response = await request(app)
        .put(`/api/users/${adminId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "inactive" });

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /api/users/profile", () => {
    it("should update user profile", async () => {
      const response = await request(app)
        .put("/api/users/profile")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          fullName: "Updated Name",
          email: "updated@example.com"
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.fullName).toBe("Updated Name");
    });
  });

  describe("PUT /api/users/change-password", () => {
    it("should change password with correct current password", async () => {
      const response = await request(app)
        .put("/api/users/change-password")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          currentPassword: "User1234",
          newPassword: "NewPass123"
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should reject password change with incorrect current password", async () => {
      const response = await request(app)
        .put("/api/users/change-password")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          currentPassword: "WrongPassword",
          newPassword: "NewPass123"
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});

