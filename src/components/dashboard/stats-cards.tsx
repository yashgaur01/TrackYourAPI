import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DollarSign, Zap, Activity, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface StatsCardsProps {
  stats?: {
    totalCost: number
    totalTokens: number
    totalRequests: number
    avgLatency: number
    costThisMonth: number
    tokensThisMonth: number
    requestsThisMonth: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`
    return tokens.toString()
  }

  const items = [
    {
      title: "Total Cost This Month",
      value: stats ? `$${stats.costThisMonth.toFixed(2)}` : null,
      description: "Current billing period",
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      trendColor: "text-muted-foreground",
    },
    {
      title: "Total Tokens Used",
      value: stats ? formatTokens(stats.tokensThisMonth) : null,
      description: "Across all providers",
      icon: Zap,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      trendColor: "text-muted-foreground",
    },
    {
      title: "API Requests",
      value: stats ? stats.requestsThisMonth.toLocaleString() : null,
      description: "Total successful calls",
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      trendColor: "text-muted-foreground",
    },
    {
      title: "Avg Latency",
      value: stats ? `${Math.round(stats.avgLatency)}ms` : null,
      description: "Network + Inference",
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      trendColor: "text-muted-foreground",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title} className="rounded-none border-border/50 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {item.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${item.bgColor}`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            {item.value === null ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-24 rounded-none" />
                <Skeleton className="h-3 w-32 rounded-none" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold tracking-tighter">{item.value}</div>
                <p className="text-[10px] uppercase tracking-wider mt-1 flex items-center gap-1">
                  <span className="text-muted-foreground">{item.description}</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
