"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  businessName?: string
  businessType?: string
  industry?: string
  createdAt: string
  businessScore: number
  documentsUploaded: number
  complianceScore: number
  growthRate: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginWithOtp: (phone: string, otp: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  updateBusinessScore: (newScore: number) => void
  addDocument: () => void
  checkEmailExists: (email: string) => Promise<boolean>
  checkPhoneExists: (phone: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        const token = localStorage.getItem("authToken")

        if (storedUser && token) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Authentication error:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("authToken")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const mockUsers = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      password: "Password123!",
      businessName: "Acme Inc",
      businessType: "corporation",
      industry: "technology",
      createdAt: "2023-01-15T00:00:00Z",
      phone: "+1234567890",
      businessScore: 45, // Initial low score
      documentsUploaded: 0,
      complianceScore: 65,
      growthRate: 12,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      password: "Password456!",
      businessName: "Smith Enterprises",
      businessType: "llc",
      industry: "retail",
      createdAt: "2023-02-20T00:00:00Z",
      phone: "+1987654321",
      businessScore: 52,
      documentsUploaded: 3,
      complianceScore: 78,
      growthRate: 18,
    },
  ]

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      const { password: _, ...userWithoutPassword } = foundUser

      setUser(userWithoutPassword as User)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      localStorage.setItem("authToken", "mock-jwt-token-" + Math.random())

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithOtp = async (phone: string, otp: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const foundUser = mockUsers.find((u) => u.phone === phone)

      if (!foundUser) {
        throw new Error("User not found")
      }

      if (otp !== "1234") {
        throw new Error("Invalid OTP")
      }

      const { password: _, ...userWithoutPassword } = foundUser

      setUser(userWithoutPassword as User)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      localStorage.setItem("authToken", "mock-jwt-token-" + Math.random())

      return true
    } catch (error) {
      console.error("OTP login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userExists = mockUsers.some(
        (u) => u.email.toLowerCase() === userData.email?.toLowerCase() || u.phone === userData.phone,
      )

      if (userExists) {
        throw new Error("User already exists")
      }

      const newUser = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        ...userData,
        createdAt: new Date().toISOString(),
        businessScore: 35, // New users start with low score
        documentsUploaded: 0,
        complianceScore: 45,
        growthRate: 8,
      }

      const { password: _, ...userWithoutPassword } = newUser

      setUser(userWithoutPassword as User)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      localStorage.setItem("authToken", "mock-jwt-token-" + Math.random())

      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updateBusinessScore = (newScore: number) => {
    if (user) {
      const updatedUser = { ...user, businessScore: newScore }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const addDocument = () => {
    if (user) {
      const updatedUser = {
        ...user,
        documentsUploaded: user.documentsUploaded + 1,
        businessScore: Math.min(user.businessScore + 8, 100), // Increase score with each document
      }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("authToken")
    router.push("/")
  }

  const checkEmailExists = async (email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())
  }

  const checkPhoneExists = async (phone: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockUsers.some((u) => u.phone === phone)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithOtp,
        register,
        logout,
        updateBusinessScore,
        addDocument,
        checkEmailExists,
        checkPhoneExists,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
