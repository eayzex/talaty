const crypto = require("crypto")
const path = require("path")

class Helpers {
  // Generate random string
  generateRandomString(length = 32) {
    return crypto.randomBytes(length).toString("hex")
  }

  // Generate OTP
  generateOTP(length = 6) {
    const digits = "0123456789"
    let otp = ""
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)]
    }
    return otp
  }

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate phone format
  isValidPhone(phone) {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone)
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Get file extension
  getFileExtension(filename) {
    return path.extname(filename).toLowerCase().substring(1)
  }

  // Sanitize filename
  sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9.-]/g, "_")
  }

  // Generate unique filename
  generateUniqueFilename(originalName) {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const extension = this.getFileExtension(originalName)
    const baseName = path.basename(originalName, path.extname(originalName))
    return `${timestamp}_${random}_${this.sanitizeFilename(baseName)}.${extension}`
  }

  // Calculate age from date of birth
  calculateAge(dateOfBirth) {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  // Format date
  formatDate(date, format = "YYYY-MM-DD") {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")

    switch (format) {
      case "YYYY-MM-DD":
        return `${year}-${month}-${day}`
      case "DD/MM/YYYY":
        return `${day}/${month}/${year}`
      case "MM/DD/YYYY":
        return `${month}/${day}/${year}`
      default:
        return d.toISOString().split("T")[0]
    }
  }

  // Mask sensitive data
  maskEmail(email) {
    const [username, domain] = email.split("@")
    const maskedUsername = username.charAt(0) + "*".repeat(username.length - 2) + username.charAt(username.length - 1)
    return `${maskedUsername}@${domain}`
  }

  maskPhone(phone) {
    if (phone.length <= 4) return phone
    return phone.substring(0, 2) + "*".repeat(phone.length - 4) + phone.substring(phone.length - 2)
  }

  // Pagination helper
  getPaginationData(page, limit, total) {
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return {
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      total: Number.parseInt(total),
      totalPages,
      hasNext,
      hasPrev,
      nextPage: hasNext ? page + 1 : null,
      prevPage: hasPrev ? page - 1 : null,
    }
  }

  // Response formatter
  formatResponse(status, message, data = null, errors = null) {
    const response = { status, message }
    if (data) response.data = data
    if (errors) response.errors = errors
    return response
  }

  // Success response
  successResponse(message, data = null) {
    return this.formatResponse("success", message, data)
  }

  // Error response
  errorResponse(message, errors = null) {
    return this.formatResponse("error", message, null, errors)
  }

  // Validation error response
  validationErrorResponse(errors) {
    return this.formatResponse("error", "Validation failed", null, errors)
  }
}

module.exports = new Helpers()
