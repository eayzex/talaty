const request = require("supertest")
const app = require("../src/server")
const { User, Score } = require("../src/models")

describe("Authentication", () => {
  beforeEach(async () => {
    // Clean up test data
    await User.destroy({ where: {}, force: true })
    await Score.destroy({ where: {}, force: true })
  })

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "TestPass123",
        first_name: "John",
        last_name: "Doe",
      }

      const response = await request(app).post("/api/v1/auth/register").send(userData).expect(201)

      expect(response.body.status).toBe("success")
      expect(response.body.data.user.email).toBe(userData.email)
      expect(response.body.data.user.first_name).toBe(userData.first_name)

      // Check if user was created in database
      const user = await User.findOne({ where: { email: userData.email } })
      expect(user).toBeTruthy()
      expect(user.email_verified).toBe(false)

      // Check if initial score was created
      const score = await Score.findOne({ where: { user_id: user.id } })
      expect(score).toBeTruthy()
      expect(score.total_score).toBe(35)
    })

    it("should return error for duplicate email", async () => {
      const userData = {
        email: "test@example.com",
        password: "TestPass123",
        first_name: "John",
        last_name: "Doe",
      }

      // Create first user
      await request(app).post("/api/v1/auth/register").send(userData).expect(201)

      // Try to create duplicate
      const response = await request(app).post("/api/v1/auth/register").send(userData).expect(409)

      expect(response.body.status).toBe("error")
      expect(response.body.message).toContain("already exists")
    })

    it("should return validation error for invalid data", async () => {
      const invalidData = {
        email: "invalid-email",
        password: "123", // Too short
        first_name: "", // Empty
      }

      const response = await request(app).post("/api/v1/auth/register").send(invalidData).expect(400)

      expect(response.body.status).toBe("error")
      expect(response.body.message).toBe("Validation failed")
      expect(response.body.errors).toBeDefined()
    })
  })

  describe("POST /api/v1/auth/login", () => {
