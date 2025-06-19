"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Shield, BarChart3, Users, Globe, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useRouter } from "next/navigation"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="text-primary">Talaty</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're on a mission to empower small and medium businesses with the same level of business intelligence and
              insights that were once only available to large enterprises.
            </p>
          </motion.div>

          <motion.div
            className="relative max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="https://img.freepik.com/premium-photo/futuristic-fingerprint-scanner-ensuring-global-security-privacy-cuttingedge-technology-personal-data-protection-glimpse-into-future-biometric-identification_143683-12580.jpg?ga=GA1.1.44921241.1750324943&semt=ais_hybrid&w=740"
                alt="Futuristic fingerprint scanner"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                To democratize business intelligence by providing small and medium businesses with powerful, AI-driven
                tools that were traditionally only accessible to large corporations.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe every business deserves access to the insights and tools needed to make informed decisions,
                optimize operations, and accelerate growth.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                To become the global standard for business intelligence and digital transformation for SMBs, enabling
                millions of businesses to thrive in the digital economy.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We envision a world where every business, regardless of size, has the tools and insights needed to
                compete and succeed in today's market.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-12 border border-primary/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Join Our Mission?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Be part of the business intelligence revolution. Start your journey with Talaty today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-4 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary"
                onClick={() => router.push("/register")}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg" onClick={() => router.push("/contact")}>
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
