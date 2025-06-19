const express = require("express")
const { Form } = require("../models")
const { validate, formSchema } = require("../middleware/validation")
const scoreService = require("../services/scoreService")
const auditService = require("../services/auditService")

const router = express.Router()

/**
 * @swagger
 * /forms:
 *   get:
 *     summary: Get user forms
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Forms retrieved successfully
 */
router.get("/", async (req, res) => {
  try {
    const forms = await Form.findAll({
      where: { user_id: req.user.id },
      order: [["created_at", "DESC"]],
    })

    res.json({
      status: "success",
      data: { forms },
    })
  } catch (error) {
    console.error("Get forms error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to get forms",
    })
  }
})

/**
 * @swagger
 * /forms:
 *   post:
 *     summary: Submit form data
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - form_type
 *               - form_data
 *             properties:
 *               form_type:
 *                 type: string
 *                 enum: [personal_info, business_info, financial_info, compliance_info]
 *               form_data:
 *                 type: object
 *     responses:
 *       201:
 *         description: Form submitted successfully
 *       400:
 *         description: Validation error
 */
router.post("/", validate(formSchema), async (req, res) => {
  try {
    const { form_type, form_data } = req.body

    // Calculate completion percentage based on form type
    const completionPercentage = calculateCompletionPercentage(form_type, form_data)

    // Check if form already exists
    const existingForm = await Form.findOne({
      where: {
        user_id: req.user.id,
        form_type,
      },
    })

    let form
    if (existingForm) {
      // Update existing form
      form = await existingForm.update({
        form_data,
        completion_percentage: completionPercentage,
        status: completionPercentage === 100 ? "submitted" : "draft",
        submitted_at: completionPercentage === 100 ? new Date() : null,
        version: existingForm.version + 1,
      })
    } else {
      // Create new form
      form = await Form.create({
        user_id: req.user.id,
        form_type,
        form_data,
        completion_percentage: completionPercentage,
        status: completionPercentage === 100 ? "submitted" : "draft",
        submitted_at: completionPercentage === 100 ? new Date() : null,
      })
    }

    // Recalculate user score if form is completed
    if (completionPercentage === 100) {
      await scoreService.calculateScore(req.user.id)
    }

    // Log audit
    await auditService.log({
      user_id: req.user.id,
      action: existingForm ? "update_form" : "create_form",
      resource_type: "form",
      resource_id: form.id,
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
      metadata: {
        form_type,
        completion_percentage: completionPercentage,
        status: form.status,
      },
    })

    res.status(201).json({
      status: "success",
      message: "Form submitted successfully",
      data: { form },
    })
  } catch (error) {
    console.error("Form submission error:", error)
    res.status(500).json({
      status: "error",
      message: "Form submission failed",
    })
  }
})

/**
 * @swagger
 * /forms/{type}:
 *   get:
 *     summary: Get form by type
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [personal_info, business_info, financial_info, compliance_info]
 *     responses:
 *       200:
 *         description: Form retrieved successfully
 *       404:
 *         description: Form not found
 */
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params

    const form = await Form.findOne({
      where: {
        user_id: req.user.id,
        form_type: type,
      },
    })

    if (!form) {
      return res.status(404).json({
        status: "error",
        message: "Form not found",
      })
    }

    res.json({
      status: "success",
      data: { form },
    })
  } catch (error) {
    console.error("Get form error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to get form",
    })
  }
})

/**
 * @swagger
 * /forms/{id}:
 *   delete:
 *     summary: Delete form
 *     tags: [Forms]
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
 *         description: Form deleted successfully
 *       404:
 *         description: Form not found
 */
router.delete("/:id", async (req, res) => {
  try {
    const form = await Form.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    })

    if (!form) {
      return res.status(404).json({
        status: "error",
        message: "Form not found",
      })
    }

    await form.destroy()

    // Recalculate user score
    await scoreService.calculateScore(req.user.id)

    // Log audit
    await auditService.log({
      user_id: req.user.id,
      action: "delete_form",
      resource_type: "form",
      resource_id: form.id,
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
      metadata: {
        form_type: form.form_type,
      },
    })

    res.json({
      status: "success",
      message: "Form deleted successfully",
    })
  } catch (error) {
    console.error("Delete form error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to delete form",
    })
  }
})

// Helper function to calculate completion percentage
function calculateCompletionPercentage(formType, formData) {
  const requiredFields = {
    personal_info: ["firstName", "lastName", "dateOfBirth", "nationality", "address"],
    business_info: ["businessName", "businessType", "registrationNumber", "industry"],
    financial_info: ["annualIncome", "employmentStatus", "bankName", "accountType"],
    compliance_info: ["taxId", "riskTolerance", "investmentExperience", "sourceOfFunds"],
  }

  const required = requiredFields[formType] || []
  const completed = required.filter((field) => formData[field] && formData[field].toString().trim() !== "")

  return Math.round((completed.length / required.length) * 100)
}

module.exports = router
