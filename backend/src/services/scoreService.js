const { Score, User, Document, Form } = require("../models")

class ScoreService {
  async calculateScore(userId) {
    try {
      // Get user data
      const user = await User.findByPk(userId)
      if (!user) {
        throw new Error("User not found")
      }

      // Get documents
      const documents = await Document.findAll({
        where: { user_id: userId },
      })

      // Get forms
      const forms = await Form.findAll({
        where: { user_id: userId },
      })

      // Calculate scores
      const registrationScore = 35 // Base score for registration
      const documentScore = this.calculateDocumentScore(documents)
      const formScore = this.calculateFormScore(forms)
      const verificationScore = this.calculateVerificationScore(user)

      const totalScore = Math.min(100, registrationScore + documentScore + formScore + verificationScore)
      const riskLevel = this.calculateRiskLevel(totalScore)

      const calculationDetails = {
        registration: registrationScore,
        documents: documentScore,
        forms: formScore,
        verification: verificationScore,
        breakdown: {
          approved_documents: documents.filter((d) => d.status === "approved").length,
          completed_forms: forms.filter((f) => f.status === "submitted").length,
          email_verified: user.email_verified,
          phone_verified: user.phone_verified,
          kyc_approved: user.kyc_status === "approved",
        },
      }

      // Update or create score
      const [score] = await Score.upsert({
        user_id: userId,
        total_score: totalScore,
        registration_score: registrationScore,
        document_score: documentScore,
        form_score: formScore,
        verification_score: verificationScore,
        risk_level: riskLevel,
        last_calculated: new Date(),
        calculation_details: calculationDetails,
      })

      return score
    } catch (error) {
      console.error("Score calculation error:", error)
      throw error
    }
  }

  calculateDocumentScore(documents) {
    const approvedDocuments = documents.filter((doc) => doc.status === "approved")
    return Math.min(40, approvedDocuments.length * 8) // Max 40 points, 8 per document
  }

  calculateFormScore(forms) {
    const completedForms = forms.filter((form) => form.status === "submitted")
    return Math.min(40, completedForms.length * 10) // Max 40 points, 10 per form
  }

  calculateVerificationScore(user) {
    let score = 0

    if (user.email_verified) score += 5
    if (user.phone_verified) score += 5
    if (user.kyc_status === "approved") score += 10

    return Math.min(20, score) // Max 20 points
  }

  calculateRiskLevel(totalScore) {
    if (totalScore >= 80) return "low"
    if (totalScore >= 60) return "medium"
    return "high"
  }

  async recalculateAllScores() {
    try {
      const users = await User.findAll({ attributes: ["id"] })
      const results = []

      for (const user of users) {
        try {
          const score = await this.calculateScore(user.id)
          results.push({ userId: user.id, success: true, score: score.total_score })
        } catch (error) {
          results.push({ userId: user.id, success: false, error: error.message })
        }
      }

      return results
    } catch (error) {
      console.error("Bulk score recalculation error:", error)
      throw error
    }
  }
}

module.exports = new ScoreService()
