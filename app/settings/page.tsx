"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, User, Bell, Shield, CreditCard, Globe, Save, Eye, EyeOff, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { user, logout } = useAuth()
  const { toast } = useToast()

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    businessName: user?.businessName || "",
    businessType: user?.businessType || "",
    industry: user?.industry || "",
    phone: "",
    address: "",
    website: "",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    scoreUpdates: true,
    documentReminders: true,
    complianceAlerts: true,
    marketingEmails: false,
  })

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
  })

  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
  })

  const handleProfileSave = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationsSave = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Notifications Updated",
        description: "Your notification preferences have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notifications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (security.newPassword !== security.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      })
      setSecurity({ ...security, currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "Please contact support to delete your account.",
    })
  }

  const handleExportData = () => {
    toast({
      title: "Data Export",
      description: "Your data export is being prepared and will be emailed to you.",
    })
  }

  const handlePreferencesSave = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Preferences Saved",
        description: "Your language, timezone, and date format have been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "preferences", label: "Preferences", icon: Globe },
  ]

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            value={profileData.businessName}
            onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
            placeholder="Enter business name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="businessType">Business Type</Label>
          <select
            id="businessType"
            value={profileData.businessType}
            onChange={(e) => setProfileData({ ...profileData, businessType: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select business type</option>
            <option value="sole-proprietorship">Sole Proprietorship</option>
            <option value="partnership">Partnership</option>
            <option value="llc">Limited Liability Company (LLC)</option>
            <option value="corporation">Corporation</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <select
            id="industry"
            value={profileData.industry}
            onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select industry</option>
            <option value="technology">Technology</option>
            <option value="retail">Retail</option>
            <option value="healthcare">Healthcare</option>
            <option value="finance">Finance</option>
            <option value="education">Education</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="services">Services</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          value={profileData.website}
          onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
          placeholder="https://www.example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Business Address</Label>
        <Textarea
          id="address"
          value={profileData.address}
          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
          placeholder="Enter your business address"
          rows={3}
        />
      </div>

      <Button onClick={handleProfileSave} disabled={isLoading} className="btn-hover-effect">
        {isLoading ? (
          <>
            <Save className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">Email Notifications</h3>
            <p className="text-sm text-gray-600">Receive notifications via email</p>
          </div>
          <Switch
            checked={notifications.emailNotifications}
            onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">Push Notifications</h3>
            <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
          </div>
          <Switch
            checked={notifications.pushNotifications}
            onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">Score Updates</h3>
            <p className="text-sm text-gray-600">Get notified when your business score changes</p>
          </div>
          <Switch
            checked={notifications.scoreUpdates}
            onCheckedChange={(checked) => setNotifications({ ...notifications, scoreUpdates: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">Document Reminders</h3>
            <p className="text-sm text-gray-600">Reminders to upload missing documents</p>
          </div>
          <Switch
            checked={notifications.documentReminders}
            onCheckedChange={(checked) => setNotifications({ ...notifications, documentReminders: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">Compliance Alerts</h3>
            <p className="text-sm text-gray-600">Important compliance and regulatory updates</p>
          </div>
          <Switch
            checked={notifications.complianceAlerts}
            onCheckedChange={(checked) => setNotifications({ ...notifications, complianceAlerts: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">Marketing Emails</h3>
            <p className="text-sm text-gray-600">Product updates and promotional content</p>
          </div>
          <Switch
            checked={notifications.marketingEmails}
            onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
          />
        </div>
      </div>

      <Button onClick={handleNotificationsSave} disabled={isLoading} className="btn-hover-effect">
        {isLoading ? (
          <>
            <Save className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Preferences
          </>
        )}
      </Button>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-gray-800">Change Password</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                value={security.currentPassword}
                onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              value={security.newPassword}
              onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
              placeholder="Enter new password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={security.confirmPassword}
              onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
            />
          </div>

          <Button onClick={handlePasswordChange} disabled={isLoading} className="btn-hover-effect">
            {isLoading ? (
              <>
                <Save className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
          </div>
          <Switch
            checked={security.twoFactorAuth}
            onCheckedChange={(checked) => setSecurity({ ...security, twoFactorAuth: checked })}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium text-gray-800 mb-4">Account Actions</h3>
        <div className="space-y-3">
          <Button variant="outline" onClick={handleExportData} className="btn-hover-effect">
            <Download className="mr-2 h-4 w-4" />
            Export My Data
          </Button>
          <Button variant="destructive" onClick={handleDeleteAccount} className="btn-hover-effect">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  )

  const renderBillingTab = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">No Billing Information</h3>
        <p className="text-gray-600 mb-4">You're currently on the free plan. Upgrade to unlock premium features.</p>
        <Button className="btn-hover-effect">Upgrade to Premium</Button>
      </div>
    </div>
  )

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-800 mb-2">Language</h3>
          <select
            className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={preferences.language}
            onChange={e => setPreferences(p => ({ ...p, language: e.target.value }))}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div>
          <h3 className="font-medium text-gray-800 mb-2">Timezone</h3>
          <select
            className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={preferences.timezone}
            onChange={e => setPreferences(p => ({ ...p, timezone: e.target.value }))}
          >
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Time</option>
            <option value="PST">Pacific Time</option>
            <option value="CST">Central Time</option>
          </select>
        </div>

        <div>
          <h3 className="font-medium text-gray-800 mb-2">Date Format</h3>
          <select
            className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={preferences.dateFormat}
            onChange={e => setPreferences(p => ({ ...p, dateFormat: e.target.value }))}
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      <Button className="btn-hover-effect" onClick={handlePreferencesSave} disabled={isLoading}>
        <Save className="mr-2 h-4 w-4" />
        {isLoading ? "Saving..." : "Save Preferences"}
      </Button>
    </div>
  )

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
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-6xl">
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
              Account <span className="text-blue-600">Settings</span>
            </h1>
            <p className="text-gray-600">Manage your account preferences and security settings</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <tab.icon className="mr-3 h-4 w-4" />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-800">{tabs.find((tab) => tab.id === activeTab)?.label}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {activeTab === "profile" && "Update your personal and business information"}
                    {activeTab === "notifications" && "Manage your notification preferences"}
                    {activeTab === "security" && "Secure your account with strong authentication"}
                    {activeTab === "billing" && "Manage your subscription and billing information"}
                    {activeTab === "preferences" && "Customize your application preferences"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activeTab === "profile" && renderProfileTab()}
                  {activeTab === "notifications" && renderNotificationsTab()}
                  {activeTab === "security" && renderSecurityTab()}
                  {activeTab === "billing" && renderBillingTab()}
                  {activeTab === "preferences" && renderPreferencesTab()}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
