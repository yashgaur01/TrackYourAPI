import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"

export default function BlogPage() {
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
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-20 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">Engineering Blog</h1>
        <div className="grid gap-8">
          {/* Post Placeholder 1 */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-6 md:p-8 hover:bg-card/80 transition-colors shadow-sm">
            <p className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Engineering</p>
            <h2 className="text-2xl font-bold mb-3 tracking-tight">How we built a sub-millisecond AI tracking proxy</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Performance is a feature. Learn how we utilized edge computing and WebSockets to build a robust, globally distributed tracing infrastructure that never delays your AI calls.
            </p>
            <Button variant="ghost" className="px-0 hover:bg-transparent hover:text-primary transition-colors text-sm font-semibold">
              Read Article &rarr;
            </Button>
          </div>

          {/* Post Placeholder 2 */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-6 md:p-8 hover:bg-card/80 transition-colors shadow-sm">
            <p className="text-sm font-bold tracking-widest text-blue-500 uppercase mb-3">Product Updates</p>
            <h2 className="text-2xl font-bold mb-3 tracking-tight">Introducing Advanced Cost Attribution</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Tag your users, organizations, or internal systems to get hyper-granular breakdowns of where every penny of your LLM budget is going.
            </p>
            <Button variant="ghost" className="px-0 hover:bg-transparent hover:text-primary transition-colors text-sm font-semibold">
              Read Article &rarr;
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/20 py-8 bg-muted/10 text-center text-sm text-muted-foreground mt-auto">
        <p>© {new Date().getFullYear()} TrackYourAPI Inc. </p>
      </footer>
    </div>
  )
}
