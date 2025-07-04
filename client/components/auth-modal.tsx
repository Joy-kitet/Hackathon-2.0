"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, User, Loader2, AlertTriangle, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { SupabaseStatus } from "./supabase-status"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "login" | "register"
  onModeChange: (mode: "login" | "register") => void
}

export function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const { signIn, signUp, isSupabaseConfigured } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Basic validation
    if (!formData.email.trim()) {
      setError("Email is required")
      setLoading(false)
      return
    }

    if (!formData.password.trim()) {
      setError("Password is required")
      setLoading(false)
      return
    }

    try {
      if (mode === "login") {
        await signIn(formData.email.trim(), formData.password)
        setSuccess("Successfully signed in!")
      } else {
        if (!formData.name.trim()) {
          setError("Full name is required")
          setLoading(false)
          return
        }

        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match")
          setLoading(false)
          return
        }

        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters long")
          setLoading(false)
          return
        }

        await signUp(formData.email.trim(), formData.password)
        if (isSupabaseConfigured) {
          setSuccess("Please check your email and click the confirmation link to complete your registration.")
        } else {
          setSuccess("Account created successfully! You are now logged in.")
        }
      }

      // Close modal after a short delay to show success message
      setTimeout(
        () => {
          onClose()
          setFormData({ name: "", email: "", password: "", confirmPassword: "" })
          setSuccess(null)
          setError(null)
        },
        isSupabaseConfigured && mode === "register" ? 4000 : 2000,
      )
    } catch (error: any) {
      console.error("Auth error:", error)
      setError(error.message || "An error occurred during authentication")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError(null) // Clear error when user starts typing
    if (success) setSuccess(null) // Clear success when user starts typing
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
            {mode === "login" ? "Welcome Back" : "Join EcoWise"}
          </DialogTitle>
          <DialogDescription className="text-center text-sm sm:text-base">
            {mode === "login"
              ? "Sign in to access your waste management dashboard"
              : "Create an account to start your sustainable journey"}
          </DialogDescription>
        </DialogHeader>

        <SupabaseStatus />

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {mode === "register" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label htmlFor="name" className="text-sm">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    className="pl-10 text-sm sm:text-base"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10 text-sm sm:text-base"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10 text-sm sm:text-base"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mode === "register" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label htmlFor="confirmPassword" className="text-sm">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10 text-sm sm:text-base"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {mode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs sm:text-sm text-gray-500">
            or
          </span>
        </div>

        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <Button
              variant="link"
              className="p-0 ml-1 text-green-600 hover:text-green-700 text-xs sm:text-sm"
              onClick={() => onModeChange(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </Button>
          </p>
        </div>

        {/* Demo credentials for testing */}
        {!isSupabaseConfigured && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-800 mb-2">Demo Account</p>
              <div className="text-xs text-blue-700 space-y-1">
                <p>
                  <strong>Email:</strong> demo@ecowise.com
                </p>
                <p>
                  <strong>Password:</strong> demo123
                </p>
              </div>
              <p className="text-xs text-blue-600 mt-2">Or create a new account to test registration</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
