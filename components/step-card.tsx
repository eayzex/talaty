"use client"

import { motion } from "framer-motion"

interface StepCardProps {
  number: string
  title: string
  description: string
  delay?: number
}

const StepCard = ({ number, title, description, delay = 0 }: StepCardProps) => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 relative z-10 h-full">
        <div className="text-4xl font-bold text-primary/20 mb-4">{number}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl transform rotate-3 -z-10"></div>
    </motion.div>
  )
}

export default StepCard
