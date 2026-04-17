import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { Link } from "react-router"

export default function PrivacyPage() {
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

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-20 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">Privacy Policy</h1>
        <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
          <p className="font-semibold text-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Introduction</h2>
          <p>
            At TrackYourAPI, we respect your privacy and are committed to protecting it through our compliance with this policy.
            This policy describes the types of information we may collect from you or that you may provide when you visit the website
            and our practices for collecting, using, maintaining, protecting, and disclosing that information.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Data We Collect</h2>
          <p>
            We collect data required to provide our service (analytics and observability of AI logs). This includes API keys, usage metrics, 
            and, based on your configuration settings, the request and response payloads you choose to send through our proxy infrastructure.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. How We Use Data</h2>
          <p>
            We use information to provide our services and ensure their proper functionality. We do NOT use your data or your users' prompts/completions 
            to train internal AI models, nor do we sell this data to third parties.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Security</h2>
          <p>
            We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure.
          </p>
        </div>
      </main>

      <footer className="border-t border-border/20 py-8 bg-muted/10 text-center text-sm text-muted-foreground mt-auto">
        <p>© {new Date().getFullYear()} TrackYourAPI Inc. </p>
      </footer>
    </div>
  )
}
