"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Recycle,
  Lightbulb,
  AlertTriangle,
  DollarSign,
  Loader2,
  CheckCircle,
  XCircle,
  Sparkles,
} from "lucide-react"
import { DancingBin } from "./dancing-bin"

interface WasteItem {
  name: string
  category: string
  recyclability: string
  health_risk: string | null
  reuse_ideas: string[]
}

interface WealthIdea {
  title: string
  description: string
  required_materials: string[]
  estimated_value: string
}

interface AnalysisResponse {
  query: string
  extracted_waste_items: string[]
  items_info: WasteItem[]
  wealth_ideas: WealthIdea[]
  analysis: string | null
  quick_answer: string | null
}

interface WasteAnalyzerProps {
  isOpen: boolean
  onClose: () => void
}

export function WasteAnalyzer({ isOpen, onClose }: WasteAnalyzerProps) {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<AnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      })

      if (!res.ok) throw new Error("Failed to analyze query")

      const data: AnalysisResponse = await res.json()
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      rubber: "bg-gray-100 text-gray-800 border-gray-200",
      plastic: "bg-blue-100 text-blue-800 border-blue-200",
      metal: "bg-slate-100 text-slate-800 border-slate-200",
      electronic: "bg-purple-100 text-purple-800 border-purple-200",
      paper: "bg-yellow-100 text-yellow-800 border-yellow-200",
      glass: "bg-cyan-100 text-cyan-800 border-cyan-200",
      organic: "bg-green-100 text-green-800 border-green-200",
    }
    return colors[category.toLowerCase()] || "bg-slate-100 text-slate-800 border-slate-200"
  }

  const getRecyclabilityIcon = (recyclability: string) =>
    recyclability.toLowerCase().includes("recyclable") && !recyclability.toLowerCase().includes("not") ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Search className="h-5 w-5 text-green-600" />
            <span>AI Waste Analyzer</span>
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Ask about any waste item to get disposal advice and wealth ideas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Input & Submit */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Input
              placeholder="Enter your waste-related question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1 text-sm sm:text-base"
              disabled={loading}
            />
            <Button
              onClick={handleAnalyze}
              disabled={loading || !query.trim()}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
              Analyze
            </Button>
          </div>

          {/* Loader */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <DancingBin />
                <motion.p
                  className="text-gray-600 mt-4 text-sm sm:text-base"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Analyzing your waste query...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 text-sm sm:text-base">{error}</AlertDescription>
            </Alert>
          )}

          {/* Results */}
          <AnimatePresence>
            {response && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Quick Answer */}
                {response.quick_answer && (
                  <motion.div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-800 text-sm sm:text-base">Quick Answer</span>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base">{response.quick_answer}</p>
                  </motion.div>
                )}

                {/* Extracted Items */}
                {response.extracted_waste_items?.length > 0 && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-green-600" />
                      Detected Waste Items
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {response.extracted_waste_items.map((item, i) => (
                        <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Waste Items Info */}
                {response.items_info?.length > 0 && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Recycle className="h-5 w-5 mr-2 text-green-600" />
                      Detailed Analysis
                    </h3>
                    <div className="space-y-4">
                      {response.items_info.map((item, i) => (
                        <Card key={i} className="border border-gray-200 hover:shadow-md">
                          <CardHeader className="pb-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <CardTitle className="capitalize text-base sm:text-lg">{item.name}</CardTitle>
                              <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center space-x-2">
                              {getRecyclabilityIcon(item.recyclability)}
                              <span className="text-sm text-gray-600">{item.recyclability}</span>
                            </div>

                            {item.health_risk && (
                              <>
                                <Separator />
                                <div>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                    <span className="text-sm font-medium text-red-800">Health Risk:</span>
                                  </div>
                                  <p className="text-sm text-gray-600 ml-6">{item.health_risk}</p>
                                </div>
                              </>
                            )}

                            {item.reuse_ideas?.length > 0 && (
                              <>
                                <Separator />
                                <div>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                                    <span className="text-sm font-medium text-yellow-800">Reuse Ideas:</span>
                                  </div>
                                  <ul className="text-sm text-gray-600 ml-6 list-disc space-y-1">
                                    {item.reuse_ideas.map((idea, j) => (
                                      <li key={j}>{idea}</li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wealth Opportunities */}
                {response.wealth_ideas?.length > 0 && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                      Wealth Opportunities
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                      {response.wealth_ideas.map((idea, i) => (
                        <Card
                          key={i}
                          className="border-l-4 border-green-500 bg-green-50 hover:shadow-md transition-shadow"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <CardTitle className="text-green-800 text-sm sm:text-base">{idea.title}</CardTitle>
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-700 border-green-300 text-xs w-fit"
                              >
                                {idea.estimated_value}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-gray-700 leading-relaxed">{idea.description}</p>
                            {idea.required_materials?.length > 0 && (
                              <div>
                                <span className="text-sm font-medium text-gray-900 block mb-2">
                                  Required Materials:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {idea.required_materials.map((material, j) => (
                                    <Badge key={j} variant="secondary" className="text-xs">
                                      {material}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
