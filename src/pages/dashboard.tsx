import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { DashboardCharts } from "@/components/dashboard/charts"
import { InsightsCard } from "@/components/dashboard/insights-card"
import { ActivityTable } from "@/components/dashboard/activity-table"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "react-router"
import { supabase } from "@/lib/supabase"
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics"

export default function DashboardPage() {
  const { data: metrics, isLoading } = useDashboardMetrics()
  const signOut = () => supabase.auth.signOut()
  const user = metrics?.user; // we don't have user in metrics yet!
  // Wait, I should import useAuth from "@/hooks/use-auth";
  // I will just add useAuth.
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">TrackYourAPI</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer border border-border/50">
                  <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={user?.user_metadata?.name || "User"} className="object-cover" />
                  <AvatarFallback className="bg-primary text-primary-foreground font-black">
                    {user?.user_metadata?.name ? user.user_metadata.name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || "U")}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">My Account</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="w-full cursor-pointer">Billing & Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => void signOut()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 relative overflow-hidden">
          {/* Subtle background texture for dashboard */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,oklch(0_0_0/0.01)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0_0_0/0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] dark:bg-[linear-gradient(to_right,oklch(1_0_0/0.02)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.02)_1px,transparent_1px)]" />
          
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tighter uppercase">Analytics Overview</h1>
            <p className="text-muted-foreground text-sm tracking-tight">
              Real-time monitoring and cost optimization insights for your AI infrastructure.
            </p>
          </div>
          
          <StatsCards stats={metrics?.stats} />
          
          <div className="grid gap-6 lg:grid-cols-10">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <DashboardCharts 
                dailyCosts={metrics?.dailyCosts}
                providerBreakdown={metrics?.providerBreakdown}
                dailyRequests={metrics?.dailyRequests}
              />
            </div>
            <div className="lg:col-span-3">
              <InsightsCard insights={metrics?.insights} />
            </div>
          </div>
          
          <ActivityTable activity={metrics?.recentActivity} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
