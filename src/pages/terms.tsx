import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { Link } from "react-router"

export default function TermsPage() {
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
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">Terms of Service</h1>
        <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
          <p className="font-semibold text-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using TrackYourAPI, you agree to be bound by these Terms. If you disagree with any part of the terms, then you do not have permission to access the Service.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Description of Service</h2>
          <p>
            TrackYourAPI provides an observability and analytics platform designed specifically for monitoring LLM and AI API usage. We reserve the right to withdraw or amend our Service, and any service or material we provide via the Service, in our sole discretion without notice.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Limitation of Liability</h2>
          <p>
            In no event shall TrackYourAPI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </div>
      </main>

      <footer className="border-t border-border/20 py-8 bg-muted/10 text-center text-sm text-muted-foreground mt-auto">
        <p>© {new Date().getFullYear()} TrackYourAPI Inc. </p>
      </footer>
    </div>
  )
}
