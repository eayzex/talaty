"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  ImageIcon,
  FileSpreadsheet,
  Loader2,
  File,
  CreditCard,
  Building,
  Receipt,
  Shield,
  Award,
  FileCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import Navbar from "@/components/navbar"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "completed" | "error"
  progress: number
  category: string
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { addDocument, user, updateBusinessScore } = useAuth()

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<{ [category: string]: string | null }>({})

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return ImageIcon
    if (type.includes("spreadsheet") || type.includes("excel") || type.includes("csv")) return FileSpreadsheet
    if (type.includes("pdf") || type.includes("document")) return FileText
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      // If the first file is an image, set its preview
      const firstFile = selectedFiles[0]
      if (firstFile && firstFile.type.startsWith("image")) {
        const url = URL.createObjectURL(firstFile)
        setImagePreviews((prev) => ({ ...prev, [category]: url }))
      } else {
        setImagePreviews((prev) => ({ ...prev, [category]: null }))
      }
      setSelectedFiles(selectedFiles)
      handleFiles(selectedFiles, category)
      e.target.value = ""
    }
  }

  const handleDrop = (e: React.DragEvent, category: string) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles, category)
  }

  const handleFiles = (fileList: File[], category: string) => {
    const newFiles: UploadedFile[] = fileList.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
      category,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    newFiles.forEach((file) => {
      simulateUpload(file.id, category)
    })
  }

  const simulateUpload = (fileId: string, category: string) => {
    setIsUploading(true)
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "completed", progress: 100 } : f)))
        setIsUploading(false)
        addDocument()

        // Show professional score update
        const scoreIncrease = getScoreIncrease(category)
        const newScore = Math.min((user?.businessScore || 45) + scoreIncrease, 100)
        updateBusinessScore(newScore)

        toast({
          title: "🎉 Document Uploaded Successfully!",
          description: `Your business score increased by +${scoreIncrease} points! New score: ${newScore}/100`,
        })
      } else {
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
      }
    }, 200)
  }

  const getScoreIncrease = (category: string) => {
    const scoreMap: { [key: string]: number } = {
      "ID Documents": 12,
      "Business License": 15,
      "Financial Documents": 10,
      "Tax Documents": 8,
      "Insurance Documents": 6,
      "Other Documents": 5,
    }
    return scoreMap[category] || 5
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const handleRemoveImage = (category: string) => {
    setImagePreviews((prev) => ({ ...prev, [category]: null }))
    // Optionally, also remove the file from files state if you want
    setFiles((prev) => prev.filter((f) => f.category !== category || !f.type.startsWith("image")))
  }

  const documentCategories = [
    {
      id: "id-documents",
      title: "ID Documents",
      description: "Identity verification documents",
      icon: CreditCard,
      color: "from-blue-500 to-blue-600",
      examples: ["National ID", "Passport", "Driver's License", "Utility Bill"],
      scoreBoost: "+12 points",
    },
    {
      id: "business-license",
      title: "Business License",
      description: "Business registration and licenses",
      icon: Building,
      color: "from-green-500 to-green-600",
      examples: ["Business Registration", "Trade License", "Operating Permit", "Articles of Incorporation"],
      scoreBoost: "+15 points",
    },
    {
      id: "financial-documents",
      title: "Financial Documents",
      description: "Bank statements and financial records",
      icon: Receipt,
      color: "from-purple-500 to-purple-600",
      examples: ["Bank Statements", "Balance Sheet", "P&L Statement", "Cash Flow"],
      scoreBoost: "+10 points",
    },
    {
      id: "tax-documents",
      title: "Tax Documents",
      description: "Tax returns and related documents",
      icon: FileCheck,
      color: "from-orange-500 to-orange-600",
      examples: ["Tax Returns", "VAT Registration", "Tax Clearance", "Audit Reports"],
      scoreBoost: "+8 points",
    },
    {
      id: "insurance-documents",
      title: "Insurance Documents",
      description: "Business insurance policies",
      icon: Shield,
      color: "from-red-500 to-red-600",
      examples: ["General Liability", "Professional Indemnity", "Property Insurance", "Workers Compensation"],
      scoreBoost: "+6 points",
    },
    {
      id: "other-documents",
      title: "Other Documents",
      description: "Additional business documents",
      icon: FileText,
      color: "from-gray-500 to-gray-600",
      examples: ["Contracts", "Agreements", "Certificates", "Business Plans"],
      scoreBoost: "+5 points",
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
              width: Math.random() * 4 + 3,
              height: Math.random() * 4 + 3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 5}s`,
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
              Upload <span className="text-blue-600">Documents</span>
            </h1>
            <p className="text-gray-600">
              Upload your business documents to improve your score. Current score:{" "}
              <span className="font-semibold text-blue-600">{user?.businessScore || 45}/100</span>
            </p>
          </motion.div>

          {/* Document Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {documentCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} text-white`}>
                        <category.icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {category.scoreBoost}
                      </span>
                    </div>
                    <CardTitle className="text-lg text-gray-800">{category.title}</CardTitle>
                    <CardDescription className="text-gray-600">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {imagePreviews[category.title] ? (
                      <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-blue-50">
                        <img
                          src={imagePreviews[category.title] || ''}
                          alt="Preview"
                          className="max-h-48 rounded shadow mb-2"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(category.title)}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                        >
                          <X className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, category.title)}
                      >
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700 mb-2">Drop files here</p>
                        <p className="text-xs text-gray-500 mb-3">or click to browse</p>
                        <input
                          type="file"
                          multiple
                          onChange={(e) => handleFileSelect(e, category.title)}
                          className="hidden"
                          id={`file-upload-${category.id}`}
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.txt"
                        />
                        <label htmlFor={`file-upload-${category.id}`} className="cursor-pointer px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white">
                          Select Files
                        </label>
                      </div>
                    )}
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-600 mb-2">Examples:</p>
                      <div className="flex flex-wrap gap-1">
                        {category.examples.map((example, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="border-gray-200 mb-8 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gray-800">Uploaded Files</CardTitle>
                  <CardDescription className="text-gray-600">
                    Track the progress of your document uploads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {files.map((file) => {
                      const FileIcon = getFileIcon(file.type)
                      return (
                        <div
                          key={file.id}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-white/50"
                        >
                          <div className="flex-shrink-0">
                            <FileIcon className="h-8 w-8 text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-gray-800">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)} • {file.category}
                            </p>
                            {file.status === "uploading" && (
                              <div className="mt-2">
                                <Progress value={file.progress} className="h-2" />
                                <p className="text-xs text-gray-500 mt-1">{Math.round(file.progress)}% uploaded</p>
                              </div>
                            )}
                          </div>
                          <div className="flex-shrink-0 flex items-center space-x-2">
                            {file.status === "uploading" && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                            {file.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {file.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                            <button onClick={() => removeFile(file.id)} className="text-gray-400 hover:text-gray-600">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {files.some((f) => f.status === "completed") && (
                    <div className="mt-6 flex justify-center">
                      <Button
                        onClick={() => router.push("/score-results")}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 btn-hover-effect"
                      >
                        View Updated Score
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Award className="h-5 w-5 mr-2 text-blue-600" />
                  Pro Tips for Better Scores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">📄 Document Quality</h4>
                    <p className="text-sm text-gray-600">
                      Upload clear, high-resolution documents for better processing
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">📅 Recent Documents</h4>
                    <p className="text-sm text-gray-600">More recent documents provide higher score improvements</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">✅ Complete Categories</h4>
                    <p className="text-sm text-gray-600">Upload documents from all categories for maximum score</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">🔒 Secure Processing</h4>
                    <p className="text-sm text-gray-600">All documents are encrypted and processed securely</p>
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
