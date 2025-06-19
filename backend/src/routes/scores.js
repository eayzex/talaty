const express = require("express")
const { Score, User, Document, Form } = require("../models")
const scoreService = require("../services/scoreService")
const auditService = require("../services/auditService")

const router = express.Router()

/**
 * @swagger
 * /scores:
 *   get:
 *     summary: Get user score
 *     tags: [Scores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Score retrieved successfully
 */
router.get("/", async (req, res) => {
  try {
    const score = await Score.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email", "first_name", "last_name", "kyc_status"],
        },
      ],
    })

    if (!score) {
      // Create initial score if it doesn't exist
      const newScore = await Score.create({
        user_id: req.user.id,
        total_score: 35,
        registration_score: 35,
      })

      return res.json({
        status: "success",
        data: { score: newScore },
      })
    }

    res.json({
      status: "success",
      data: { score },
    })
  } catch (error) {
    console.error("Get score error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to get score",
    })
  }
})

/**
 * @swagger
 * /scores/recalculate:
 *   post:
 *     summary: Recalculate user score
 *     tags: [Scores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Score recalculated successfully
 */
router.post("/recalculate", async (req, res) => {
  try {
    const score = await scoreService.calculateScore(req.user.id)

    // Log audit
    await auditService.log({
      user_id: req.user.id,
      action: "recalculate_score",
      resource_type: "score",
      resource_id: score.id,
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
      metadata: {
        total_score: score.total_score,
        risk_level: score.risk_level,
      },
    })

    res.json({
      status: "success",
      message: "Score recalculated successfully",
      data: { score },
    })
  } catch (error) {
    console.error("Recalculate score error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to recalculate score",
    })
  }
})

/**
 * @swagger
 * /scores/breakdown:
 *   get:
 *     summary: Get detailed score breakdown
 *     tags: [Scores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Score breakdown retrieved successfully
 */
router.get("/breakdown", async (req, res) => {
  try {
    const score = await Score.findOne({
      where: { user_id: req.user.id },
    })

    if (!score) {
      return res.status(404).json({
        status: "error",
        message: "Score not found",
      })
    }

    // Get additional data for breakdown
    const documents = await Document.findAll({
      where: { user_id: req.user.id },
      attributes: ["id", "document_type", "status"],
    })

    const forms = await Form.findAll({
      where: { user_id: req.user.id },
      attributes: ["id", "form_type", "status", "completion_percentage"],
    })

    const user = await User.findByPk(req.user.id, {
      attributes: ["email_verified", "phone_verified", "kyc_status"],
    })

    const breakdown = {
      total_score: score.total_score,
      risk_level: score.risk_level,
      components: {
        registration: {
          score: score.registration_score,
          max_score: 35,
          description: "Base registration score",
        },
        documents: {
          score: score.document_score,
          max_score: 40,
          description: "Document verification score",
          details: {
            uploaded: documents.length,
            approved: documents.filter((d) => d.status === "approved").length,
            pending: documents.filter((d) => d.status === "pending").length,
            rejected: documents.filter((d) => d.status === "rejected").length,
          },
        },
        forms: {
          score: score.form_score,
          max_score: 40,
          description: "Form completion score",
          details: {
            total: forms.length,
            completed: forms.filter((f) => f.status === "submitted").length,
            draft: forms.filter((f) => f.status === "draft").length,
            completion_rates: forms.map((f) => ({
              type: f.form_type,
              completion: f.completion_percentage,
            })),
          },
        },
        verification: {
          score: score.verification_score,
          max_score: 20,
          description: "Account verification score",
          details: {
            email_verified: user.email_verified,
            phone_verified: user.phone_verified,
            kyc_status: user.kyc_status,
          },
        },
      },
      recommendations: generateRecommendations(score, documents, forms, user),
    }

    res.json({
      status: "success",
      data: { breakdown },
    })
  } catch (error) {
    console.error("Get score breakdown error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to get score breakdown",
    })
  }
})

// Helper function to generate recommendations
function generateRecommendations(score, documents, forms, user) {
  const recommendations = []

  if (score.document_score < 40) {
    const missingDocs = 5 - documents.filter((d) => d.status === "approved").length
    if (missingDocs > 0) {
      recommendations.push({
        type: "documents",
        priority: "high",
        message: `Upload ${missingDocs} more document(s) to improve your score`,
        action: "upload_documents",
        potential_points: missingDocs * 8,
      })
    }
  }

  if (score.form_score < 40) {
    const incompleteForms = forms.filter((f) => f.status !== "submitted")
    if (incompleteForms.length > 0) {
      recommendations.push({
        type: "forms",
        priority: "high",
        message: `Complete ${incompleteForms.length} remaining form(s)`,
        action: "complete_forms",
        potential_points: incompleteForms.length * 10,
      })
    }
  }

  if (!user.email_verified) {
    recommendations.push({
      type: "verification",
      priority: "medium",
      message: "Verify your email address",
      action: "verify_email",
      potential_points: 5,
    })
  }

  if (!user.phone_verified) {
    recommendations.push({
      type: "verification",
      priority: "medium",
      message: "Verify your phone number",
      action: "verify_phone",
      potential_points: 5,
    })
  }

  if (user.kyc_status === "pending") {
    recommendations.push({
      type: "kyc",
      priority: "low",
      message: "Your KYC verification is in progress",
      action: "wait_kyc",
      potential_points: 10,
    })
  }

  return recommendations
}

module.exports = router
