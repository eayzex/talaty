"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, User, Smartphone, Check, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [otpSent, setOtpSent] = useState(false)
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState(["", "", "", ""])
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0) // 0: none, 1: weak, 2: medium, 3: strong
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    businessType: "",
    industry: "",
    phone: "",
    termsAccepted: false,
  })
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    phone?: string
    otp?: string
    terms?: string
    businessName?: string
    businessType?: string
    industry?: string
  }>({})

  const router = useRouter()
  const { toast } = useToast()
  const { register, checkEmailExists, checkPhoneExists, isAuthenticated } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const calculatePasswordStrength = (password: string) => {
    let strength = 0

    // Length check
    if (password.length >= 8) strength++

    // Contains lowercase and uppercase
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++

    // Contains numbers
    if (/\d/.test(password)) strength++

    // Contains special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++

    return Math.min(strength, 3) // Cap at 3 for strong
  }

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
        return ""
      case 1:
        return "Weak"
      case 2:
        return "Medium"
      case 3:
        return "Strong"
      default:
        return ""
    }
  }

  const getPasswordStrengthColor = (strength: number) => {
    switch (strength) {
      case 1:
        return "text-red-500"
      case 2:
        return "text-yellow-500"
      case 3:
        return "text-green-500"
      default:
        return ""
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    return phone.replace(/\D/g, "").length >= 10
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear errors when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: undefined })
    }

    // Calculate password strength
    if (field === "password" && typeof value === "string") {
      setPasswordStrength(calculatePasswordStrength(value))
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1)
    if (!/^\d*$/.test(value) && value !== "") return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setErrors({ ...errors, otp: undefined })

    // Auto focus next input
    if (value !== "" && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const validateStep1 = async () => {
    const newErrors: any = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    } else {
      // Check if email already exists
      const emailExists = await checkEmailExists(formData.email)
      if (emailExists) {
        newErrors.email = "Email already exists. Please use a different email."
      }
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    } else if (passwordStrength < 2) {
      newErrors.password = "Please choose a stronger password"
    }

    if (!formData.termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions"
    }

    return newErrors
  }

  const validatePhoneStep = async () => {
    const newErrors: any = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!validatePhone(phone)) {
      newErrors.phone = "Please enter a valid phone number"
    } else {
      // Check if phone already exists
      const phoneExists = await checkPhoneExists(phone)
      if (phoneExists) {
        newErrors.phone = "Phone number already exists. Please use a different number."
      }
    }

    if (!formData.termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions"
    }

    return newErrors
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = await validatePhoneStep()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setOtpSent(true)
      toast({
        title: "OTP Sent!",
        description: `Verification code sent to ${phone}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (otp.some((digit) => digit === "")) {
      setErrors({ ...errors, otp: "Please enter the complete OTP" })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setCurrentStep(2)
      toast({
        title: "Phone Verified!",
        description: "Please complete your business profile",
      })
    } catch (error) {
      setErrors({ ...errors, otp: "Invalid OTP. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = await validateStep1()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setCurrentStep(2)
      toast({
        title: "Account Created!",
        description: "Please complete your business profile",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate business information
    const newErrors: any = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required"
    }

    if (!formData.businessType) {
      newErrors.businessType = "Please select a business type"
    }

    if (!formData.industry) {
      newErrors.industry = "Please select an industry"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const userData = {
        ...formData,
        phone: phone || formData.phone,
      }

      const success = await register(userData)

      if (success) {
        toast({
          title: "Registration Complete!",
          description: "Welcome to Talaty! Let's get started.",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Error",
          description: "Failed to complete registration. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Animated background elements
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 25 + 15,
    delay: Math.random() * 3,
  }))

  return (
    <div className="min-h-screen flex flex-col bg-background animated-bg">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

        {/* Animated particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="particle"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              x: [0, Math.random() * 80 - 40, 0],
              y: [0, Math.random() * 80 - 40, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-xl">
            <div className="mb-6">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </div>

            <div className="text-center mb-8">
              <motion.h1
                className="text-3xl font-bold mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Create Your Account
              </motion.h1>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Join Talaty to transform your business
              </motion.p>
            </div>

            {currentStep === 1 && (
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                </TabsList>

                <TabsContent value="email">
                  <form onSubmit={handleEmailRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          className={`pl-10 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      {errors.name && (
                        <div className="flex items-center text-red-500 text-xs mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.name}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                      {errors.email && (
                        <div className="flex items-center text-red-500 text-xs mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.email}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`pl-10 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Password strength:</span>
                            <span className={`text-xs font-medium ${getPasswordStrengthColor(passwordStrength)}`}>
                              {getPasswordStrengthText(passwordStrength)}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1">
                            <div
                              className={`h-1 rounded-full transition-all duration-300 ${
                                passwordStrength === 1
                                  ? "w-1/3 bg-red-500"
                                  : passwordStrength === 2
                                    ? "w-2/3 bg-yellow-500"
                                    : passwordStrength === 3
                                      ? "w-full bg-green-500"
                                      : "w-0"
                              }`}
                            />
                          </div>
                        </div>
                      )}

                      {errors.password && (
                        <div className="flex items-center text-red-500 text-xs mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.password}
                        </div>
                      )}
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => handleInputChange("termsAccepted", checked)}
                        className={errors.terms ? "border-red-500" : ""}
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    {errors.terms && (
                      <div className="flex items-center text-red-500 text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.terms}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary transition-all duration-300 btn-hover-effect"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="phone">
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            className={`pl-10 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            required
                          />
                        </div>
                        {errors.name && (
                          <div className="flex items-center text-red-500 text-xs mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.name}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            className={`pl-10 ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                          />
                        </div>
                        {errors.phone && (
                          <div className="flex items-center text-red-500 text-xs mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.phone}
                          </div>
                        )}
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) => handleInputChange("termsAccepted", checked)}
                          className={errors.terms ? "border-red-500" : ""}
                        />
                        <Label htmlFor="terms" className="text-sm leading-relaxed">
                          I agree to the{" "}
                          <Link href="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>
                      {errors.terms && (
                        <div className="flex items-center text-red-500 text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.terms}
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary transition-all duration-300 btn-hover-effect"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="otp-0">Enter OTP sent to {phone}</Label>
                        <div className="flex justify-between gap-2">
                          {otp.map((digit, index) => (
                            <Input
                              key={index}
                              id={`otp-${index}`}
                              type="text"
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              className={`text-center text-xl font-semibold ${
                                errors.otp ? "border-red-500 focus-visible:ring-red-500" : ""
                              }`}
                              maxLength={1}
                              required
                            />
                          ))}
                        </div>
                        {errors.otp && (
                          <div className="flex items-center text-red-500 text-xs mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.otp}
                          </div>
                        )}
                        <div className="text-center text-xs text-muted-foreground mt-1">
                          <p>Demo OTP: 1234</p>
                        </div>
                      </div>

                      <div className="text-center">
                        <button
                          type="button"
                          className="text-sm text-primary hover:underline"
                          onClick={() => setOtpSent(false)}
                        >
                          Didn't receive OTP? Resend
                        </button>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary transition-all duration-300 btn-hover-effect"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify & Continue"
                        )}
                      </Button>
                    </form>
                  )}
                </TabsContent>
              </Tabs>
            )}

            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <form onSubmit={handleCompleteRegistration} className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Check className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">Almost Done!</h2>
                    <p className="text-muted-foreground mt-1">Complete your business profile</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input
                      id="business-name"
                      type="text"
                      placeholder="Acme Inc."
                      className={errors.businessName ? "border-red-500 focus-visible:ring-red-500" : ""}
                      value={formData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                      required
                    />
                    {errors.businessName && (
                      <div className="flex items-center text-red-500 text-xs mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.businessName}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-type">Business Type</Label>
                    <select
                      id="business-type"
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.businessType ? "border-red-500 focus-visible:ring-red-500" : ""
                      }`}
                      value={formData.businessType}
                      onChange={(e) => handleInputChange("businessType", e.target.value)}
                      required
                    >
                      <option value="">Select business type</option>
                      <option value="sole-proprietorship">Sole Proprietorship</option>
                      <option value="partnership">Partnership</option>
                      <option value="llc">Limited Liability Company (LLC)</option>
                      <option value="corporation">Corporation</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.businessType && (
                      <div className="flex items-center text-red-500 text-xs mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.businessType}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <select
                      id="industry"
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.industry ? "border-red-500 focus-visible:ring-red-500" : ""
                      }`}
                      value={formData.industry}
                      onChange={(e) => handleInputChange("industry", e.target.value)}
                      required
                    >
                      <option value="">Select industry</option>
                      <option value="technology">Technology</option>
                      <option value="retail">Retail</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.industry && (
                      <div className="flex items-center text-red-500 text-xs mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.industry}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary transition-all duration-300 btn-hover-effect"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Completing Registration...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
