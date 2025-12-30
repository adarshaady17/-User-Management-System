const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User.model");
require("dotenv").config();

describe("Authentication API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/test");
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/auth/signup", () => {
    it("should create a new user with valid data", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          fullName: "Test User",
          email: "test@example.com",
          password: "Test1234"
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe("test@example.com");
      expect(response.body.user.password).toBeUndefined();
    });

    it("should reject signup with invalid email", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          fullName: "Test User",
          email: "invalid-email",
          password: "Test1234"
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should reject signup with weak password", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          fullName: "Test User",
          email: "test@example.com",
          password: "weak"
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should reject duplicate email", async () => {
      await User.create({
        fullName: "Existing User",
        email: "test@example.com",
        password: "hashedpassword"
      });

      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          fullName: "New User",
          email: "test@example.com",
          password: "Test1234"
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("Test1234", 10);
      await User.create({
        fullName: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        status: "active"
      });
    });

    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "Test1234"
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe("test@example.com");
    });

    it("should reject login with invalid password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "WrongPassword"
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should reject login with non-existent email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "Test1234"
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});

