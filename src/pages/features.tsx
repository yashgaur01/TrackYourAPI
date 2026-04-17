import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { Activity, Shield, Zap } from "lucide-react"

export default function FeaturesPage() {
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
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-20 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">Powerful Features for AI Teams</h1>
          <p className="text-xl text-muted-foreground">Everything you need to monitor, debug, and optimize your LLM applications.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-8 hover:bg-card/80 transition-colors shadow-sm text-center">
            <div className="mx-auto w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-6">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Real-time Tracing</h3>
            <p className="text-muted-foreground">
              Monitor latency, TTFB, and token usage with sub-millisecond precision. Find bottlenecks instantly.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-8 hover:bg-card/80 transition-colors shadow-sm text-center">
            <div className="mx-auto w-12 h-12 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center mb-6">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Cost Attribution</h3>
            <p className="text-muted-foreground">
              Break down LLM spending by model, user, prompt version, or custom tags automatically.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-8 hover:bg-card/80 transition-colors shadow-sm text-center">
            <div className="mx-auto w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Privacy First</h3>
            <p className="text-muted-foreground">
              Your users' data never leaves your infrastructure if you use our edge deployment options. 
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/20 py-8 bg-muted/10 text-center text-sm text-muted-foreground mt-auto">
        <p>© {new Date().getFullYear()} TrackYourAPI Inc. </p>
      </footer>
    </div>
  )
}
