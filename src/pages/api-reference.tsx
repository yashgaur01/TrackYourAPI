import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"

export default function ApiReferencePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground relative overflow-x-hidden transition-colors duration-300">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,oklch(0_0_0/0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0_0_0/0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,oklch(1_0_0/0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tighter">TRACKYOURAPI</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild className="rounded-none px-6 text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground">
              <Link to="/docs">Read Full Docs</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-20 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">API Reference</h1>
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            Complete details on the TrackYourAPI REST API for advanced integrations.
          </p>
          <div className="bg-card/50 border border-border/50 rounded-xl p-8 text-center text-muted-foreground">
             API Reference is currently available exclusively to beta users. 
             If you require direct API access, please <a href="mailto:support@trackyourapi.com" className="text-primary hover:underline">contact support</a>.
          </div>
        </div>
      </main>

      <footer className="border-t border-border/20 py-8 bg-muted/10 text-center text-sm text-muted-foreground mt-auto">
        <p>© {new Date().getFullYear()} TrackYourAPI Inc. </p>
      </footer>
    </div>
  )
}
