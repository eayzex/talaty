const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { User, OTP, Score } = require("../models")
const { validate, registerSchema, loginSchema, otpSchema } = require("../middleware/validation")
const { authenticateToken } = require("../middleware/auth")
const emailService = require("../services/emailService")
const auditService = require("../services/auditService")

const router = express.Router()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - first_name
 *               - last_name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
router.post("/register", validate(registerSchema), async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "User already exists with this email",
      })
    }

    // Hash password
    const saltRounds = Number.parseInt(process.env.BCRYPT_ROUNDS) || 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      phone,
    })

    // Create initial score
    await Score.create({
      user_id: user.id,
      total_score: 35,
      registration_score: 35,
      calculation_details: {
        registration: 35,
        documents: 0,
        forms: 0,
        verification: 0,
      },
    })

    // Generate OTP for email verification
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await OTP.create({
      user_id: user.id,
      email,
      otp_code: otpCode,
      otp_type: "email_verification",
      expires_at: expiresAt,
    })

    // Send verification email
    await emailService.sendVerificationEmail(email, otpCode, first_name)

    // Log audit
    await auditService.log({
      user_id: user.id,
      action: "register",
      resource_type: "user",
      resource_id: user.id,
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
    })

    res.status(201).json({
      status: "success",
      message: "User registered successfully. Please verify your email.",
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          status: user.status,
        },
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      status: "error",
      message: "Registration failed",
    })
  }
})

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       423:
 *         description: Account locked
 */
router.post("/login", validate(loginSchema), async (req, res) => {
  try {
    console.log("login")
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      })
    }

    // Check if account is locked
    if (user.locked_until && user.locked_until > new Date()) {
      return res.status(423).json({
        status: "error",
        message: "Account temporarily locked due to too many failed attempts",
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      // Increment login attempts
      await user.update({
        login_attempts: user.login_attempts + 1,
        locked_until: user.login_attempts >= 4 ? new Date(Date.now() + 30 * 60 * 1000) : null,
      })

      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      })
    }

    // Check account status
    if (user.status === "suspended") {
      return res.status(403).json({
        status: "error",
        message: "Account suspended",
      })
    }

    // Reset login attempts and update last login
    await user.update({
      login_attempts: 0,
      locked_until: null,
      last_login: new Date(),
    })

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" },
    )

    // Log audit
    await auditService.log({
      user_id: user.id,
      action: "login",
      resource_type: "user",
      resource_id: user.id,
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
    })

    res.json({
      status: "success",
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          status: user.status,
          email_verified: user.email_verified,
          kyc_status: user.kyc_status,
        },
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      status: "error",
      message: "Login failed",
    })
  }
})

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp_code
 *               - otp_type
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               otp_code:
 *                 type: string
 *               otp_type:
 *                 type: string
 *                 enum: [email_verification, phone_verification, password_reset, login_verification]
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/verify-otp", validate(otpSchema), async (req, res) => {
  try {
    const { email, phone, otp_code, otp_type } = req.body

    // Find OTP
    const whereClause = { otp_code, otp_type, used: false }
    if (email) whereClause.email = email
    if (phone) whereClause.phone = phone

    const otp = await OTP.findOne({
      where: whereClause,
      include: [{ model: User, as: "user" }],
    })

    if (!otp) {
      return res.status(400).json({
        status: "error",
        message: "Invalid OTP",
      })
    }

    // Check if OTP is expired
    if (otp.expires_at < new Date()) {
      return res.status(400).json({
        status: "error",
        message: "OTP expired",
      })
    }

    // Check attempts
    if (otp.attempts >= otp.max_attempts) {
      return res.status(400).json({
        status: "error",
        message: "Maximum attempts exceeded",
      })
    }

    // Mark OTP as used
    await otp.update({
      used: true,
      used_at: new Date(),
    })

    // Update user verification status
    if (otp.user) {
      const updateData = {}
      if (otp_type === "email_verification") {
        updateData.email_verified = true
      } else if (otp_type === "phone_verification") {
        updateData.phone_verified = true
      }

      await otp.user.update(updateData)

      // Log audit
      await auditService.log({
        user_id: otp.user.id,
        action: "verify_otp",
        resource_type: "otp",
        resource_id: otp.id,
        ip_address: req.ip,
        user_agent: req.get("User-Agent"),
        metadata: { otp_type },
      })
    }

    res.json({
      status: "success",
      message: "OTP verified successfully",
    })
  } catch (error) {
    console.error("OTP verification error:", error)
    res.status(500).json({
      status: "error",
      message: "OTP verification failed",
    })
  }
})

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Score,
          as: "score",
        },
      ],
    })

    res.json({
      status: "success",
      data: { user },
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to get profile",
    })
  }
})

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    // Log audit
    await auditService.log({
      user_id: req.user.id,
      action: "logout",
      resource_type: "user",
      resource_id: req.user.id,
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
    })

    res.json({
      status: "success",
      message: "Logout successful",
    })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({
      status: "error",
      message: "Logout failed",
    })
  }
})

module.exports = router
