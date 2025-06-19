const bcrypt = require("bcryptjs")
const { User, Score } = require("../models")

async function seed() {
  try {
    console.log("🌱 Starting database seeding...")

    // Create admin user
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123456", 12)
    const [admin] = await User.findOrCreate({
      where: { email: process.env.ADMIN_EMAIL || "admin@talaty.com" },
      defaults: {
        email: process.env.ADMIN_EMAIL || "admin@talaty.com",
        password: adminPassword,
        first_name: "Admin",
        last_name: "User",
        role: "admin",
        status: "active",
        email_verified: true,
        kyc_status: "approved",
      },
    })

    // Create admin score
    await Score.findOrCreate({
      where: { user_id: admin.id },
      defaults: {
        user_id: admin.id,
        total_score: 100,
        registration_score: 35,
        document_score: 40,
        form_score: 40,
        verification_score: 20,
        risk_level: "low",
      },
    })

    // Create reviewer user
    const reviewerPassword = await bcrypt.hash("Reviewer@123456", 12)
    const [reviewer] = await User.findOrCreate({
      where: { email: "reviewer@talaty.com" },
      defaults: {
        email: "reviewer@talaty.com",
        password: reviewerPassword,
        first_name: "Reviewer",
        last_name: "User",
        role: "reviewer",
        status: "active",
        email_verified: true,
        kyc_status: "approved",
      },
    })

    // Create reviewer score
    await Score.findOrCreate({
      where: { user_id: reviewer.id },
      defaults: {
        user_id: reviewer.id,
        total_score: 95,
        registration_score: 35,
        document_score: 40,
        form_score: 40,
        verification_score: 15,
        risk_level: "low",
      },
    })

    // Create demo user
    const demoPassword = await bcrypt.hash("Demo@123456", 12)
    const [demo] = await User.findOrCreate({
      where: { email: "demo@talaty.com" },
      defaults: {
        email: "demo@talaty.com",
        password: demoPassword,
        first_name: "Demo",
        last_name: "User",
        role: "user",
        status: "active",
        email_verified: true,
        kyc_status: "pending",
      },
    })

    // Create demo score
    await Score.findOrCreate({
      where: { user_id: demo.id },
      defaults: {
        user_id: demo.id,
        total_score: 45,
        registration_score: 35,
        document_score: 0,
        form_score: 10,
        verification_score: 5,
        risk_level: "high",
      },
    })

    console.log("✅ Admin user created:", process.env.ADMIN_EMAIL || "admin@talaty.com")
    console.log("✅ Reviewer user created: reviewer@talaty.com")
    console.log("✅ Demo user created: demo@talaty.com")
    console.log("🎉 Database seeding completed successfully!")

    console.log("\n📋 Default Accounts:")
    console.log("Admin: admin@talaty.com / Admin@123456")
    console.log("Reviewer: reviewer@talaty.com / Reviewer@123456")
    console.log("Demo: demo@talaty.com / Demo@123456")
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  }
}

// Run seeding if called directly
if (require.main === module) {
  seed()
}

module.exports = seed
