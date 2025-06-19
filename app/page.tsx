"use client"

import { useEffect, useState } from "react"
import { motion, easeInOut } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowRight, BarChart3, FileCheck, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import Navbar from "@/components/navbar"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/register")
    }
  }

  const handleLearnMore = () => {
    router.push("/about")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: easeInOut,
      },
    },
  }

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Advanced eKYC",
      description: "Complete digital identity verification in under 2 minutes with bank-grade security.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "AI Business Scoring",
      description: "Get real-time business health scores with actionable insights powered by machine learning.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <FileCheck className="h-8 w-8" />,
      title: "Smart Document Hub",
      description: "Intelligent document management with auto-categorization and compliance tracking.",
      color: "from-green-500 to-emerald-500",
    },
  ]

  const stats = [
    { number: "100+", label: "Active Businesses" },
    { number: "98%", label: "Success Rate" },
    { number: "2min", label: "Average Setup" },
    { number: "24/7", label: "Support" },
  ]

  const testimonials = [
    {
      quote: "Talaty transformed our business operations. Our efficiency increased by 300% in just 3 months!",
      author: "Sarah Chen",
      position: "CEO, TechFlow Solutions",
      rating: 5,
    },
    {
      quote: "The AI scoring system helped us identify growth opportunities we never knew existed.",
      author: "Marcus Rodriguez",
      position: "Founder, GreenTech Innovations",
      rating: 5,
    },
    {
      quote: "Best investment we made for our business. The ROI was visible within the first month.",
      author: "Priya Patel",
      position: "Director, Artisan Crafts Co.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div className="text-center" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-8"
              
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Trusted by 100+ businesses worldwide
            </motion.div>

            <motion.h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8" variants={itemVariants}>
              Transform Your{" "}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Business Intelligence
              </span>
            </motion.h1>

            <motion.p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12" variants={itemVariants}>
              Unlock unprecedented growth with AI-powered business scoring, lightning-fast eKYC verification, and
              intelligent document management. Join the future of business operations.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-6 justify-center items-center" variants={itemVariants}>
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={handleGetStarted}
              >
                {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg font-semibold rounded-full border-2 hover:bg-primary/10 transition-all duration-300"
                onClick={handleLearnMore}
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20" variants={containerVariants}>
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for <span className="text-primary">Modern Businesses</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to streamline operations, boost efficiency, and accelerate growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="relative bg-card/80 border border-border/50 rounded-2xl p-8 h-full overflow-hidden group-hover:border-primary/50 transition-all duration-300">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>

                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6`}>
                    {feature.icon}
                  </div>

                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

                  <motion.div className="mt-6 inline-flex items-center text-primary font-medium" whileHover={{ x: 5 }}>
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Get Started in <span className="text-primary">4 Simple Steps</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From signup to insights in under 5 minutes. No complex setup required.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Quick Signup", desc: "Create your account in 30 seconds" },
              { step: "02", title: "Instant eKYC", desc: "Complete verification in 2 minutes" },
              { step: "03", title: "Upload Documents", desc: "Drag & drop your business files" },
              { step: "04", title: "Get Your Score", desc: "Receive AI-powered insights instantly" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative bg-card/80 border border-border/50 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300">
                  <div className="text-6xl font-bold text-primary/20 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>

                {index < 3 && (
                  <motion.div
                    className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Loved by <span className="text-primary">Business Leaders</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See what industry leaders are saying about Talaty's impact on their business growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-card/80 border border-border/50 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">
                      ⭐
                    </span>
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>

                <div className="flex items-center">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4 bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">{testimonial.author.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="relative bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-12 md:p-16 border border-primary/20 overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            <div className="relative z-10 text-center">
              <motion.div
                className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 text-primary font-medium text-sm mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="w-4 h-4 mr-2" />
                Join 50,000+ successful businesses
              </motion.div>

              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Ready to <span className="text-primary">Transform</span> Your Business?
              </h2>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
                Start your free trial today and experience the power of AI-driven business intelligence. No credit card
                required, cancel anytime.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  size="lg"
                  className="px-10 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  onClick={handleGetStarted}
                >
                  {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-10 py-4 text-lg font-semibold rounded-full border-2 hover:bg-primary/10 transition-all duration-300"
                  onClick={() => router.push("/contact")}
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
