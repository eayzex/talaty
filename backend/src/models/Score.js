module.exports = (sequelize, DataTypes) => {
  const Score = sequelize.define(
    "Score",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      total_score: {
        type: DataTypes.INTEGER,
        defaultValue: 35,
        validate: {
          min: 0,
          max: 100,
        },
      },
      registration_score: {
        type: DataTypes.INTEGER,
        defaultValue: 35,
      },
      document_score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      form_score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      verification_score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      risk_level: {
        type: DataTypes.ENUM("low", "medium", "high"),
        defaultValue: "high",
      },
      last_calculated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      calculation_details: {
        type: DataTypes.JSONB,
        defaultValue: {},
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
      tableName: "scores",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["user_id"],
        },
        {
          fields: ["total_score"],
        },
        {
          fields: ["risk_level"],
        },
      ],
    },
  )

  return Score
}
