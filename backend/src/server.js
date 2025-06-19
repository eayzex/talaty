const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const compression = require("compression")
const rateLimit = require("express-rate-limit")
const fileUpload = require("express-fileupload")
require("dotenv").config()

// Import routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const documentRoutes = require("./routes/documents")
const formRoutes = require("./routes/forms")
const adminRoutes = require("./routes/admin")
const scoreRoutes = require("./routes/scores")

// Import middleware
const errorHandler = require("./middleware/errorHandler")
const { authenticateToken } = require("./middleware/auth")

// Import database
const { sequelize } = require("./models")
const swaggerSetup = require("./config/swagger")

const app = express()

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
)

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
})


// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// File upload middleware
app.use(
  fileUpload({
    limits: { fileSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024 },
    abortOnLimit: true,
    createParentPath: true,
  }),
)

// Compression and logging
app.use(compression())
app.use(morgan("combined"))

// Static files
app.use("/uploads", express.static("uploads"))

// Swagger documentation
swaggerSetup(app)

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Talaty Backend API is running",
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || "v1",
  })
})

// API routes
const API_PREFIX = `/api/${process.env.API_VERSION || "v1"}`

app.use(`/auth`, authRoutes)
app.use(`${API_PREFIX}/users`, authenticateToken, userRoutes)
app.use(`${API_PREFIX}/documents`, authenticateToken, documentRoutes)
app.use(`/forms`, authenticateToken, formRoutes)
app.use(`${API_PREFIX}/admin`, authenticateToken, adminRoutes)
app.use(`${API_PREFIX}/scores`, authenticateToken, scoreRoutes)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  })
})

// Global error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate()
    console.log("✅ Database connection established successfully.")

    // Sync database models
    await sequelize.sync({ alter: true })
    console.log("✅ Database models synchronized.")

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Talaty Backend Server running on port ${PORT}`)
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`)
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
    })
  } catch (error) {
    console.error("❌ Unable to start server:", error)
    process.exit(1)
  }
}

startServer()

module.exports = app
