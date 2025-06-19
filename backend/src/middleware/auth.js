const jwt = require("jsonwebtoken")
const { User } = require("../models")

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access token required",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] },
    })

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token - user not found",
      })
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        status: "error",
        message: "Account suspended",
      })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Token expired",
      })
    }

    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    })
  }
}

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "Insufficient permissions",
      })
    }

    next()
  }
}

const requireAdmin = requireRole(["admin"])
const requireAdminOrReviewer = requireRole(["admin", "reviewer"])

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireAdminOrReviewer,
}
