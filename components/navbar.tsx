"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, User, LogOut, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogin = () => {
    router.push("/login")
  }

  const handleRegister = () => {
    router.push("/register")
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const handleDashboard = () => {
    router.push("/dashboard")
  }

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

  const navLinks = [
    { title: "Home", href: "/" },
   
    
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ]

  const dashboardLinks = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Documents", href: "/upload" },
    { title: "Forms", href: "/forms" },
    { title: "Reports", href: "/reports" },
    { title: "Settings", href: "/settings" },
  ]

  const currentLinks =
    pathname.startsWith("/dashboard") ||
    pathname === "/upload" ||
    pathname === "/forms" ||
    pathname === "/reports" ||
    pathname === "/settings"
      ? dashboardLinks
      : navLinks

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <motion.div
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Talaty
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {currentLinks.map((link, index) => (
                <div key={index} className="relative">
                  {link.dropdown ? (
                    <div>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === link.title ? null : link.title)}
                        className="px-4 py-2 text-sm font-medium flex items-center hover:text-blue-600 transition-colors duration-200 rounded-lg hover:bg-blue-50 text-gray-700"
                      >
                        {link.title}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === link.title && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 w-56 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl py-2 z-50"
                          >
                            {link.dropdown.map((item, idx) => (
                              <Link
                                key={idx}
                                href={item.href}
                                className="block px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg mx-2 text-gray-700"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {item.title}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-blue-50 ${
                        pathname === link.href ? "text-blue-600" : "hover:text-blue-600 text-gray-700"
                      }`}
                    >
                      {link.title}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full relative"
                      onClick={() => setShowNotifications(!showNotifications)}
                    >
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </Button>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="rounded-full flex items-center space-x-2 p-1 pl-2">
                        <span className="font-medium text-sm text-gray-700">{user?.name?.split(" ")[0]}</span>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback className="bg-blue-100 text-blue-600">{user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleDashboard} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="rounded-full px-6 hover:bg-blue-50 btn-hover-effect text-gray-700"
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                  <Button
                    className="rounded-full px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 btn-hover-effect"
                    onClick={handleRegister}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              onClick={() => setIsOpen(!isOpen)}
            >
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/95 backdrop-blur-md border-b border-gray-200"
            >
              <div className="container mx-auto px-4 py-6">
                {isAuthenticated && (
                  <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-200">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback className="bg-blue-100 text-blue-600">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                )}

                <nav className="flex flex-col space-y-4">
                  {currentLinks.map((link, index) => (
                    <div key={index}>
                      {link.dropdown ? (
                        <div>
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === link.title ? null : link.title)}
                            className="w-full text-left px-4 py-3 text-sm font-medium flex items-center justify-between hover:text-blue-600 transition-colors duration-200 rounded-lg hover:bg-blue-50 text-gray-700"
                          >
                            {link.title}
                            <ChevronDown className="ml-1 h-4 w-4" />
                          </button>
                          <AnimatePresence>
                            {activeDropdown === link.title && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="pl-4 border-l border-gray-200 ml-4 mt-2 space-y-2"
                              >
                                {link.dropdown.map((item, idx) => (
                                  <Link
                                    key={idx}
                                    href={item.href}
                                    className="block px-4 py-2 text-sm hover:text-blue-600 transition-colors duration-200 rounded-lg hover:bg-blue-50 text-gray-600"
                                    onClick={() => {
                                      setIsOpen(false)
                                      setActiveDropdown(null)
                                    }}
                                  >
                                    {item.title}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={link.href}
                          className={`block px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-blue-50 ${
                            pathname === link.href ? "text-blue-600" : "hover:text-blue-600 text-gray-700"
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {link.title}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>

                <div className="mt-6 grid grid-cols-1 gap-4">
                  {isAuthenticated ? (
                    <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          handleLogin()
                          setIsOpen(false)
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                        onClick={() => {
                          handleRegister()
                          setIsOpen(false)
                        }}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            className="fixed top-20 right-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    notification.unread ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-800">{notification.title}</h4>
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
      </AnimatePresence>
    </>
  )
}

export default Navbar
