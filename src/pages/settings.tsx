import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, AlertCircle, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useSettings } from "@/hooks/use-settings"
import { useAuth } from "@/hooks/use-auth"
import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings()
  const { user } = useAuth()
  const [budget, setBudget] = useState("1000")
  const [costAlert, setCostAlert] = useState("0.10")
  const [latencyAlert, setLatencyAlert] = useState("2000")
  const [isSaving, setIsSaving] = useState(false)

  // Load initial settings
  useEffect(() => {
    if (settings) {
      setBudget(settings.monthlyBudget.toString())
      setCostAlert(settings.costAlertThreshold.toString())
      setLatencyAlert(settings.latencyAlertThreshold.toString())
    }
  }, [settings])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await updateSettings({
        monthlyBudget: parseFloat(budget) || 1000,
        costAlertThreshold: parseFloat(costAlert) || 0.1,
        latencyAlertThreshold: parseFloat(latencyAlert) || 2000,
      })
      toast.success("Settings saved successfully")
    } catch (err) {
      toast.error("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xs font-bold uppercase tracking-[0.2em]">Settings</h1>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-6 p-6 relative max-w-4xl mx-auto w-full">
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,oklch(0_0_0/0.01)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0_0_0/0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] dark:bg-[linear-gradient(to_right,oklch(1_0_0/0.02)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.02)_1px,transparent_1px)]" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-tighter uppercase">Preferences</h1>
              <p className="text-muted-foreground text-sm tracking-tight">
                Manage your alerts, budget, and account settings.
              </p>
            </div>
            <Button 
              className="rounded-none text-xs font-bold uppercase tracking-widest"
              onClick={handleSave}
              disabled={isSaving || settings === undefined}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <div className="grid gap-6">
            {/* Budget & Alerts */}
            <Card className="rounded-none border-border/50 shadow-none">
              <CardHeader className="pb-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">Tracking Limits & Alerts</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Configure when TrackYourAPI should generate insights and alerts.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {settings === undefined ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="grid gap-2 relative">
                      <Label htmlFor="budget" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Monthly Budget ($)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input 
                          id="budget" 
                          type="number" 
                          min="0"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="pl-7 rounded-none border-border/50 font-mono text-sm focus-visible:ring-primary" 
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">Used for the "Budget Tracking" dashboard insight.</p>
                    </div>

                    <div className="grid gap-2 relative">
                      <Label htmlFor="cost-alert" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        High Cost Request Alert Threshold ($)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input 
                          id="cost-alert" 
                          type="number" 
                          min="0"
                          step="0.01"
                          value={costAlert}
                          onChange={(e) => setCostAlert(e.target.value)}
                          className="pl-7 rounded-none border-border/50 font-mono text-sm focus-visible:ring-primary" 
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">Generate an alert if a single API call costs more than this.</p>
                    </div>

                    <div className="grid gap-2 relative">
                      <Label htmlFor="latency-alert" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        High Latency Alert Threshold (ms)
                      </Label>
                      <div className="relative">
                        <Input 
                          id="latency-alert" 
                          type="number" 
                          min="0"
                          step="100"
                          value={latencyAlert}
                          onChange={(e) => setLatencyAlert(e.target.value)}
                          className="pr-10 rounded-none border-border/50 font-mono text-sm focus-visible:ring-primary" 
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">ms</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Generate an alert if an API call takes longer than this.</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="rounded-none border-border/50 shadow-none">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-sm font-bold uppercase tracking-wider">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                  <Input 
                    disabled 
                    value={user?.email || "Loading..."} 
                    className="rounded-none border-border/50 bg-muted/50 font-mono text-sm" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="rounded-none border-rose-500/20 shadow-none">
              <CardHeader className="pb-4 border-b border-rose-500/10 bg-rose-500/5">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold">Delete Account & Data</h4>
                    <p className="text-xs text-muted-foreground">Permanently remove all usage logs, API keys, and account data.</p>
                  </div>
                  <Button variant="destructive" className="rounded-none text-xs font-bold uppercase tracking-widest">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
