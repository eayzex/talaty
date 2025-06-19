"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  FileText,
  Shield,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  Upload,
  Eye,
  Award,
  Users,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [businessScore, setBusinessScore] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setTimeout(() => {
      setIsLoading(false)
      // Animate score to user's actual score
      let score = 0
      const targetScore = user?.businessScore || 45
      const interval = setInterval(() => {
        score += 1
        setBusinessScore(score)
        if (score >= targetScore) {
          clearInterval(interval)
        }
      }, 30)
    }, 1000)
  }, [isAuthenticated, router, user])

  const notifications = [
    {
      id: 1,
      title: "Document Upload Required",
      message: "Upload your business license to improve your score",
      time: "2 hours ago",
      type: "warning",
      unread: true,
    },
    {
      id: 2,
      title: "Score Update Available",
      message: "Your business score can be improved by 15 points",
      time: "5 hours ago",
      type: "info",
      unread: true,
    },
    {
      id: 3,
      title: "Compliance Check",
      message: "Annual compliance review is due next month",
      time: "1 day ago",
      type: "warning",
      unread: false,
    },
  ]

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "upload":
        router.push("/upload")
        break
      case "reports":
        router.push("/reports")
        break
      case "forms":
        router.push("/forms")
        break
      case "settings":
        router.push("/settings")
        break
      case "score-details":
        toast({
          title: "Score Details",
          description: "Detailed score breakdown is being prepared...",
        })
        setTimeout(() => {
          router.push("/score-results")
        }, 1500)
        break
      case "activities":
        toast({
          title: "Activity Log",
          description: "Loading your recent activities...",
        })
        break
      default:
        break
    }
  }

  const stats = [
    {
      title: "Business Score",
      value: businessScore,
      suffix: "/100",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Documents",
      value: user?.documentsUploaded || 0,
      suffix: "",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Compliance",
      value: user?.complianceScore || 65,
      suffix: "%",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Growth Rate",
      value: user?.growthRate || 12,
      suffix: "%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const recentActivities = [
    {
      title: "Account Created",
      description: "Welcome to Talaty! Complete your profile to get started",
      time: "Today",
      type: "success",
    },
    {
      title: "Profile Setup",
      description: "Business information has been saved",
      time: "Today",
      type: "info",
    },
    {
      title: "Score Calculation",
      description: `Initial business score calculated: ${user?.businessScore || 45}/100`,
      time: "Today",
      type: "info",
    },
    {
      title: "Next Steps",
      description: "Upload documents to improve your business score",
      time: "Now",
      type: "warning",
    },
  ]

  const quickActions = [
    {
      title: "Upload Documents",
      description: "Add business documents to improve your score",
      icon: Upload,
      action: "upload",
      color: "bg-blue-600",
    },
    {
      title: "View Reports",
      description: "Access detailed business analytics",
      icon: Eye,
      action: "reports",
      color: "bg-green-600",
    },
    {
      title: "Complete Forms",
      description: "Fill out business information forms",
      icon: FileText,
      action: "forms",
      color: "bg-purple-600",
    },
    {
      title: "Settings",
      description: "Manage your account preferences",
      icon: Settings,
      action: "settings",
      color: "bg-orange-600",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </motion.div>
      </div>
    )
  }

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
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <motion.div
          className="fixed top-20 right-4 w-80 bg-white rounded-xl shadow-xl border z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${notification.unread ? "bg-blue-50" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                  </div>
                  {notification.unread && <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
                  Welcome back, <span className="text-blue-600">{user?.name?.split(" ")[0]}</span>
                </h1>
                <p className="text-gray-600">Here's what's happening with your business today.</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <Button variant="outline" size="sm" className="btn-hover-effect">
                  <Calendar className="h-4 w-4 mr-2" />
                  Last 30 days
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="btn-hover-effect relative"
                  onClick={handleNotificationClick}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
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
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {stat.value}
                          {stat.suffix}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                    {stat.title === "Business Score" && (
                      <div className="mt-4">
                        <Progress value={businessScore} className="h-2" />
                        <p className="text-xs text-gray-500 mt-2">
                          {businessScore < 50
                            ? "Upload documents to improve your score"
                            : businessScore < 80
                              ? "Good progress! Keep uploading documents"
                              : "Excellent score! Well done!"}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-800">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-600">
                    Common tasks to help you manage your business
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={index}
                        className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-300 cursor-pointer group btn-hover-effect bg-white/50"
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickAction(action.action)}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform duration-300`}
                          >
                            <action.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold group-hover:text-blue-600 transition-colors text-gray-800">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-800">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-600">Latest updates and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            activity.type === "success"
                              ? "bg-green-500"
                              : activity.type === "warning"
                                ? "bg-orange-500"
                                : "bg-blue-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                          <p className="text-xs text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 btn-hover-effect"
                    onClick={() => handleQuickAction("activities")}
                  >
                    View All Activities
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Business Score Details */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Award className="h-5 w-5 mr-2 text-blue-600" />
                  Business Score Breakdown
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Detailed analysis of your business performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Financial Health", score: user?.businessScore || 45, color: "bg-green-500" },
                    { label: "Compliance Status", score: user?.complianceScore || 65, color: "bg-blue-500" },
                    { label: "Growth Potential", score: (user?.businessScore || 45) - 10, color: "bg-purple-500" },
                  ].map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                        <span className="text-sm text-gray-500">{metric.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${metric.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.score}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={() => handleQuickAction("score-details")}
                    className="btn-hover-effect bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    View Detailed Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Business Info Card */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
                      {user?.businessName || "Your Business"}
                    </h3>
                    <p className="text-gray-600">
                      {user?.businessType && user?.industry
                        ? `${user.businessType} • ${user.industry}`
                        : "Complete your business profile to unlock more features"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Member since {new Date(user?.createdAt || "").getFullYear()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
