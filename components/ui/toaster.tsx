"use client"

import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`p-4 rounded-lg shadow-lg backdrop-blur-md flex items-start gap-3 min-w-[300px] max-w-md ${
              toast.variant === "destructive"
                ? "bg-destructive/90 text-destructive-foreground"
                : "bg-secondary/90 text-secondary-foreground"
            }`}
          >
            <div className="flex-1">
              <h3 className="font-medium">{toast.title}</h3>
              {toast.description && <p className="text-sm opacity-90 mt-1">{toast.description}</p>}
            </div>
            <button className="opacity-70 hover:opacity-100 transition-opacity">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
