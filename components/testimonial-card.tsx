"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Quote } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  position: string
  image: string
  delay?: number
}

const TestimonialCard = ({ quote, author, position, image, delay = 0 }: TestimonialCardProps) => {
  return (
    <motion.div
      className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Quote className="h-8 w-8 text-primary/30 mb-4" />
      <p className="text-muted-foreground mb-6">{quote}</p>
      <div className="flex items-center">
        <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
          <Image src={image || "/placeholder.svg"} alt={author} fill className="object-cover" />
        </div>
        <div>
          <h4 className="font-semibold">{author}</h4>
          <p className="text-sm text-muted-foreground">{position}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default TestimonialCard
