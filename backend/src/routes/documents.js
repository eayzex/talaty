const express = require("express")
const path = require("path")
const fs = require("fs").promises
const { Document, User } = require("../models")
const { validate, documentUploadSchema } = require("../middleware/validation")
const scoreService = require("../services/scoreService")
const auditService = require("../services/auditService")

const router = express.Router()

/**
 * @swagger
 * /documents:
 *   get:
 *     summary: Get user documents
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 */
router.get("/", async (req, res) => {
  try {
    const documents = await Document.findAll({
      where: { user_id: req.user.id },
      order: [["created_at", "DESC"]],
    })

    res.json({
      status: "success",
      data: { documents },
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
 * /documents/upload:
 *   post:
 *     summary: Upload a document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - document_type
 *               - document_name
 *               - file
 *             properties:
 *               document_type:
 *                 type: string
 *                 enum: [id_card, passport, driving_license, business_license, tax_certificate, bank_statement, utility_bill, insurance_document, legal_document, other]
 *               document_name:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *               document_number:
 *                 type: string
 *               expiry_date:
 *                 type: string
 *                 format: date
 *               issue_date:
 *                 type: string
 *                 format: date
 *               issuing_authority:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *       400:
 *         description: Validation error or no file uploaded
 */
router.post("/upload", async (req, res) => {
  try {
    // Validate request body
    const { error } = documentUploadSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        })),
      })
    }

    // Check if file was uploaded
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded",
      })
    }

    const file = req.files.file
    const { document_type, document_name, document_number, expiry_date, issue_date, issuing_authority } = req.body

    // Validate file type
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(",") || ["jpg", "jpeg", "png", "pdf", "doc", "docx"]
    const fileExtension = path.extname(file.name).toLowerCase().substring(1)

    if (!allowedTypes.includes(fileExtension)) {
      return res.status(400).json({
        status: "error",
        message: `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`,
      })
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "uploads", "documents", req.user.id)
    await fs.mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name}`
    const filePath = path.join(uploadDir, fileName)

    // Move file to upload directory
    await file.mv(filePath)

    // Save document to database
    const document = await Document.create({
      user_id: req.user.id,
      document_type,
      document_name,
      file_name: fileName,
      file_path: filePath,
      file_size: file.size,
      file_type: file.mimetype,
      document_number,
      expiry_date,
      issue_date,
      issuing_authority,
    })

    // Recalculate user score
    await scoreService.calculateScore(req.user.id)

    // Log audit
    await auditService.log({
      user_id: req.user.id,
      action: "upload_document",
      resource_type: "document",
      resource_id: document.id,
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
      metadata: {
        document_type,
        document_name,
        file_size: file.size,
      },
    })

    res.status(201).json({
      status: "success",
      message: "Document uploaded successfully",
      data: { document },
    })
  } catch (error) {
    console.error("Document upload error:", error)
    res.status(500).json({
      status: "error",
      message: "Document upload failed",
    })
  }
})

/**
 * @swagger
 * /documents/{id}:
 *   get:
 *     summary: Get document by ID
 *     tags: [Documents]
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
 *         description: Document retrieved successfully
 *       404:
 *         description: Document not found
 */
router.get("/:id", async (req, res) => {
  try {
    const document = await Document.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    })

    if (!document) {
      return res.status(404).json({
        status: "error",
        message: "Document not found",
      })
    }

    res.json({
      status: "success",
      data: { document },
    })
  } catch (error) {
    console.error("Get document error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to get document",
    })
  }
})

/**
 * @swagger
 * /documents/{id}/download:
 *   get:
 *     summary: Download document file
 *     tags: [Documents]
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
 *         description: File downloaded successfully
 *       404:
 *         description: Document not found
 */
router.get("/:id/download", async (req, res) => {
  try {
    const document = await Document.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    })

    if (!document) {
      return res.status(404).json({
        status: "error",
        message: "Document not found",
      })
    }

    // Check if file exists
    try {
      await fs.access(document.file_path)
    } catch {
      return res.status(404).json({
        status: "error",
        message: "File not found on server",
      })
    }

    // Log audit
    await auditService.log({
      user_id: req.user.id,
      action: "download_document",
      resource_type: "document",
      resource_id: document.id,
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
    })

    res.download(document.file_path, document.file_name)
  } catch (error) {
    console.error("Download document error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to download document",
    })
  }
})

/**
 * @swagger
 * /documents/{id}:
 *   delete:
 *     summary: Delete document
 *     tags: [Documents]
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
 *         description: Document deleted successfully
 *       404:
 *         description: Document not found
 */
router.delete("/:id", async (req, res) => {
  try {
    const document = await Document.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    })

    if (!document) {
      return res.status(404).json({
        status: "error",
        message: "Document not found",
      })
    }

    // Delete file from filesystem
    try {
      await fs.unlink(document.file_path)
    } catch (error) {
      console.warn("Failed to delete file from filesystem:", error.message)
    }

    // Delete from database
    await document.destroy()

    // Recalculate user score
    await scoreService.calculateScore(req.user.id)

    // Log audit
    await auditService.log({
      user_id: req.user.id,
      action: "delete_document",
      resource_type: "document",
      resource_id: document.id,
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
      metadata: {
        document_type: document.document_type,
        document_name: document.document_name,
      },
    })

    res.json({
      status: "success",
      message: "Document deleted successfully",
    })
  } catch (error) {
    console.error("Delete document error:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to delete document",
    })
  }
})

module.exports = router
