const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

// Parse JSON
app.use(express.json({ limit: "1mb" }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use("/api", limiter);
const apiRoutes = require("./routes");

// Register API routes
app.use("/api", apiRoutes);

const errorHandler = require("./middleware/error.middleware");

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "KYROS Backend is running!",
        timestamp: new Date().toISOString()
    });
});

// Centralized error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

module.exports = app;
