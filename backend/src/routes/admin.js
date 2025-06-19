const express = require("express")
const { User, Document, Form, Score, AuditLog, sequelize } = require("../models")
const { requireAdmin, requireAdminOrReviewer } = require("../middleware/auth")
const auditService = require("../services/auditService")
const scoreService = require("../services/scoreService")

const router = express.Router()

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, suspended, pending, rejected]
 *       - in: query
 *         name: kyc_status
 *         schema:
 *           type: string
 *           enum: [pending, in_review, approved, rejected]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       403:
 *         description: Insufficient permissions
 */
router.get("/users", requireAdmin, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    const whereClause = {}
    if (req.query.status) whereClause.status = req.query.status
    if (req.query.kyc_status) whereClause.kyc_status = req.query.kyc_status

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Score,
          as: "score",
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    })

    res.json({
      status: "success",
      data: {
        users,
        pagination: {
          total: count,
          page,
          limit,
          pages: Math.ceil(count / limit),
        },
      },
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to get users",
    })
  }
})

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user details (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/users/:id", requireAdminOrReviewer, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Score,
          as: "score",
        },
        {
          model: Document,
          as: "documents",
        },
        {
          model: Form,
          as: "forms",
        },
      ],
    })

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      })
    }

    res.json({
      status: "success",
      data: { user },
    })
  } catch (error) {
    console.error("Get user details error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to get user details",
    })
  }
})

/**
 * @swagger
 * /admin/users/{id}/status:
 *   put:
 *     summary: Update user status (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, suspended, pending, rejected]
 *               kyc_status:
 *                 type: string
 *                 enum: [pending, in_review, approved, rejected]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       404:
 *         description: User not found
 */
router.put("/users/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status, kyc_status, notes } = req.body
    const user = await User.findByPk(req.params.id)

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      })
    }

    const oldValues = user.toJSON()
    const updateData = {}

    if (status) updateData.status = status
    if (kyc_status) updateData.kyc_status = kyc_status

    await user.update(updateData)

    // Recalculate score if KYC status changed
    if (kyc_status) {
      await scoreService.calculateScore(user.id)
    }

    // Log audit
    await auditService.log({
      user_id: req.user.id,
      action: "update_user_status",
      resource_type: "user",
      resource_id: user.id,
      old_values: oldValues,
      new_values: updateData,
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
      metadata: { notes },
    })

    res.json({
      status: "success",
      message: "User status updated successfully",
      data: { user },
    })
  } catch (error) {
    console.error("Update user status error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to update user status",
    })
  }
})

/**
 * @swagger
 * /admin/documents:
 *   get:
 *     summary: Get all documents (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, expired]
 *       - in: query
 *         name: document_type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 */
router.get("/documents", requireAdminOrReviewer, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    const whereClause = {}
    if (req.query.status) whereClause.status = req.query.status
    if (req.query.document_type) whereClause.document_type = req.query.document_type

    const { count, rows: documents } = await Document.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email", "first_name", "last_name"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    })

    res.json({
      status: "success",
      data: {
        documents,
        pagination: {
          total: count,
          page,
          limit,
          pages: Math.ceil(count / limit),
        },
      },
    })
  } catch (error) {
    console.error("Get documents error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to get documents",
    })
  }
})

/**
 * @swagger
 * /admin/documents/{id}/verify:
 *   put:
 *     summary: Verify document (Admin/Reviewer only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *               verification_notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Document verified successfully
 *       404:
 *         description: Document not found
 */
router.put("/documents/:id/verify", requireAdminOrReviewer, async (req, res) => {
  try {
    const { status, verification_notes } = req.body
    const document = await Document.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    })

    if (!document) {
      return res.status(404).json({
        status: "error",
        message: "Document not found",
      })
    }

    const oldValues = document.toJSON()

    await document.update({
      status,
      verification_notes,
      verified_by: req.user.id,
      verified_at: new Date(),
    })

    // Recalculate user score
    await scoreService.calculateScore(document.user_id)

    // Log audit
    await auditService.log({
      user_id: req.user.id,
      action: "verify_document",
      resource_type: "document",
      resource_id: document.id,
      old_values: oldValues,
      new_values: { status, verification_notes },
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
      metadata: {
        document_owner: document.user_id,
        document_type: document.document_type,
      },
    })

    res.json({
      status: "success",
      message: "Document verified successfully",
      data: { document },
    })
  } catch (error) {
    console.error("Verify document error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to verify document",
    })
  }
})

/**
 * @swagger
 * /admin/analytics:
 *   get:
 *     summary: Get system analytics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 */
router.get("/analytics", requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.count()
    const activeUsers = await User.count({ where: { status: "active" } })
    const pendingUsers = await User.count({ where: { status: "pending" } })
    const suspendedUsers = await User.count({ where: { status: "suspended" } })

    const totalDocuments = await Document.count()
    const pendingDocuments = await Document.count({ where: { status: "pending" } })
    const approvedDocuments = await Document.count({ where: { status: "approved" } })
    const rejectedDocuments = await Document.count({ where: { status: "rejected" } })

    const totalForms = await Form.count()
    const completedForms = await Form.count({ where: { status: "submitted" } })
    const draftForms = await Form.count({ where: { status: "draft" } })

    const averageScore = await Score.findOne({
      attributes: [[sequelize.fn("AVG", sequelize.col("total_score")), "average"]],
    })

    const riskDistribution = await Score.findAll({
      attributes: ["risk_level", [sequelize.fn("COUNT", sequelize.col("risk_level")), "count"]],
      group: ["risk_level"],
    })

    const analytics = {
      users: {
        total: totalUsers,
        active: activeUsers,
        pending: pendingUsers,
        suspended: suspendedUsers,
      },
      documents: {
        total: totalDocuments,
        pending: pendingDocuments,
        approved: approvedDocuments,
        rejected: rejectedDocuments,
      },
      forms: {
        total: totalForms,
        completed: completedForms,
        draft: draftForms,
      },
      scores: {
        average: Number.parseFloat(averageScore?.dataValues?.average || 0).toFixed(2),
        risk_distribution: riskDistribution.map((item) => ({
          level: item.risk_level,
          count: Number.parseInt(item.dataValues.count),
        })),
      },
    }

    res.json({
      status: "success",
      data: { analytics },
    })
  } catch (error) {
    console.error("Get analytics error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to get analytics",
    })
  }
})

/**
 * @swagger
 * /admin/audit-logs:
 *   get:
 *     summary: Get audit logs (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Audit logs retrieved successfully
 */
router.get("/audit-logs", requireAdmin, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 50
    const offset = (page - 1) * limit

    const whereClause = {}
    if (req.query.user_id) whereClause.user_id = req.query.user_id
    if (req.query.action) whereClause.action = req.query.action

    const { count, rows: logs } = await AuditLog.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email", "first_name", "last_name"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    })

    res.json({
      status: "success",
      data: {
        logs,
        pagination: {
          total: count,
          page,
          limit,
          pages: Math.ceil(count / limit),
        },
      },
    })
  } catch (error) {
    console.error("Get audit logs error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to get audit logs",
    })
  }
})

module.exports = router
