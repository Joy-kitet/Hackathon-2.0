"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, User, ArrowRight } from "lucide-react"

interface LoginRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
  onRegister: () => void
}

export function LoginRequiredModal({ isOpen, onClose, onLogin, onRegister }: LoginRequiredModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Lock className="h-5 w-5 text-green-600" />
            Login Required
          </DialogTitle>
          <DialogDescription className="text-center text-sm sm:text-base">
            You need to be logged in to access the AI Waste Analyzer
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-blue-200 bg-blue-50">
          <User className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-sm">
            Create an account or sign in to start analyzing your waste items and discover wealth opportunities.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Button
            onClick={onLogin}
            variant="outline"
            className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
          >
            Sign In to Existing Account
          </Button>

          <Button onClick={onRegister} className="w-full bg-green-600 hover:bg-green-700">
            Create New Account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-800 mb-2">Demo Account</p>
            <div className="text-xs text-gray-700 space-y-1">
              <p>
                <strong>Email:</strong> demo@ecowise.com
              </p>
              <p>
                <strong>Password:</strong> demo123
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
