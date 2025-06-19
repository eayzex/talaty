module.exports = (sequelize, DataTypes) => {
  const Form = sequelize.define(
    "Form",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      form_type: {
        type: DataTypes.ENUM("personal_info", "business_info", "financial_info", "compliance_info"),
        allowNull: false,
      },
      form_data: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("draft", "submitted", "approved", "rejected"),
        defaultValue: "draft",
      },
      completion_percentage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 100,
        },
      },
      submitted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      reviewed_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      reviewed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      review_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      version: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "forms",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["user_id"],
        },
        {
          fields: ["form_type"],
        },
        {
          fields: ["status"],
        },
        {
          unique: true,
          fields: ["user_id", "form_type"],
        },
      ],
    },
  )

  return Form
}
