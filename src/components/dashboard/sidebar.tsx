import {
  LayoutDashboard,
  FileText,
  Bell,
  Key,
  Settings,
  Zap,
  LogOut,
  BookOpen,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Link } from "react-router"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Usage Logs",
    url: "/usage-logs",
    icon: FileText,
  },
  {
    title: "Alerts",
    url: "/alerts",
    icon: Bell,
  },
  {
    title: "API Keys",
    url: "/api-keys",
    icon: Key,
  },
  {
    title: "Docs",
    url: "/docs",
    icon: BookOpen,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const { user } = useAuth()

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="px-6 py-10">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-6 w-6 items-center justify-center rounded-none bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tighter uppercase">TrackYourAPI</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.2em] px-4 mb-4 text-muted-foreground/50">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                    className="rounded-none px-4 py-6 hover:bg-muted/50 transition-colors data-[active=true]:bg-indigo-500/10 data-[active=true]:text-indigo-600 dark:data-[active=true]:bg-indigo-500/20 dark:data-[active=true]:text-indigo-400"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 transition-colors" />
                      <span className="text-[11px] font-bold uppercase tracking-widest">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className="opacity-50" />
      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-4">
          {user && (
            <div className="flex items-center gap-3 px-2 py-1">
              <Avatar className="h-8 w-8 rounded-lg bg-primary text-primary-foreground font-black">
                <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={user?.user_metadata?.name || user?.email || "User"} className="object-cover" />
                <AvatarFallback className="rounded-lg">
                  {user?.user_metadata?.name ? user.user_metadata.name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || "U")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                  {user.email || user.user_metadata?.email}
                </span>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 rounded-none px-2 py-5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all group"
            onClick={() => supabase.auth.signOut()}
          >
            <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Sign Out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
