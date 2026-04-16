import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Lightbulb, CheckCircle2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Insight {
  type: string
  severity: string
  title: string
  message: string
}

interface InsightsCardProps {
  insights?: Insight[]
}

const INSIGHT_CONFIG: Record<string, any> = {
  warning: {
    icon: AlertCircle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/5",
    borderColor: "border-amber-500",
  },
  error: {
    icon: AlertCircle,
    color: "text-rose-500",
    bgColor: "bg-rose-500/5",
    borderColor: "border-rose-500",
  },
  info: {
    icon: Lightbulb,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/5",
    borderColor: "border-indigo-500",
  },
  success: {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/5",
    borderColor: "border-emerald-500",
  },
}

export function InsightsCard({ insights }: InsightsCardProps) {
  return (
    <Card className="rounded-none border-border/50 shadow-none h-full">
      <CardHeader>
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Smart Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!insights ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-3 border-l-2 border-muted bg-muted/5">
                <Skeleton className="h-4 w-4 rounded-none" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3 w-24 rounded-none" />
                  <Skeleton className="h-3 w-full rounded-none" />
                </div>
              </div>
            ))
          ) : insights.length === 0 ? (
            <p className="text-xs text-muted-foreground tracking-tight py-4">
              No insights yet. Start tracking your API usage to get smart recommendations.
            </p>
          ) : (
            insights.map((insight, index) => {
              const config = INSIGHT_CONFIG[insight.severity] || INSIGHT_CONFIG.info
              const Icon = config.icon || Lightbulb
              return (
                <div 
                  key={index} 
                  className={`flex items-start gap-4 rounded-none border-l-2 p-3 transition-colors hover:bg-muted/50 ${config.bgColor} ${config.borderColor}`}
                >
                  <div className={`mt-0.5 ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider leading-none">{insight.title}</p>
                    <p className="text-xs text-muted-foreground tracking-tight">{insight.message}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
