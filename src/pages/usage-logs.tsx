import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Download, Filter, Search, X, DollarSign, Zap, Activity, Clock } from "lucide-react"
import { useUsageLogs } from "@/hooks/use-usage-logs"
import { useState, useMemo } from "react"
import { Skeleton } from "@/components/ui/skeleton"

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

interface Filters {
  search: string
  provider: string
  dateFrom: string
  dateTo: string
  minCost: string
  maxCost: string
  minLatency: string
  maxLatency: string
}

const defaultFilters: Filters = {
  search: "",
  provider: "all",
  dateFrom: "",
  dateTo: "",
  minCost: "",
  maxCost: "",
  minLatency: "",
  maxLatency: "",
}

export default function UsageLogsPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [filterOpen, setFilterOpen] = useState(false)

  const setFilter = (key: keyof Filters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }))

  const clearFilter = (key: keyof Filters) =>
    setFilters((prev) => ({ ...prev, [key]: defaultFilters[key] }))

  const hasActiveFilters = Object.entries(filters).some(
    ([k, v]) => v !== "" && v !== "all" && k !== "search"
  )
  const clearAllFilters = () => setFilters(defaultFilters)

  const { data: logs, isLoading } = useUsageLogs({
    provider: filters.provider !== "all" ? filters.provider : undefined,
    model: filters.search || undefined,
    dateFrom: filters.dateFrom ? new Date(filters.dateFrom).getTime() : undefined,
    dateTo: filters.dateTo ? new Date(filters.dateTo + "T23:59:59").getTime() : undefined,
    minCost: filters.minCost ? parseFloat(filters.minCost) : undefined,
    maxCost: filters.maxCost ? parseFloat(filters.maxCost) : undefined,
    minLatency: filters.minLatency ? parseFloat(filters.minLatency) : undefined,
    maxLatency: filters.maxLatency ? parseFloat(filters.maxLatency) : undefined,
  })

  const stats = useMemo(() => {
    if (!logs || logs.length === 0)
      return { totalCost: 0, totalTokens: 0, count: 0, avgLatency: 0 }
    return {
      totalCost: logs.reduce((s, l) => s + l.cost, 0),
      totalTokens: logs.reduce((s, l) => s + l.tokens, 0),
      count: logs.length,
      avgLatency: logs.reduce((s, l) => s + l.latency, 0) / logs.length,
    }
  }, [logs])

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })

  const handleExportCSV = () => {
    if (!logs || logs.length === 0) return
    const header = "Date,Provider,Model,Tokens,Cost,Latency\n"
    const rows = logs
      .map(
        (l) =>
          `${new Date(l.timestamp).toISOString()},${l.provider},${l.model},${l.tokens},${l.cost},${l.latency}`
      )
      .join("\n")
    const blob = new Blob([header + rows], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "trackyourapi-logs.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const activeFilterChips = [
    filters.provider !== "all" && { key: "provider" as const, label: `Provider: ${filters.provider}` },
    filters.dateFrom && { key: "dateFrom" as const, label: `From: ${filters.dateFrom}` },
    filters.dateTo && { key: "dateTo" as const, label: `To: ${filters.dateTo}` },
    filters.minCost && { key: "minCost" as const, label: `Cost ≥ $${filters.minCost}` },
    filters.maxCost && { key: "maxCost" as const, label: `Cost ≤ $${filters.maxCost}` },
    filters.minLatency && { key: "minLatency" as const, label: `Latency ≥ ${filters.minLatency}ms` },
    filters.maxLatency && { key: "maxLatency" as const, label: `Latency ≤ ${filters.maxLatency}ms` },
  ].filter(Boolean) as { key: keyof Filters; label: string }[]

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xs font-bold uppercase tracking-[0.2em]">Usage Logs</h1>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 relative">
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,oklch(0_0_0/0.01)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0_0_0/0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] dark:bg-[linear-gradient(to_right,oklch(1_0_0/0.02)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.02)_1px,transparent_1px)]" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-tighter uppercase">Request Logs</h1>
              <p className="text-muted-foreground text-sm tracking-tight">
                Search, filter and inspect all your AI API calls.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-none text-xs font-bold uppercase tracking-widest"
              onClick={handleExportCSV}
              disabled={!logs || logs.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>

          {/* Stats Summary Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: DollarSign, label: "Total Cost", value: `$${stats.totalCost.toFixed(4)}`, color: "text-emerald-500" },
              { icon: Zap, label: "Total Tokens", value: stats.totalTokens.toLocaleString(), color: "text-indigo-500" },
              { icon: Activity, label: "Requests", value: stats.count.toLocaleString(), color: "text-blue-500" },
              { icon: Clock, label: "Avg Latency", value: `${Math.round(stats.avgLatency)}ms`, color: "text-orange-500" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border border-border/50 bg-card/50">
                <s.icon className={`h-4 w-4 ${s.color} shrink-0`} />
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
                  <p className={`text-sm font-bold tabular-nums ${s.color}`}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          <Card className="rounded-none border-border/50 shadow-none">
            <CardHeader className="pb-3 space-y-3">
              {/* Search + Filter Bar */}
              <div className="flex flex-col md:flex-row gap-3 items-center">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="log-search"
                    placeholder="Search by model or provider..."
                    value={filters.search}
                    onChange={(e) => setFilter("search", e.target.value)}
                    className="pl-9 rounded-none border-border/50 text-xs"
                  />
                  {filters.search && (
                    <button
                      onClick={() => clearFilter("search")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Provider */}
                <Select value={filters.provider} onValueChange={(v) => setFilter("provider", v)}>
                  <SelectTrigger id="provider-select" className="w-full md:w-[160px] rounded-none border-border/50 text-[10px] font-bold uppercase tracking-widest">
                    <SelectValue placeholder="Provider" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="all">All Providers</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                  </SelectContent>
                </Select>

                {/* Advanced Filters Popover */}
                <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`rounded-none border-border/50 text-[10px] font-bold uppercase tracking-widest gap-2 ${hasActiveFilters ? "border-primary text-primary" : ""}`}
                    >
                      <Filter className="h-3.5 w-3.5" />
                      Filters
                      {hasActiveFilters && (
                        <span className="bg-primary text-primary-foreground rounded-full h-4 w-4 flex items-center justify-center text-[9px]">
                          {activeFilterChips.length}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="rounded-none w-80 p-4" align="end">
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest">Advanced Filters</p>

                      {/* Date Range */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground">Date From</Label>
                          <Input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => setFilter("dateFrom", e.target.value)}
                            className="rounded-none border-border/50 text-xs h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground">Date To</Label>
                          <Input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => setFilter("dateTo", e.target.value)}
                            className="rounded-none border-border/50 text-xs h-8"
                          />
                        </div>
                      </div>

                      {/* Cost Range */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground">Min Cost ($)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.0001"
                            placeholder="0.00"
                            value={filters.minCost}
                            onChange={(e) => setFilter("minCost", e.target.value)}
                            className="rounded-none border-border/50 text-xs h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground">Max Cost ($)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.0001"
                            placeholder="∞"
                            value={filters.maxCost}
                            onChange={(e) => setFilter("maxCost", e.target.value)}
                            className="rounded-none border-border/50 text-xs h-8"
                          />
                        </div>
                      </div>

                      {/* Latency Range */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground">Min Latency (ms)</Label>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={filters.minLatency}
                            onChange={(e) => setFilter("minLatency", e.target.value)}
                            className="rounded-none border-border/50 text-xs h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase tracking-widest text-muted-foreground">Max Latency (ms)</Label>
                          <Input
                            type="number"
                            min="0"
                            placeholder="∞"
                            value={filters.maxLatency}
                            onChange={(e) => setFilter("maxLatency", e.target.value)}
                            className="rounded-none border-border/50 text-xs h-8"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-none text-[10px] uppercase tracking-widest"
                          onClick={() => { clearAllFilters(); setFilterOpen(false) }}
                        >
                          Reset
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 rounded-none text-[10px] uppercase tracking-widest"
                          onClick={() => setFilterOpen(false)}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Active Filter Chips */}
              {activeFilterChips.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Active:</span>
                  {activeFilterChips.map((chip) => (
                    <button
                      key={chip.key}
                      onClick={() => clearFilter(chip.key)}
                      className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                    >
                      {chip.label}
                      <X className="h-2.5 w-2.5" />
                    </button>
                  ))}
                  <button
                    onClick={clearAllFilters}
                    className="text-[9px] uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors underline underline-offset-2"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Result count */}
              {logs && (
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  {logs.length === 0 ? "No results" : `${logs.length} request${logs.length !== 1 ? "s" : ""}`}
                </p>
              )}
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Date</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Provider</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Model</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Tokens</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Cost</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Latency</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!logs ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i} className="border-border/50">
                        <TableCell><Skeleton className="h-3 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-3 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-3 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-3 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-3 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      </TableRow>
                    ))
                  ) : logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-8 w-8 text-muted-foreground/30" />
                          <p className="text-xs text-muted-foreground uppercase tracking-widest">
                            {hasActiveFilters || filters.search
                              ? "No results match your filters"
                              : "No usage logs yet. Start sending API requests to see them here."}
                          </p>
                          {(hasActiveFilters || filters.search) && (
                            <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest" onClick={clearAllFilters}>
                              Clear filters
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log._id} className="border-border/50 hover:bg-muted/30 transition-colors">
                        <TableCell className="text-[10px] font-medium tabular-nums">{formatDate(log.timestamp)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`rounded-none text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-0 border-0 ${getProviderColor(log.provider)}`}
                          >
                            {log.provider}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[10px] font-mono opacity-70">{log.model}</TableCell>
                        <TableCell className="text-[10px] tabular-nums">{log.tokens.toLocaleString()}</TableCell>
                        <TableCell className="text-[10px] tabular-nums font-bold">${log.cost.toFixed(4)}</TableCell>
                        <TableCell className={`text-[10px] tabular-nums ${log.latency > 1000 ? "text-rose-500 font-bold" : ""}`}>
                          {Math.round(log.latency)}ms
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="rounded-none text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-0 border-0 bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          >
                            200 OK
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
