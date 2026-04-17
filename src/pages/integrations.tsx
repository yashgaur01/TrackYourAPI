import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { Terminal, Database } from "lucide-react"

export default function IntegrationsPage() {
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
              <Link to="/docs">View Docs</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-20 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">Supported Integrations</h1>
          <p className="text-xl text-muted-foreground">TrackYourAPI drops into your existing stack with zero friction.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {/* Models */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-8 hover:bg-card/80 transition-colors shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Terminal className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold tracking-tight">Models & SDKs</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> OpenAI / ChatGPT</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Anthropic Claude</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Google Gemini</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Groq, DeepSeek & more...</li>
            </ul>
          </div>

          {/* Platforms */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-8 hover:bg-card/80 transition-colors shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Database className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold tracking-tight">Destinations</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> TrackYourAPI Dashboard</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" /> Datadog (coming soon)</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" /> S3 Export (coming soon)</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" /> Webhooks</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/20 py-8 bg-muted/10 text-center text-sm text-muted-foreground mt-auto">
        <p>© {new Date().getFullYear()} TrackYourAPI Inc. </p>
      </footer>
    </div>
  )
}
