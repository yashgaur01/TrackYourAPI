import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Settings2, CheckCheck } from "lucide-react"
import { useAlerts } from "@/hooks/use-alerts"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

const getSeverityStyles = (severity: string) => {
  switch (severity) {
    case "critical":
    case "error":
      return {
        border: "border-l-rose-500",
        bg: "bg-rose-500/5",
        iconBg: "bg-rose-500",
        iconColor: "text-white",
        badge: "bg-rose-500/10 text-rose-600 border-rose-500/20"
      }
    case "warning":
      return {
        border: "border-l-amber-500",
        bg: "bg-amber-500/5",
        iconBg: "bg-amber-500",
        iconColor: "text-white",
        badge: "bg-amber-500/10 text-amber-600 border-amber-500/20"
      }
    case "info":
      return {
        border: "border-l-blue-500",
        bg: "bg-blue-500/5",
        iconBg: "bg-blue-500",
        iconColor: "text-white",
        badge: "bg-blue-500/10 text-blue-600 border-blue-500/20"
      }
    case "success":
      return {
        border: "border-l-emerald-500",
        bg: "bg-emerald-500/5",
        iconBg: "bg-emerald-500",
        iconColor: "text-white",
        badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
      }
    default:
      return {
        border: "border-l-primary",
        bg: "bg-muted/30",
        iconBg: "bg-primary",
        iconColor: "text-primary-foreground",
        badge: ""
      }
  }
}

export default function AlertsPage() {
  const { alerts, markAsRead, markAllAsRead } = useAlerts()

  const handleMarkAsRead = async (alertId: any) => {
    try {
      await markAsRead({ alertId })
      toast.success("Alert marked as read")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to mark alert as read")
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      toast.success("All alerts marked as read")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to mark all as read")
    }
  }

  const filteredAlerts = (type: string) => {
    if (!alerts) return []
    if (type === "all") return alerts
    if (type === "unread") return alerts.filter(a => !a.isRead)
    if (type === "resolved") return alerts.filter(a => a.isRead)
    return alerts
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xs font-bold uppercase tracking-[0.2em]">Alerts</h1>
          <div className="ml-auto flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[10px] font-bold uppercase tracking-widest h-8"
              onClick={handleMarkAllAsRead}
              disabled={!alerts || alerts.every(a => a.isRead)}
            >
              <CheckCheck className="mr-2 h-3.3 w-3.5" />
              Mark All Read
            </Button>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 relative">
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,oklch(0_0_0/0.01)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0_0_0/0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] dark:bg-[linear-gradient(to_right,oklch(1_0_0/0.02)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.02)_1px,transparent_1px)]" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-tighter uppercase">Alert Center</h1>
              <p className="text-muted-foreground text-sm tracking-tight">Manage and configure your system notifications.</p>
            </div>
            <Button className="rounded-none text-xs font-bold uppercase tracking-widest">
              <Settings2 className="mr-2 h-4 w-4" />
              Configure Thresholds
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="rounded-none bg-muted/50 p-1">
              <TabsTrigger value="all" className="rounded-none text-[10px] font-bold uppercase tracking-widest">All Alerts</TabsTrigger>
              <TabsTrigger value="unread" className="rounded-none text-[10px] font-bold uppercase tracking-widest">Unread</TabsTrigger>
              <TabsTrigger value="resolved" className="rounded-none text-[10px] font-bold uppercase tracking-widest">Resolved</TabsTrigger>
            </TabsList>
            
            {["all", "unread", "resolved"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-6">
                <div className="grid gap-4">
                  {!alerts ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i} className="rounded-none border-border/50 shadow-none border-l-4 border-l-muted">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-48" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-4 w-full" />
                        </CardContent>
                      </Card>
                    ))
                  ) : filteredAlerts(tab).length === 0 ? (
                    <Card className="rounded-none border-border/50 shadow-none py-12">
                      <CardContent className="flex flex-col items-center justify-center text-center">
                        <Info className="h-8 w-8 text-muted-foreground mb-4" />
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                          {tab === "unread" ? "No unread alerts" : tab === "resolved" ? "No resolved alerts" : "No alerts yet"}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Alerts will appear here when anomalies are detected.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredAlerts(tab).map((alert) => {
                      const styles = getSeverityStyles(alert.severity)
                      return (
                        <Card key={alert._id} className={`rounded-none border-border/50 shadow-none border-l-4 transition-all hover:shadow-md ${styles.border} ${!alert.isRead ? styles.bg : ""}`}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 ${styles.iconBg} ${styles.iconColor}`}>
                                  {alert.severity === "critical" || alert.severity === "error" ? <AlertCircle className="h-4 w-4" /> :
                                   alert.severity === "warning" ? <AlertTriangle className="h-4 w-4" /> :
                                   <Info className="h-4 w-4" />}
                                </div>
                                <div>
                                  <CardTitle className="text-sm font-bold uppercase tracking-wider">{alert.message.split(':')[0] || "System Alert"}</CardTitle>
                                  <CardDescription className="text-[10px] uppercase tracking-widest font-medium">
                                    {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                                  </CardDescription>
                                </div>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`rounded-none text-[8px] font-bold uppercase tracking-[0.2em] border-0 ${styles.badge}`}
                              >
                                {alert.severity}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <p className="text-xs text-muted-foreground max-w-xl tracking-tight">
                                {alert.message}
                              </p>
                              <div className="flex items-center gap-2">
                                {!alert.isRead ? (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="rounded-none text-[10px] font-bold uppercase tracking-widest"
                                    onClick={() => handleMarkAsRead(alert._id)}
                                  >
                                    <CheckCircle2 className="mr-2 h-3 w-3" />
                                    Mark as Read
                                  </Button>
                                ) : (
                                  <Badge variant="outline" className="rounded-none text-[8px] font-bold uppercase tracking-[0.2em] opacity-50">
                                    Resolved
                                  </Badge>
                                )}
                                <Button size="sm" variant="ghost" className="rounded-none text-[10px] font-bold uppercase tracking-widest">View Details</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
