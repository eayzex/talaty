const { Sequelize } = require("sequelize")
const sequelize = require("../config/database")

// Import all models
const User = require("./User")(sequelize, Sequelize.DataTypes)
const Document = require("./Document")(sequelize, Sequelize.DataTypes)
const Form = require("./Form")(sequelize, Sequelize.DataTypes)
const Score = require("./Score")(sequelize, Sequelize.DataTypes)
const OTP = require("./OTP")(sequelize, Sequelize.DataTypes)
const AuditLog = require("./AuditLog")(sequelize, Sequelize.DataTypes)

// Define associations
const models = {
  User,
  Document,
  Form,
  Score,
  OTP,
  AuditLog,
}

// User associations
User.hasMany(Document, { foreignKey: "user_id", as: "documents" })
User.hasMany(Form, { foreignKey: "user_id", as: "forms" })
User.hasOne(Score, { foreignKey: "user_id", as: "score" })
User.hasMany(OTP, { foreignKey: "user_id", as: "otps" })
User.hasMany(AuditLog, { foreignKey: "user_id", as: "auditLogs" })

// Document associations
Document.belongsTo(User, { foreignKey: "user_id", as: "user" })

// Form associations
Form.belongsTo(User, { foreignKey: "user_id", as: "user" })

// Score associations
Score.belongsTo(User, { foreignKey: "user_id", as: "user" })

// OTP associations
OTP.belongsTo(User, { foreignKey: "user_id", as: "user" })

// AuditLog associations
AuditLog.belongsTo(User, { foreignKey: "user_id", as: "user" })

module.exports = {
  sequelize,
  ...models,
}
