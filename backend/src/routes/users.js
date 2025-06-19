const express = require("express")
const bcrypt = require("bcryptjs")
const { User, Document, Form, Score } = require("../models")
const { validate, updateProfileSchema } = require("../middleware/validation")
const auditService = require("../services/auditService")

const router = express.Router()

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Score,
          as: "score",
        },
        {
          model: Document,
          as: "documents",
          attributes: ["id", "document_type", "status", "created_at"],
        },
        {
          model: Form,
          as: "forms",
          attributes: ["id", "form_type", "status", "completion_percentage"],
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
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               nationality:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               postal_code:
 *                 type: string
 *               business_name:
 *                 type: string
 *               business_type:
 *                 type: string
 *               business_registration_number:
 *                 type: string
 *               annual_income:
 *                 type: number
 *               employment_status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 */
router.put("/profile", validate(updateProfileSchema), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id)
    const oldValues = user.toJSON()

    await user.update(req.body)

    // Log audit
    await auditService.log({
      user_id: req.user.id,
      action: "update_profile",
      resource_type: "user",
      resource_id: user.id,
      old_values: oldValues,
      new_values: req.body,
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
    })

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    })

    res.json({
      status: "success",
      message: "Profile updated successfully",
      data: { user: updatedUser },
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to update profile",
    })
  }
})

/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - current_password
 *               - new_password
 *             properties:
 *               current_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid current password
 */
router.put("/change-password", async (req, res) => {
  try {
    const { current_password, new_password } = req.body

    if (!current_password || !new_password) {
      return res.status(400).json({
        status: "error",
        message: "Current password and new password are required",
      })
    }

    if (new_password.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "New password must be at least 8 characters long",
      })
    }

    const user = await User.findByPk(req.user.id)

    // Verify current password
    const isValidPassword = await bcrypt.compare(current_password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({
        status: "error",
        message: "Current password is incorrect",
      })
    }

    // Hash new password
    const saltRounds = Number.parseInt(process.env.BCRYPT_ROUNDS) || 12
    const hashedPassword = await bcrypt.hash(new_password, saltRounds)

    await user.update({ password: hashedPassword })

    // Log audit
    await auditService.log({
      user_id: req.user.id,
      action: "change_password",
      resource_type: "user",
      resource_id: user.id,
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
    })

    res.json({
      status: "success",
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to change password",
    })
  }
})

/**
 * @swagger
 * /users/dashboard:
 *   get:
 *     summary: Get dashboard data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 */
router.get("/dashboard", async (req, res) => {
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

    const documents = await Document.findAll({
      where: { user_id: req.user.id },
      attributes: ["id", "document_type", "status", "created_at"],
      order: [["created_at", "DESC"]],
      limit: 5,
    })

    const forms = await Form.findAll({
      where: { user_id: req.user.id },
      attributes: ["id", "form_type", "status", "completion_percentage"],
    })

    const stats = {
      total_documents: await Document.count({ where: { user_id: req.user.id } }),
      approved_documents: await Document.count({
        where: { user_id: req.user.id, status: "approved" },
      }),
      pending_documents: await Document.count({
        where: { user_id: req.user.id, status: "pending" },
      }),
      completed_forms: await Form.count({
        where: { user_id: req.user.id, status: "submitted" },
      }),
      total_forms: 4, // Total number of form types
    }

    const notifications = [
      {
        id: 1,
        type: "info",
        title: "Welcome to Talaty",
        message: "Complete your profile to improve your score",
        read: false,
        created_at: new Date(),
      },
      {
        id: 2,
        type: "success",
        title: "Document Uploaded",
        message: "Your document has been uploaded successfully",
        read: false,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ]

    if (stats.pending_documents > 0) {
      notifications.unshift({
        id: 3,
        type: "warning",
        title: "Documents Pending",
        message: `You have ${stats.pending_documents} document(s) pending verification`,
        read: false,
        created_at: new Date(),
      })
    }

    const dashboardData = {
      user,
      stats,
      recent_documents: documents,
      forms,
      notifications,
      quick_actions: [
        {
          title: "Upload Documents",
          description: "Upload your identity documents",
          url: "/upload",
          icon: "upload",
        },
        {
          title: "Complete Forms",
          description: "Fill out your eKYC forms",
          url: "/forms",
          icon: "form",
        },
        {
          title: "View Reports",
          description: "Check your verification reports",
          url: "/reports",
          icon: "chart",
        },
        {
          title: "Settings",
          description: "Manage your account settings",
          url: "/settings",
          icon: "settings",
        },
      ],
    }

    res.json({
      status: "success",
      data: dashboardData,
    })
  } catch (error) {
    console.error("Get dashboard error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to get dashboard data",
    })
  }
})

module.exports = router
