module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define(
    "OTP",
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
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      otp_code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 8],
        },
      },
      otp_type: {
        type: DataTypes.ENUM("email_verification", "phone_verification", "password_reset", "login_verification"),
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      used_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      max_attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
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
      tableName: "otps",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["user_id"],
        },
        {
          fields: ["email"],
        },
        {
          fields: ["phone"],
        },
        {
          fields: ["otp_code"],
        },
        {
          fields: ["expires_at"],
        },
      ],
    },
  )

  return OTP
}
