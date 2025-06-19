const { AuditLog } = require("../models")

class AuditService {
  async log({
    user_id,
    action,
    resource_type,
    resource_id = null,
    old_values = null,
    new_values = null,
    ip_address = null,
    user_agent = null,
    status = "success",
    error_message = null,
    metadata = {},
  }) {
    try {
      await AuditLog.create({
        user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values,
        ip_address,
        user_agent,
        status,
        error_message,
        metadata,
      })
    } catch (error) {
      console.error("Audit logging error:", error)
      // Don't throw error to avoid breaking the main operation
    }
  }

  async getActivityLog(userId, limit = 50) {
    try {
      const logs = await AuditLog.findAll({
        where: { user_id: userId },
        order: [["created_at", "DESC"]],
        limit,
      })

      return logs
    } catch (error) {
      console.error("Get activity log error:", error)
      throw error
    }
  }

  async getSystemLogs(filters = {}, limit = 100) {
    try {
      const whereClause = {}

      if (filters.user_id) whereClause.user_id = filters.user_id
      if (filters.action) whereClause.action = filters.action
      if (filters.resource_type) whereClause.resource_type = filters.resource_type
      if (filters.status) whereClause.status = filters.status

      const logs = await AuditLog.findAll({
        where: whereClause,
        order: [["created_at", "DESC"]],
        limit,
        include: [
          {
            model: require("../models").User,
            as: "user",
            attributes: ["id", "email", "first_name", "last_name"],
          },
        ],
      })

      return logs
    } catch (error) {
      console.error("Get system logs error:", error)
      throw error
    }
  }
}

module.exports = new AuditService()
