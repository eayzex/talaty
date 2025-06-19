"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  Download,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const { user } = useAuth()
  const { toast } = useToast()

  const handleDownloadReport = (reportType: string) => {
    toast({
      title: "Downloading Report",
      description: `${reportType} report is being prepared for download...`,
    })
  }

  const metrics = [
    {
      title: "Business Score",
      value: user?.businessScore || 45,
      change: "+12%",
      trend: "up",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Documents Uploaded",
      value: user?.documentsUploaded || 0,
      change: "+3",
      trend: "up",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Compliance Score",
      value: `${user?.complianceScore || 65}%`,
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Growth Rate",
      value: `${user?.growthRate || 12}%`,
      change: "+2%",
      trend: "up",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const reports = [
    {
      title: "Business Score Analysis",
      description: "Detailed breakdown of your business score components",
      type: "score",
      lastUpdated: "2 hours ago",
      icon: BarChart3,
    },
    {
      title: "Financial Health Report",
      description: "Comprehensive analysis of your financial metrics",
      type: "financial",
      lastUpdated: "1 day ago",
      icon: DollarSign,
    },
    {
      title: "Compliance Status Report",
      description: "Current compliance status and recommendations",
      type: "compliance",
      lastUpdated: "3 days ago",
      icon: FileText,
    },
    {
      title: "Growth Opportunities",
      description: "Identified opportunities for business growth",
      type: "growth",
      lastUpdated: "1 week ago",
      icon: TrendingUp,
    },
  ]

  const scoreBreakdown = [
    { category: "Financial Health", score: 85, maxScore: 100, color: "bg-green-500" },
    { category: "Document Completeness", score: 60, maxScore: 100, color: "bg-blue-500" },
    { category: "Compliance Status", score: 75, maxScore: 100, color: "bg-purple-500" },
    { category: "Business Information", score: 90, maxScore: 100, color: "bg-orange-500" },
    { category: "Growth Indicators", score: 45, maxScore: 100, color: "bg-red-500" },
  ]

  const recentActivities = [
    {
      date: "2024-01-15",
      activity: "Business license uploaded",
      impact: "+5 points",
      type: "positive",
    },
    {
      date: "2024-01-14",
      activity: "Financial forms completed",
      impact: "+8 points",
      type: "positive",
    },
    {
      date: "2024-01-13",
      activity: "Tax documents uploaded",
      impact: "+3 points",
      type: "positive",
    },
    {
      date: "2024-01-12",
      activity: "Profile information updated",
      impact: "+2 points",
      type: "positive",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: Math.random() * 5 + 3,
              height: Math.random() * 5 + 3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 5}s`,
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

            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
                  Business <span className="text-blue-600">Reports</span>
                </h1>
                <p className="text-gray-600">Comprehensive analytics and insights for your business</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <Button variant="outline" size="sm" className="btn-hover-effect">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="card-hover bg-white/80 backdrop-blur-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                        <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                        <div className="flex items-center mt-2">
                          {metric.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          <span className={`text-sm ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                            {metric.change}
                          </span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                        <metric.icon className={`h-6 w-6 ${metric.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Score Breakdown */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-800">Business Score Breakdown</CardTitle>
                  <CardDescription className="text-gray-600">
                    Detailed analysis of your business score components
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {scoreBreakdown.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">{item.category}</span>
                          <span className="text-sm text-gray-500">
                            {item.score}/{item.maxScore}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <motion.div
                            className={`h-3 rounded-full ${item.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.score / item.maxScore) * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-800">Recent Activities</CardTitle>
                  <CardDescription className="text-gray-600">Latest score-impacting activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{activity.activity}</p>
                          <p className="text-xs text-gray-500">{activity.date}</p>
                          <span className="text-xs text-green-600 font-medium">{activity.impact}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Available Reports */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800">Available Reports</CardTitle>
                <CardDescription className="text-gray-600">
                  Download detailed reports for deeper analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reports.map((report, index) => (
                    <motion.div
                      key={index}
                      className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-300 bg-white/50"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <report.icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{report.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                            <p className="text-xs text-gray-400 mt-2">Last updated: {report.lastUpdated}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadReport(report.title)}
                          className="btn-hover-effect"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
