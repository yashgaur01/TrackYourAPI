import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardChartsProps {
  dailyCosts?: Array<{ date: string; cost: number }>
  providerBreakdown?: Array<{ provider: string; cost: number; tokens: number; requests: number }>
  dailyRequests?: Array<{ date: string; requests: number }>
}

const PROVIDER_COLORS: Record<string, string> = {
  openai: "oklch(0.6 0.15 150)", // emerald
  anthropic: "oklch(0.5 0.2 280)", // purple
  claude: "oklch(0.5 0.2 280)",
  gemini: "oklch(0.6 0.15 220)", // blue
  google: "oklch(0.6 0.15 220)",
  deepseek: "oklch(0.55 0.15 250)", // deep blue
  kimi: "oklch(0.6 0.2 200)", // cyan/blue
  moonshot: "oklch(0.6 0.2 200)",
  glm: "oklch(0.5 0 0)", // dark
  zhipu: "oklch(0.5 0 0)",
  groq: "oklch(0.6 0.2 20)", // orange/red
  perplexity: "oklch(0.5 0.15 180)", // teal
  sonar: "oklch(0.5 0.15 180)",
}

export function DashboardCharts({ dailyCosts, providerBreakdown, dailyRequests }: DashboardChartsProps) {
  const formattedProviderData = providerBreakdown?.map(item => ({
    name: item.provider.charAt(0).toUpperCase() + item.provider.slice(1),
    value: item.cost,
    color: PROVIDER_COLORS[item.provider.toLowerCase()] || "oklch(0.5 0 0)",
  }))

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-4 rounded-none border-border/50 shadow-none">
        <CardHeader>
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Daily Cost Trend</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px] w-full flex items-center justify-center">
            {dailyCosts && dailyCosts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyCosts}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.6 0.2 250)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.6 0.2 250)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.5 0 0 / 0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="oklch(0.5 0 0)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatDate}
                  />
                  <YAxis
                    stroke="oklch(0.5 0 0)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid oklch(0.6 0.2 250 / 0.5)",
                      borderRadius: "0px",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      boxShadow: "0 0 20px oklch(0.6 0.2 250 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cost"
                    stroke="oklch(0.6 0.2 250)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCost)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">No data yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3 rounded-none border-border/50 shadow-none">
        <CardHeader>
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Usage by Provider</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            {formattedProviderData && formattedProviderData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formattedProviderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="var(--background)"
                    strokeWidth={2}
                  >
                    {formattedProviderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "0px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-[10px] font-bold uppercase tracking-widest ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">No data yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-7 rounded-none border-border/50 shadow-none">
        <CardHeader>
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Requests per Day</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px] w-full flex items-center justify-center">
            {dailyRequests && dailyRequests.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyRequests}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.5 0 0 / 0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="oklch(0.5 0 0)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatDate}
                  />
                  <YAxis
                    stroke="oklch(0.5 0 0)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'oklch(0.5 0.2 300 / 0.05)' }}
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid oklch(0.5 0.2 300 / 0.5)",
                      borderRadius: "0px",
                      boxShadow: "0 0 20px oklch(0.5 0.2 300 / 0.1)",
                    }}
                  />
                  <Bar 
                    dataKey="requests" 
                    fill="oklch(0.5 0.2 300)" 
                    radius={[4, 4, 0, 0]} 
                    barSize={30} 
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">No data yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
