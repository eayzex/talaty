module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define(
    "AuditLog",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resource_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resource_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      old_values: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      new_values: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      ip_address: {
        type: DataTypes.INET,
        allowNull: true,
      },
      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("success", "failed", "error"),
        defaultValue: "success",
      },
      error_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "audit_logs",
      timestamps: false,
      indexes: [
        {
          fields: ["user_id"],
        },
        {
          fields: ["action"],
        },
        {
          fields: ["resource_type"],
        },
        {
          fields: ["created_at"],
        },
        {
          fields: ["status"],
        },
      ],
    },
  )

  return AuditLog
}
