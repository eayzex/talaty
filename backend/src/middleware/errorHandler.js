const { AuditLog } = require("../models")

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log error
  console.error(err)

  // Sequelize validation error
  if (err.name === "SequelizeValidationError") {
    const message = err.errors.map((error) => error.message).join(", ")
    error = {
      statusCode: 400,
      message,
    }
  }

  // Sequelize unique constraint error
  if (err.name === "SequelizeUniqueConstraintError") {
    const message = "Duplicate field value entered"
    error = {
      statusCode: 400,
      message,
    }
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token"
    error = {
      statusCode: 401,
      message,
    }
  }

  // File upload error
  if (err.code === "LIMIT_FILE_SIZE") {
    const message = "File too large"
    error = {
      statusCode: 400,
      message,
    }
  }

  // Log error to audit log
  if (req.user) {
    AuditLog.create({
      user_id: req.user.id,
      action: "error",
      resource_type: "system",
      status: "error",
      error_message: error.message,
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
      metadata: {
        url: req.originalUrl,
        method: req.method,
        body: req.body,
      },
    }).catch(console.error)
  }

  res.status(error.statusCode || 500).json({
    status: "error",
    message: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}

module.exports = errorHandler
