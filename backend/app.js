const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Normalize origin by removing trailing slash
      const normalizedOrigin = origin.replace(/\/$/, '');
      const normalizedAllowed = allowedOrigins.map(o => o.replace(/\/$/, ''));
      
      // Check if origin matches any allowed origin
      if (normalizedAllowed.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        // In production, also allow Vercel preview deployments
        if (process.env.NODE_ENV === 'production') {
          // Allow any *.vercel.app domain
          if (/^https:\/\/.*\.vercel\.app$/.test(normalizedOrigin)) {
            return callback(null, true);
          }
        }
        // In development, be more permissive
        if (process.env.NODE_ENV === 'development') {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
