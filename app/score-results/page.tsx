"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, TrendingUp, Award, Target, CheckCircle, FileText, Upload, BarChart3, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"

export default function ScoreResultsPage() {
  const [animatedScore, setAnimatedScore] = useState(0)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Animate score
    const targetScore = user?.businessScore || 45
    let current = 0
    const increment = targetScore / 50
    const timer = setInterval(() => {
      current += increment
      if (current >= targetScore) {
        setAnimatedScore(targetScore)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.floor(current))
      }
    }, 50)

    return () => clearInterval(timer)
  }, [user?.businessScore])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500"
    if (score >= 60) return "from-yellow-500 to-orange-500"
    return "from-red-500 to-pink-500"
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return "Excellent! Your business is performing very well."
    if (score >= 60) return "Good progress! There's room for improvement."
    return "Your business score needs attention. Let's improve it together."
  }

  const scoreBreakdown = [
    {
      category: "Financial Health",
      score: Math.min((user?.businessScore || 45) + 15, 100),
      maxScore: 100,
      color: "bg-green-500",
      description: "Based on financial documents and revenue information",
    },
    {
      category: "Document Completeness",
      score: (user?.documentsUploaded || 0) * 20,
      maxScore: 100,
      color: "bg-blue-500",
      description: "Percentage of required documents uploaded",
    },
    {
      category: "Compliance Status",
      score: user?.complianceScore || 65,
      maxScore: 100,
      color: "bg-purple-500",
      description: "Regulatory compliance and legal requirements",
    },
    {
      category: "Business Information",
      score: user?.businessName ? 90 : 30,
      maxScore: 100,
      color: "bg-orange-500",
      description: "Completeness of business profile information",
    },
    {
      category: "Growth Indicators",
      score: user?.growthRate || 12,
      maxScore: 100,
      color: "bg-indigo-500",
      description: "Business growth potential and market indicators",
    },
  ]

  const recommendations = [
    {
      title: "Upload Financial Documents",
      description: "Add bank statements and financial reports to improve your financial health score",
      impact: "+15 points",
      priority: "high",
      icon: FileText,
      action: () => router.push("/upload"),
    },
    {
      title: "Complete Business Forms",
      description: "Fill out detailed business information forms for better insights",
      impact: "+10 points",
      priority: "medium",
      icon: Target,
      action: () => router.push("/forms"),
    },
    {
      title: "Verify Business License",
      description: "Upload your business license and registration documents",
      impact: "+8 points",
      priority: "medium",
      icon: CheckCircle,
      action: () => router.push("/upload"),
    },
    {
      title: "Add Insurance Documents",
      description: "Upload business insurance policies to improve compliance score",
      impact: "+5 points",
      priority: "low",
      icon: Upload,
      action: () => router.push("/upload"),
    },
  ]

  const achievements = [
    {
      title: "First Upload",
      description: "Uploaded your first document",
      earned: (user?.documentsUploaded || 0) > 0,
      icon: Upload,
    },
    {
      title: "Profile Complete",
      description: "Completed your business profile",
      earned: !!user?.businessName,
      icon: CheckCircle,
    },
    {
      title: "Score Improver",
      description: "Improved your business score",
      earned: (user?.businessScore || 0) > 50,
      icon: TrendingUp,
    },
    {
      title: "Compliance Ready",
      description: "Achieved 80% compliance score",
      earned: (user?.complianceScore || 0) >= 80,
      icon: Award,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: Math.random() * 6 + 4,
              height: Math.random() * 6 + 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 12}s`,
              animationDuration: `${12 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
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
              Your Business <span className="text-blue-600">Score Results</span>
            </h1>
            <p className="text-gray-600">Detailed analysis of your business performance and recommendations</p>
          </motion.div>

          {/* Score Overview */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardContent className="p-8">
                <div className="text-center">
                  <motion.div
                    className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${getScoreBgColor(
                      animatedScore,
                    )} text-white text-4xl font-bold mb-4 animate-pulse-glow`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    {animatedScore}
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Business Score</h2>
                  <p className={`text-lg font-medium ${getScoreColor(animatedScore)} mb-4`}>
                    {getScoreMessage(animatedScore)}
                  </p>
                  <div className="max-w-md mx-auto">
                    <Progress value={animatedScore} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Score Breakdown */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Score Breakdown
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Detailed analysis of each component contributing to your business score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {scoreBreakdown.map((item, index) => (
                    <motion.div
                      key={index}
                      className="space-y-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-800">{item.category}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <span className="text-lg font-semibold text-gray-700">
                          {item.score}/{item.maxScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          className={`h-3 rounded-full ${item.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.score / item.maxScore) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommendations and Achievements Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-800">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                    Recommendations
                  </CardTitle>
                  <CardDescription className="text-gray-600">Actions to improve your business score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-300 bg-white/50 cursor-pointer"
                        whileHover={{ y: -2 }}
                        onClick={rec.action}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-2 rounded-lg ${
                              rec.priority === "high"
                                ? "bg-red-100"
                                : rec.priority === "medium"
                                  ? "bg-yellow-100"
                                  : "bg-green-100"
                            }`}
                          >
                            <rec.icon
                              className={`h-4 w-4 ${
                                rec.priority === "high"
                                  ? "text-red-600"
                                  : rec.priority === "medium"
                                    ? "text-yellow-600"
                                    : "text-green-600"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-800">{rec.title}</h3>
                              <span className="text-sm font-medium text-blue-600">{rec.impact}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                                rec.priority === "high"
                                  ? "bg-red-100 text-red-700"
                                  : rec.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-800">
                    <Award className="h-5 w-5 mr-2 text-purple-600" />
                    Achievements
                  </CardTitle>
                  <CardDescription className="text-gray-600">Your progress milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        className={`p-4 rounded-lg border transition-all duration-300 ${
                          achievement.earned ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50 opacity-60"
                        }`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${achievement.earned ? "bg-green-100" : "bg-gray-100"}`}>
                            <achievement.icon
                              className={`h-5 w-5 ${achievement.earned ? "text-green-600" : "text-gray-400"}`}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-medium ${achievement.earned ? "text-gray-800" : "text-gray-500"}`}>
                              {achievement.title}
                            </h3>
                            <p className={`text-sm ${achievement.earned ? "text-gray-600" : "text-gray-400"}`}>
                              {achievement.description}
                            </p>
                          </div>
                          {achievement.earned && <CheckCircle className="h-5 w-5 text-green-600" />}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/upload")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 btn-hover-effect"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Documents
              </Button>
              <Button onClick={() => router.push("/forms")} variant="outline" className="btn-hover-effect">
                <FileText className="mr-2 h-4 w-4" />
                Complete Forms
              </Button>
              <Button onClick={() => router.push("/reports")} variant="outline" className="btn-hover-effect">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
