import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Leaf, Recycle, Zap, FileText, Smartphone, BoxIcon as Bottle } from "lucide-react"

interface WasteCategoryBadgeProps {
  category: string
  className?: string
}

export function WasteCategoryBadge({ category, className }: WasteCategoryBadgeProps) {
  const getCategoryConfig = (cat: string) => {
    const configs: Record<string, { icon: React.ReactNode; color: string }> = {
      organic: {
        icon: <Leaf className="h-3 w-3" />,
        color: "bg-green-100 text-green-800 border-green-200",
      },
      plastic: {
        icon: <Bottle className="h-3 w-3" />,
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
      metal: {
        icon: <Recycle className="h-3 w-3" />,
        color: "bg-gray-100 text-gray-800 border-gray-200",
      },
      electronic: {
        icon: <Smartphone className="h-3 w-3" />,
        color: "bg-purple-100 text-purple-800 border-purple-200",
      },
      paper: {
        icon: <FileText className="h-3 w-3" />,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      glass: {
        icon: <Zap className="h-3 w-3" />,
        color: "bg-cyan-100 text-cyan-800 border-cyan-200",
      },
    }

    return (
      configs[cat.toLowerCase()] || {
        icon: <Recycle className="h-3 w-3" />,
        color: "bg-slate-100 text-slate-800 border-slate-200",
      }
    )
  }

  const config = getCategoryConfig(category)

  return (
    <Badge className={`${config.color} ${className}`}>
      {config.icon}
      <span className="ml-1 capitalize">{category}</span>
    </Badge>
  )
}
