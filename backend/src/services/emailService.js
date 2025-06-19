const nodemailer = require("nodemailer")

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  async sendVerificationEmail(email, otpCode, firstName) {
    try {
      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: "Verify Your Email - Talaty",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Welcome to Talaty!</h2>
            <p>Hi ${firstName},</p>
            <p>Thank you for registering with Talaty. Please verify your email address using the OTP code below:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #1f2937; font-size: 32px; margin: 0;">${otpCode}</h1>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't create an account with Talaty, please ignore this email.</p>
            <hr style="margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              Best regards,<br>
              The Talaty Team
            </p>
          </div>
        `,
      }

      await this.transporter.sendMail(mailOptions)
      console.log(`Verification email sent to ${email}`)
    } catch (error) {
      console.error("Email sending error:", error)
      throw error
    }
  }

  async sendPasswordResetEmail(email, otpCode, firstName) {
    try {
      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: "Reset Your Password - Talaty",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Password Reset Request</h2>
            <p>Hi ${firstName},</p>
            <p>We received a request to reset your password. Use the OTP code below to reset your password:</p>
            <div style="background-color: #fef2f2; padding: 20px; text-align: center; margin: 20px 0; border: 1px solid #fecaca;">
              <h1 style="color: #dc2626; font-size: 32px; margin: 0;">${otpCode}</h1>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
            <hr style="margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              Best regards,<br>
              The Talaty Team
            </p>
          </div>
        `,
      }

      await this.transporter.sendMail(mailOptions)
      console.log(`Password reset email sent to ${email}`)
    } catch (error) {
      console.error("Email sending error:", error)
      throw error
    }
  }

  async sendWelcomeEmail(email, firstName) {
    try {
      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: "Welcome to Talaty - Your eKYC Journey Begins!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">Welcome to Talaty!</h2>
            <p>Hi ${firstName},</p>
            <p>Congratulations! Your email has been verified and your Talaty account is now active.</p>
            <p>Here's what you can do next:</p>
            <ul>
              <li>Upload your identity documents</li>
              <li>Complete your eKYC forms</li>
              <li>Track your verification score</li>
              <li>Access your personalized dashboard</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/dashboard" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Go to Dashboard
              </a>
            </div>
            <p>If you have any questions, feel free to contact our support team.</p>
            <hr style="margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              Best regards,<br>
              The Talaty Team
            </p>
          </div>
        `,
      }

      await this.transporter.sendMail(mailOptions)
      console.log(`Welcome email sent to ${email}`)
    } catch (error) {
      console.error("Email sending error:", error)
      throw error
    }
  }

  async sendDocumentStatusEmail(email, firstName, documentName, status, notes = "") {
    try {
      const statusColors = {
        approved: "#059669",
        rejected: "#dc2626",
        pending: "#d97706",
      }

      const statusMessages = {
        approved: "Your document has been approved!",
        rejected: "Your document requires attention",
        pending: "Your document is under review",
      }

      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: `Document ${status.charAt(0).toUpperCase() + status.slice(1)} - ${documentName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: ${statusColors[status]};">${statusMessages[status]}</h2>
            <p>Hi ${firstName},</p>
            <p>We have an update on your document: <strong>${documentName}</strong></p>
            <div style="background-color: #f9fafb; padding: 20px; border-left: 4px solid ${statusColors[status]}; margin: 20px 0;">
              <p><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
              ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
            </div>
            ${
              status === "rejected"
                ? `<p>Please review the notes above and upload a corrected version of your document.</p>`
                : ""
            }
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/documents" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                View Documents
              </a>
            </div>
            <hr style="margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              Best regards,<br>
              The Talaty Team
            </p>
          </div>
        `,
      }

      await this.transporter.sendMail(mailOptions)
      console.log(`Document status email sent to ${email}`)
    } catch (error) {
      console.error("Email sending error:", error)
      throw error
    }
  }
}

module.exports = new EmailService()
