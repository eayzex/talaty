"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CheckCircle, Building, DollarSign, Shield, Award, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import Navbar from "@/components/navbar"

export default function FormsPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isCompleted, setIsCompleted] = useState(false)
  const [formData, setFormData] = useState({
    // Business Information
    businessName: "",
    businessType: "",
    industry: "",
    yearEstablished: "",
    numberOfEmployees: "",
    businessAddress: "",
    businessPhone: "",
    businessEmail: "",
    website: "",
    
    // Financial Information
    annualRevenue: "",
    monthlyExpenses: "",
    bankName: "",
    accountType: "",
    creditScore: "",
    existingLoans: "",
    
    // Compliance Information
    taxId: "",
    businessLicense: "",
    insuranceProvider: "",
    complianceStatus: "",
    auditFrequency: "",
    regulatoryBody: "",
  })
  
  const router = useRouter()
  const { toast } = useToast()
  const { user, updateBusinessScore } = useAuth()

  useEffect(() => {
    // Check if forms are already completed
    const completedForms = localStorage.getItem(`forms_completed_${user?.id}`)
    if (completedForms) {
      setIsCompleted(true)
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Save completion status
    localStorage.setItem(`forms_completed_${user?.id}`, JSON.stringify({
      completedAt: new Date().toISOString(),
      formData
    }))
    
    // Update business score
    const newScore = Math.min((user?.businessScore || 45) + 15, 100)
    updateBusinessScore(newScore)
    
    setIsCompleted(true)
    
    toast({
      title: "🎉 Forms Completed Successfully!",
      description: `Your business score increased by +15 points! New score: ${newScore}/100`,
    })
  }

  const steps = [
    { number: 1, title: "Business Information", icon: Building },
    { number: 2, title: "Financial Information", icon: DollarSign },
    { number: 3, title: "Compliance Information", icon: Shield },
  ]

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        
        <main className="pt-20 pb-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors mb-8"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>

              <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
                <CardContent className="p-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </motion.div>
                  
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Forms Completed Successfully! 🎉
                  </h1>
                  
                  <p className="text-gray-600 mb-8">
                    Thank you for completing all the required forms. Your business profile is now complete and your score has been updated.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-800">Score Boost</h3>
                      <p className="text-2xl font-bold text-blue-600">+15 Points</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-800">Current Score</h3>
                      <p className="text-2xl font-bold text-green-600">{user?.businessScore || 60}/100</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-800">Profile Status</h3>
                      <p className="text-sm font-medium text-purple-600">Complete</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">What's Next?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        onClick={() => router.push("/upload")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Upload Documents
                      </Button>
                      <Button
                        onClick={() => router.push("/score-results")}
                        variant="outline"
                      >
                        View Detailed Score
                      </Button>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 mb-2">💡 Pro Tip</h4>
                    <p className="text-sm text-yellow-700">
                      Upload more documents to further improve your business score and unlock additional features!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: Math.random() * 4 + 3,
              height: Math.random() * 4 + 3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
              Complete <span className="text-blue-600">Business Forms</span>
            </h1>
            <p className="text-gray-600">
              Fill out these forms to improve your business score by +15 points
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.number
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? "text-blue-600" : "text-gray-500"
                    }`}>
                      Step {step.number}
                    </p>
                    <p className="text-xs text-gray-500">{step.title}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 ml-4 ${
                      currentStep > step.number ? "bg-blue-600" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-2" />
          </motion.div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800">
                  {steps[currentStep - 1].title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {currentStep === 1 && "Tell us about your business"}
                  {currentStep === 2 && "Provide your financial information"}
                  {currentStep === 3 && "Complete compliance details"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Business Information */}
                {currentStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                        placeholder="Enter your business name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select onValueChange={(value) => handleInputChange("businessType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="llc">LLC</SelectItem>
                          <SelectItem value="corporation">Corporation</SelectItem>
                          <SelectItem value="non-profit">Non-Profit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry *</Label>
                      <Select onValueChange={(value) => handleInputChange("industry", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearEstablished">Year Established *</Label>
                      <Input
                        id="yearEstablished"
                        type="number"
                        value={formData.yearEstablished}
                        onChange={(e) => handleInputChange("yearEstablished", e.target.value)}
                        placeholder="2020"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numberOfEmployees">Number of Employees</Label>
                      <Select onValueChange={(value) => handleInputChange("numberOfEmployees", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10</SelectItem>
                          <SelectItem value="11-50">11-50</SelectItem>
                          <SelectItem value="51-200">51-200</SelectItem>
                          <SelectItem value="201-500">201-500</SelectItem>
                          <SelectItem value="500+">500+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessPhone">Business Phone</Label>
                      <Input
                        id="businessPhone"
                        value={formData.businessPhone}
                        onChange={(e) => handleInputChange("businessPhone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="businessAddress">Business Address *</Label>
                      <Textarea
                        id="businessAddress"
                        value={formData.businessAddress}
                        onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                        placeholder="Enter your complete business address"
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Financial Information */}
                {currentStep === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="annualRevenue">Annual Revenue *</Label>
                      <Select onValueChange={(value) => handleInputChange("annualRevenue", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-50k">$0 - $50,000</SelectItem>
                          <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                          <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                          <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                          <SelectItem value="1m+">$1,000,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyExpenses">Monthly Expenses</Label>
                      <Select onValueChange={(value) => handleInputChange("monthlyExpenses", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-5k">$0 - $5,000</SelectItem>
                          <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                          <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                          <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                          <SelectItem value="50k+">$50,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Primary Bank</Label>
                      <Input
                        id="bankName"
                        value={formData.bankName}
                        onChange={(e) => handleInputChange("bankName", e.target.value)}
                        placeholder="Bank name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountType">Account Type</Label>
                      <Select onValueChange={(value) => handleInputChange("accountType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checking">Business Checking</SelectItem>
                          <SelectItem value="savings">Business Savings</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="creditScore">Business Credit Score</Label>
                      <Select onValueChange={(value) => handleInputChange("creditScore", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="poor">Poor (300-579)</SelectItem>
                          <SelectItem value="fair">Fair (580-669)</SelectItem>
                          <SelectItem value="good">Good (670-739)</SelectItem>
                          <SelectItem value="very-good">Very Good (740-799)</SelectItem>
                          <SelectItem value="excellent">Excellent (800-850)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="existingLoans">Existing Loans</Label>
                      <Select onValueChange={(value) => handleInputChange("existingLoans", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Do you have existing loans?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No existing loans</SelectItem>
                          <SelectItem value="business-loan">Business loan</SelectItem>
                          <SelectItem value="equipment-loan">Equipment loan</SelectItem>
                          <SelectItem value="line-of-credit">Line of credit</SelectItem>
                          <SelectItem value="multiple">Multiple loans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 3: Compliance Information */}
                {currentStep === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID / EIN *</Label>
                      <Input
                        id="taxId"
                        value={formData.taxId}
                        onChange={(e) => handleInputChange("taxId", e.target.value)}
                        placeholder="XX-XXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessLicense">Business License Status</Label>
                      <Select onValueChange={(value) => handleInputChange("businessLicense", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                          <SelectItem value="not-required">Not Required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                      <Input
                        id="insuranceProvider"
                        value={formData.insuranceProvider}
                        onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
                        placeholder="Insurance company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="complianceStatus">Compliance Status</Label>
                      <Select onValueChange={(value) => handleInputChange("complianceStatus", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fully-compliant">Fully Compliant</SelectItem>
                          <SelectItem value="mostly-compliant">Mostly Compliant</SelectItem>
                          <SelectItem value="partially-compliant">Partially Compliant</SelectItem>
                          <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="auditFrequency">Audit Frequency</Label>
                      <Select onValueChange={(value) => handleInputChange("auditFrequency", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="How often are you audited?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="annually">Annually</SelectItem>
                          <SelectItem value="bi-annually">Bi-annually</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regulatoryBody">Regulatory Body</Label>
                      <Input
                        id="regulatoryBody"
                        value={formData.regulatoryBody}
                        onChange={(e) => handleInputChange("regulatoryBody", e.target.value)}
                        placeholder="Primary regulatory authority"
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  
                  {currentStep < 3 ? (
                    <Button onClick={handleNext}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600"
                    >
                      Complete Forms
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
