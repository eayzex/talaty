const Joi = require("joi")

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }))

      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors,
      })
    }

    next()
  }
}

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
  phone: Joi.string()
    .pattern(/^[+]?[1-9][\d]{0,15}$/)
    .optional(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const otpSchema = Joi.object({
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  otp_code: Joi.string().length(6).required(),
  otp_type: Joi.string()
    .valid("email_verification", "phone_verification", "password_reset", "login_verification")
    .required(),
})

const formSchema = Joi.object({
  form_type: Joi.string().valid("personal_info", "business_info", "financial_info", "compliance_info").required(),
  form_data: Joi.object().required(),
})

const documentUploadSchema = Joi.object({
  document_type: Joi.string()
    .valid(
      "id_card",
      "passport",
      "driving_license",
      "business_license",
      "tax_certificate",
      "bank_statement",
      "utility_bill",
      "insurance_document",
      "legal_document",
      "other",
    )
    .required(),
  document_name: Joi.string().min(2).max(100).required(),
  document_number: Joi.string().optional(),
  expiry_date: Joi.date().optional(),
  issue_date: Joi.date().optional(),
  issuing_authority: Joi.string().optional(),
})

const updateProfileSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).optional(),
  last_name: Joi.string().min(2).max(50).optional(),
  phone: Joi.string()
    .pattern(/^[+]?[1-9][\d]{0,15}$/)
    .optional(),
  date_of_birth: Joi.date().optional(),
  nationality: Joi.string().length(2).optional(),
  address: Joi.string().max(500).optional(),
  city: Joi.string().max(100).optional(),
  country: Joi.string().max(100).optional(),
  postal_code: Joi.string().max(20).optional(),
  business_name: Joi.string().max(200).optional(),
  business_type: Joi.string().max(100).optional(),
  business_registration_number: Joi.string().max(50).optional(),
  annual_income: Joi.number().positive().optional(),
  employment_status: Joi.string().max(100).optional(),
})

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  otpSchema,
  formSchema,
  documentUploadSchema,
  updateProfileSchema,
}
