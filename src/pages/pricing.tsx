import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { Check } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground relative overflow-x-hidden selection:bg-primary/30 transition-colors duration-300">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,oklch(0_0_0/0.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0_0_0/0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,oklch(1_0_0/0.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tighter">TRACKYOURAPI</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild variant="ghost" className="hidden sm:inline-flex text-sm font-medium">
              <Link to="/dashboard">Log in</Link>
            </Button>
            <Button asChild className="rounded-none px-6 text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-20 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">Simple, transparent pricing.</h1>
          <p className="text-xl text-muted-foreground">Start for free, then scale as you grow. No hidden fees.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="border border-border/50 bg-card/60 backdrop-blur-md rounded-2xl p-8 shadow-sm flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Hobby</h3>
            <p className="text-muted-foreground mb-6">Perfect for side projects and local testing.</p>
            <div className="mb-6">
              <span className="text-5xl font-black tracking-tighter">$0</span>
              <span className="text-muted-foreground"> / month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {['100k requests / month', '1 week log retention', 'Community support', 'Basic dashboards'].map(feature => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard">Start for free</Link>
            </Button>
          </div>

          {/* Pro Tier */}
          <div className="border-2 border-blue-500 bg-blue-50/50 dark:bg-[#141414] text-foreground rounded-2xl p-8 relative flex flex-col shadow-[0_0_40px_rgba(14,165,233,0.15)]">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full shadow-sm">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-muted-foreground mb-6">For production teams that need complete observability.</p>
            <div className="mb-6">
              <span className="text-5xl font-black tracking-tighter">$29</span>
              <span className="text-muted-foreground"> / month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Unlimited requests', '1 year log retention', 'Priority Slack support', 'Advanced custom dashboards', 'Alerts & Webhooks'].map(feature => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-blue-400" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold tracking-widest uppercase">
              <Link to="/dashboard">Upgrade to Pro</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/20 py-8 bg-muted/10 text-center text-sm text-muted-foreground mt-auto">
        <p>© {new Date().getFullYear()} TrackYourAPI Inc. All rights reserved.</p>
      </footer>
    </div>
  )
}
