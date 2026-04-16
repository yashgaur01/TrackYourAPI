import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ActivityItem {
  _id: string
  provider: string
  model: string
  tokens: number
  cost: number
  latency: number
  timestamp: number
}

interface ActivityTableProps {
  activity?: ActivityItem[]
}

const getProviderColor = (provider: string) => {
  switch (provider.toLowerCase()) {
    case "openai":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    case "anthropic":
    case "claude":
      return "bg-purple-500/10 text-purple-600 border-purple-500/20"
    case "google":
    case "gemini":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function ActivityTable({ activity }: ActivityTableProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  return (
    <Card className="rounded-none border-border/50 shadow-none">
      <CardHeader>
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="text-[10px] uppercase tracking-widest font-bold">Timestamp</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold">Provider</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold">Model</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold">Tokens</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold">Cost</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold">Cost/1k</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold">Latency</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!activity ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border/50">
                  <TableCell><Skeleton className="h-3 w-24 rounded-none" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 rounded-none" /></TableCell>
                  <TableCell><Skeleton className="h-3 w-20 rounded-none" /></TableCell>
                  <TableCell><Skeleton className="h-3 w-12 rounded-none" /></TableCell>
                  <TableCell><Skeleton className="h-3 w-12 rounded-none" /></TableCell>
                  <TableCell><Skeleton className="h-3 w-12 rounded-none" /></TableCell>
                  <TableCell><Skeleton className="h-3 w-12 rounded-none" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 rounded-none" /></TableCell>
                </TableRow>
              ))
            ) : activity.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-xs text-muted-foreground uppercase tracking-widest">
                  No activity yet
                </TableCell>
              </TableRow>
            ) : (
              activity.map((row) => (
                <TableRow key={row._id} className="border-border/50 hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium text-[10px] tabular-nums">
                    {formatDate(row.timestamp)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`rounded-none text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-0 border-0 ${getProviderColor(row.provider)}`}
                    >
                      {row.provider}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[10px] font-mono opacity-70">{row.model}</TableCell>
                  <TableCell className="text-[10px] tabular-nums">{row.tokens.toLocaleString()}</TableCell>
                  <TableCell className="text-[10px] tabular-nums font-bold">${row.cost.toFixed(4)}</TableCell>
                  <TableCell className="text-[10px] tabular-nums font-medium opacity-70">
                    {row.tokens > 0 ? `$${((row.cost / row.tokens) * 1000).toFixed(4)}` : "$0.0000"}
                  </TableCell>
                  <TableCell className="text-[10px] tabular-nums">{Math.round(row.latency)}ms</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="rounded-none text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-0 border-0 bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    >
                      Success
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
