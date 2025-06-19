const { sequelize } = require("../models")

async function migrate() {
  try {
    console.log("🔄 Starting database migration...")

    // Test connection
    await sequelize.authenticate()
    console.log("✅ Database connection established")

    // Sync all models
    await sequelize.sync({ alter: true })
    console.log("✅ Database models synchronized")

    console.log("🎉 Migration completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  }
}

// Run migration if called directly
if (require.main === module) {
  migrate()
}

module.exports = migrate
