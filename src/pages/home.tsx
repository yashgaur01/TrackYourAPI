import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { Link } from "react-router"
import { cn } from "@/lib/utils"
import {
  Terminal, Activity, Users, Database, Code,
  Zap,
  BarChart3,
  ArrowRight,
  ChevronRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Monitor,
  Settings2,
  HelpCircle
} from "lucide-react"
import { useState, useEffect } from "react"
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics"

const mockTraces = [
  {
    _id: "mock1",
    provider: "openai",
    model: "gpt-4o",
    tokens: 842,
    cost: 0.003,
    latency: 124,
    timestamp: Date.now() - 1000,
    status: "200 OK"
  },
  {
    _id: "mock2",
    provider: "anthropic",
    model: "claude-3-opus",
    tokens: 1240,
    cost: 0.045,
    latency: 0,
    timestamp: Date.now() - 5000,
    status: "429 ERR"
  },
  {
    _id: "mock3",
    provider: "google",
    model: "gemini-1.5-pro",
    tokens: 2100,
    cost: 0.012,
    latency: 845,
    timestamp: Date.now() - 12000,
    status: "200 OK"
  }
];

export function HomePage() {
  const [activeTab, setActiveTab] = useState<"ts" | "py">("ts")
  const [activeProvider, setActiveProvider] = useState<"openai" | "anthropic" | "gemini" | "deepseek" | "custom">("openai")
  
  // Real-time data hooks
  const { data } = useDashboardMetrics()
  const stats = data?.stats;
  const recentActivity = data?.recentActivity;

  const [liveTraces, setLiveTraces] = useState<any[]>(mockTraces)

  useEffect(() => {
    if (recentActivity && recentActivity.length > 0) {
      setLiveTraces(recentActivity)
    } else {
      setLiveTraces(mockTraces)
    }
  }, [recentActivity])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground relative overflow-x-hidden selection:bg-primary/30 transition-colors duration-300">
      {/* Background Texture - Adapts to light/dark */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,oklch(0_0_0/0.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0_0_0/0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,oklch(1_0_0/0.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Ambient Orbs - Less intrusive in light mode */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[600px] w-full max-w-[1200px] opacity-10 dark:opacity-30 blur-[120px] pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-blue-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute top-0 right-1/4 w-1/2 h-full bg-indigo-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="TrackYourAPI Logo" className="h-8 w-auto object-contain" />
            <span className="text-xl font-bold tracking-tighter">TRACKYOURAPI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#sdk" className="text-sm font-medium hover:text-primary transition-colors">Integrations</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
          </nav>
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

      <main className="flex-1">
        {/* 1. HERO SECTION (Floating Logos & Minimalist Hook) */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
              {/* Left Column: Text & CTA */}
              <div className="flex-1 text-center lg:text-left pt-10">
                <div className="inline-flex items-center rounded-full border border-primary/20 px-4 py-1.5 text-xs font-medium mb-8 bg-blue-50 dark:bg-primary/10 text-blue-600 dark:text-primary backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-blue-500 dark:bg-primary animate-pulse mr-2" />
                  TrackYourAPI is now available in Beta <ArrowRight className="ml-2 h-3 w-3" />
                </div>

                <h1 className="text-6xl md:text-8xl lg:text-[6.5rem] font-bold tracking-tighter mb-8 leading-[0.9] text-foreground dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-white dark:to-white/60">
                  Track Your <br className="hidden md:block" /> <span className="text-[#0EA5E9] dark:text-transparent">AI Spend.</span>
                </h1>

                <p className="max-w-2xl mx-auto lg:mx-0 text-xl text-muted-foreground mb-12 leading-relaxed font-light">
                  The ultimate API usage tracker for modern AI teams. Monitor costs, trace requests, and gain deep visibility into your LLM spending across every provider.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Button size="lg" asChild className="h-14 px-10 rounded-xl text-md font-bold bg-[#0EA5E9] text-white hover:bg-[#0284C7] transition-all shadow-[0_4px_14px_0_rgba(14,165,233,0.39)] hover:shadow-[0_6px_20px_rgba(14,165,233,0.23)] hover:-translate-y-1">
                    <Link to="/dashboard">
                      Try for free <ChevronRight className="ml-1 h-5 w-5" />
                    </Link>
                  </Button>
                  <div className="text-sm text-muted-foreground mt-2 sm:mt-0 sm:ml-4">
                    No credit card required.
                  </div>
                </div>
              </div>

              {/* Right Column: Floating Provider Logos */}
              <div className="flex-1 relative h-[250px] sm:h-[350px] lg:h-[600px] w-full mt-2 lg:mt-0 pointer-events-none perspective-[1000px] transform scale-[0.65] sm:scale-[0.8] lg:scale-100 origin-top">
                <div className="absolute inset-0">
                  {/* OpenAI / ChatGPT - Top Right */}
                  <div className="absolute top-[0%] right-[0%] lg:right-[5%] w-24 h-24 lg:w-28 lg:h-28 bg-card shadow-xl dark:bg-white/5 backdrop-blur-md border border-border/50 dark:border-white/10 rounded-3xl lg:rounded-[2rem] rotate-12 flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
                    <div className="bg-black dark:bg-[#1a1a1a] p-2.5 lg:p-3 rounded-full shadow-inner flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-8 h-8 lg:w-9 lg:h-9"
                      >
                        <path d="M11.217 19.384a3.501 3.501 0 0 0 6.783 -1.217v-5.167l-6 -3.35" />
                        <path d="M5.214 15.014a3.501 3.501 0 0 0 4.446 5.266l4.34 -2.534v-6.946" />
                        <path d="M6 7.63c-1.391 -.236 -2.787 .395 -3.534 1.689a3.474 3.474 0 0 0 1.271 4.745l4.263 2.514l6 -3.348" />
                        <path d="M12.783 4.616a3.501 3.501 0 0 0 -6.783 1.217v5.067l6 3.45" />
                        <path d="M18.786 8.986a3.501 3.501 0 0 0 -4.446 -5.266l-4.34 2.534v6.946" />
                        <path d="M18 16.302c1.391 .236 2.787 -.395 3.534 -1.689a3.474 3.474 0 0 0 -1.271 -4.745l-4.308 -2.514l-5.955 3.42" />
                      </svg>
                    </div>
                  </div>

                  {/* Google Gemini - Mid Left */}
                  <div className="absolute top-[30%] left-[0%] lg:left-[5%] w-20 h-20 lg:w-24 lg:h-24 bg-card shadow-lg dark:bg-white/5 backdrop-blur-md border border-border/50 dark:border-white/10 rounded-2xl lg:rounded-3xl -rotate-12 flex items-center justify-center animate-[float_7s_ease-in-out_infinite_1s]">
                    <svg viewBox="0 0 24 24" className="w-12 h-12 lg:w-14 lg:h-14">
                      <defs>
                        <linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1C69FF" />
                          <stop offset="50%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#EC4899" />
                        </linearGradient>
                      </defs>
                      <path fill="url(#geminiGrad)" d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81" />
                    </svg>
                  </div>

                  {/* DeepSeek - Top Center */}
                  <div className="absolute top-[10%] left-[30%] lg:left-[40%] bg-card shadow-lg dark:bg-white/5 backdrop-blur-md border border-border/50 dark:border-white/10 rounded-full px-5 py-2.5 pr-6 rotate-3 flex items-center justify-center animate-[float_5s_ease-in-out_infinite_1.2s] gap-3">
                    <svg viewBox="0 0 50 50" fill="#4D6BFE" className="w-8 h-8 lg:w-10 lg:h-10">
                      <path d="M48.8354 10.0479C48.3232 9.79199 48.1025 10.2798 47.8032 10.5278C47.7007 10.6079 47.6143 10.7119 47.5273 10.8076C46.7793 11.624 45.9048 12.1597 44.7622 12.0957C43.0923 12 41.666 12.5356 40.4058 13.8398C40.1377 12.2319 39.2476 11.272 37.8926 10.6558C37.1836 10.3359 36.4668 10.0156 35.9702 9.31982C35.6235 8.82373 35.5293 8.27197 35.356 7.72754C35.2456 7.3999 35.1353 7.06396 34.7651 7.00781C34.3633 6.94385 34.2056 7.2876 34.0479 7.57568C33.418 8.75195 33.1733 10.0479 33.1973 11.3599C33.2524 14.312 34.4736 16.6641 36.8999 18.3359C37.1758 18.5278 37.2466 18.7197 37.1597 19C36.9946 19.5757 36.7974 20.1357 36.624 20.7119C36.5137 21.0801 36.3486 21.1597 35.9624 21C34.6309 20.4321 33.481 19.5918 32.4644 18.5757C30.7393 16.8721 29.1792 14.9917 27.2334 13.52C26.7764 13.1758 26.3193 12.856 25.8467 12.5518C23.8618 10.584 26.1069 8.96777 26.627 8.77588C27.1704 8.57568 26.8159 7.8877 25.0591 7.896C23.3022 7.90381 21.6953 8.50391 19.647 9.30371C19.3477 9.42383 19.0322 9.51172 18.7095 9.58398C16.8501 9.22363 14.9199 9.14355 12.9033 9.37598C9.10596 9.80762 6.07275 11.6396 3.84326 14.7681C1.16455 18.5278 0.53418 22.7998 1.30664 27.2559C2.11768 31.9521 4.46582 35.8398 8.07373 38.8799C11.8159 42.0322 16.1255 43.5762 21.041 43.2803C24.0269 43.104 27.3516 42.6963 31.1016 39.4561C32.0469 39.936 33.0396 40.1279 34.686 40.272C35.9546 40.3921 37.1758 40.208 38.1211 40.0078C39.6021 39.688 39.4995 38.2881 38.9639 38.0322C34.623 35.9678 35.5762 36.8081 34.71 36.1279C36.9155 33.4639 40.2402 30.6958 41.54 21.728C41.6426 21.0161 41.5557 20.5679 41.54 19.9917C41.5322 19.6396 41.6108 19.5039 42.0049 19.4639C43.0923 19.3359 44.1479 19.0317 45.1167 18.4878C47.9292 16.9199 49.064 14.3438 49.3315 11.2559C49.3711 10.7837 49.3237 10.2959 48.8354 10.0479ZM24.3262 37.8398C20.1196 34.4639 18.0791 33.3521 17.2358 33.3999C16.4482 33.4482 16.5898 34.3682 16.7632 34.9678C16.9443 35.5601 17.1812 35.9683 17.5117 36.4878C17.7402 36.832 17.8979 37.3442 17.2832 37.728C15.9282 38.584 13.5728 37.4399 13.4624 37.3838C10.7207 35.7358 8.42822 33.5601 6.81348 30.584C5.25342 27.7197 4.34766 24.6479 4.19775 21.3677C4.1582 20.5757 4.38672 20.2959 5.15869 20.1519C6.17529 19.96 7.22314 19.9199 8.23926 20.0718C12.5327 20.7119 16.1885 22.6719 19.2529 25.7759C21.002 27.5439 22.3252 29.6558 23.6885 31.7202C25.1377 33.9121 26.6978 36 28.6831 37.7119C29.3843 38.312 29.9434 38.7681 30.479 39.104C28.8643 39.2881 26.1699 39.3281 24.3262 37.8398ZM26.3433 24.6001C26.3433 24.248 26.6191 23.9678 26.9658 23.9678C27.0444 23.9678 27.1152 23.9839 27.1782 24.0078C27.2651 24.04 27.3438 24.0879 27.4067 24.1602C27.5171 24.272 27.5801 24.4321 27.5801 24.6001C27.5801 24.9521 27.3042 25.2319 26.9575 25.2319C26.6108 25.2319 26.3433 24.9521 26.3433 24.6001ZM32.6064 27.8799C32.2046 28.0479 31.8027 28.1919 31.4165 28.208C30.8179 28.2397 30.1641 27.9922 29.8096 27.688C29.2583 27.2158 28.8643 26.9521 28.6987 26.1279C28.6279 25.7759 28.6675 25.2319 28.7305 24.9199C28.8721 24.248 28.7144 23.8159 28.2495 23.4238C27.8716 23.104 27.3911 23.0161 26.8633 23.0161C26.666 23.0161 26.4849 22.9277 26.3511 22.856C26.1304 22.7441 25.9492 22.4639 26.1226 22.1201C26.1777 22.0078 26.4458 21.7358 26.5088 21.688C27.2256 21.272 28.0527 21.4077 28.8169 21.7197C29.5259 22.0161 30.0615 22.5601 30.834 23.3281C31.6216 24.2559 31.7632 24.5117 32.2124 25.208C32.5669 25.752 32.8901 26.312 33.1104 26.9521C33.2446 27.3521 33.0713 27.6802 32.6064 27.8799Z" />
                    </svg>
                    <span className="font-sans font-bold text-xl lg:text-3xl tracking-tight text-[#4D6BFE] dark:text-[#6A85FF] lowercase">deepseek</span>
                  </div>

                  {/* Kimi 2.5 - Bottom Center Left */}
                  <div className="absolute bottom-[35%] left-[10%] lg:left-[20%] w-20 h-20 lg:w-24 lg:h-24 bg-[#0A0A0A] shadow-xl border border-white/10 rounded-3xl -rotate-6 flex items-center justify-center animate-[float_6.5s_ease-in-out_infinite_0.5s]">
                    <div className="relative">
                      <span className="font-sans font-bold text-4xl lg:text-5xl text-white leading-none">K</span>
                      <div className="absolute top-0 -right-2.5 w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#1AA1FB]" />
                    </div>
                  </div>

                  {/* Anthropic 'A' Logo - Bottom Left */}
                  <div className="absolute bottom-[5%] left-[10%] lg:left-[15%] w-24 h-24 lg:w-28 lg:h-28 bg-card shadow-xl dark:bg-white/5 backdrop-blur-md border border-border/50 dark:border-white/10 rounded-3xl -rotate-6 flex items-center justify-center animate-[float_6.5s_ease-in-out_infinite_1.5s]">
                    <div className="bg-[#1E1E1E] dark:bg-[#F2EDE7] p-3 rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-10 h-10 lg:w-12 lg:h-12 text-[#F2EDE7] dark:text-[#1E1E1E]" fill="currentColor">
                        <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
                      </svg>
                    </div>
                  </div>

                  {/* Docker Whale - Center */}
                  <div className="absolute top-[50%] left-[45%] lg:left-[40%] w-16 h-16 lg:w-20 lg:h-20 bg-card shadow-md dark:bg-white/5 backdrop-blur-md border border-border/50 dark:border-white/10 rounded-2xl lg:rounded-[1.5rem] rotate-12 flex items-center justify-center animate-[float_5.5s_ease-in-out_infinite_0.5s]">
                    <svg viewBox="0 0 24 24" className="w-10 h-10 lg:w-12 lg:h-12" fill="#2496ED">
                      <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z" />
                    </svg>
                  </div>

                  {/* Groq - Bottom Center-Right */}
                  <div className="absolute bottom-[20%] right-[30%] lg:right-[25%] w-28 h-16 lg:w-32 lg:h-20 bg-card shadow-lg dark:bg-white/5 backdrop-blur-md border border-border/50 dark:border-white/10 rounded-2xl -rotate-3 flex items-center justify-center animate-[float_6s_ease-in-out_infinite_2.5s]">
                    <span className="font-sans font-black text-2xl lg:text-[2rem] tracking-tighter text-[#F55036]">groq</span>
                  </div>

                  {/* Claude Icon - Bottom Right */}
                  <div className="absolute bottom-[0%] right-[0%] lg:right-[10%] w-20 h-20 lg:w-24 lg:h-24 bg-card shadow-lg dark:bg-white/5 backdrop-blur-md border border-border/50 dark:border-white/10 rounded-3xl -rotate-6 flex items-center justify-center animate-[float_7.5s_ease-in-out_infinite_3s]">
                    <div className="bg-[#D97757] w-14 h-14 lg:w-16 lg:h-16 rounded-[1rem] lg:rounded-[1.25rem] flex items-center justify-center shadow-inner overflow-hidden">
                      <svg viewBox="0 0 24 24" fill="white" className="w-10 h-10 lg:w-12 lg:h-12 scale-110">
                        <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
                      </svg>
                    </div>
                  </div>

                  {/* Cohere / Vector DB - Mid Right */}
                  <div className="absolute top-[40%] right-[-5%] lg:right-[-10%] w-20 h-20 lg:w-24 lg:h-24 bg-card shadow-lg dark:bg-white/5 backdrop-blur-md border border-border/50 dark:border-white/10 rounded-2xl lg:rounded-[1.5rem] rotate-6 flex items-center justify-center animate-[float_8s_ease-in-out_infinite_2s]">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="w-3 h-3 lg:w-4 lg:h-4 bg-[#3B82F6] rounded-full" />
                      <div className="w-3 h-3 lg:w-4 lg:h-4 bg-[#94A3B8] rounded-full" />
                      <div className="w-3 h-3 lg:w-4 lg:h-4 bg-[#94A3B8] rounded-full" />
                      <div className="w-3 h-3 lg:w-4 lg:h-4 bg-[#94A3B8] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 1.5 DASHBOARD PREVIEW SECTION (Mac-window style mock) */}
        <section className="relative -mt-10 lg:-mt-20 pb-24 z-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="relative mx-auto max-w-[1100px] rounded-xl border border-border/50 bg-background/60 backdrop-blur-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/10 dark:ring-white/5">

              {/* Window Controls (Fake Mac Header) */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b border-border/40">
                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                <div className="ml-4 text-xs font-semibold text-muted-foreground">app.trackyourapi.com</div>
              </div>

              {/* Dashboard Internal Layout */}
              <div className="flex h-[500px] lg:h-[650px] bg-card/40">

                {/* Sidebar (Mock) */}
                <div className="hidden md:flex flex-col w-56 border-r border-border/40 bg-muted/10 p-4">
                  <div className="flex items-center gap-2 mb-8 px-2">
                    <div className="w-5 h-5 rounded bg-[#0EA5E9] flex items-center justify-center">
                      <Terminal className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-bold text-sm">TrackYourAPI AI</span>
                  </div>

                  <div className="space-y-1 mb-6">
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Observe</div>
                    <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-primary/10 text-primary font-medium text-sm">
                      <Activity className="h-4 w-4" /> Dashboard
                    </div>
                    <div className="flex items-center gap-2 px-2 py-2 rounded-md text-muted-foreground hover:bg-muted text-sm transition-colors">
                      <Terminal className="h-4 w-4" /> Requests
                    </div>
                    <div className="flex items-center gap-2 px-2 py-2 rounded-md text-muted-foreground hover:bg-muted text-sm transition-colors">
                      <Users className="h-4 w-4" /> Users
                    </div>
                  </div>

                  <div className="space-y-1 mb-6">
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Improve</div>
                    <div className="flex items-center gap-2 px-2 py-2 rounded-md text-muted-foreground hover:bg-muted text-sm transition-colors">
                      <Database className="h-4 w-4" /> Datasets
                    </div>
                    <div className="flex items-center gap-2 px-2 py-2 rounded-md text-muted-foreground hover:bg-muted text-sm transition-colors">
                      <Code className="h-4 w-4" /> Prompts
                    </div>
                  </div>
                </div>

                {/* Dashboard Main Area */}
                <div className="flex-1 p-6 lg:p-8 overflow-y-auto overflow-x-hidden bg-background/20 relative">

                  {/* Decorative Background Glow inside Dashboard */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[#0EA5E9]/10 blur-[100px] rounded-full pointer-events-none" />

                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-semibold">Dashboard</h2>
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex items-center bg-muted/30 rounded-lg p-1 border border-border/50">
                        <div className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1.5 transition-colors"><Database className="h-3 w-3" /> Custom</div>
                        <div className="w-px h-3 bg-border mx-1" />
                        <div className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 rounded-md cursor-pointer transition-colors">24H</div>
                        <div className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 rounded-md cursor-pointer transition-colors">7D</div>
                        <div className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 rounded-md cursor-pointer transition-colors">1M</div>
                        <div className="px-3 py-1.5 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium rounded-md shadow-sm border border-blue-500/20">3M</div>
                      </div>

                      <div className="hidden lg:flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/50 rounded-lg bg-card/60 backdrop-blur-md hover:bg-muted/50 cursor-pointer transition-colors">
                          <Activity className="h-3.5 w-3.5 text-muted-foreground" /> Show Filters
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/50 rounded-lg bg-card/60 backdrop-blur-md hover:bg-muted/50 cursor-pointer transition-colors">
                          <Database className="h-3.5 w-3.5 text-muted-foreground" /> Saved Filters
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grid of Widgets */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 pb-2">

                    {/* Top Row: Requests | Errors | Top Models */}

                    {/* Widget: Requests */}
                    <div className="col-span-1 md:col-span-2 bg-card/60 backdrop-blur-md border border-border/50 rounded-xl p-5 shadow-sm flex flex-col relative overflow-hidden group hover:border-border/80 transition-colors h-48 lg:h-56">
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-sm font-medium text-muted-foreground">Requests</div>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" /> Success</div>
                          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" /> Error</div>
                        </div>
                      </div>
                      <div className="text-3xl font-bold tracking-tight mb-4">{stats?.totalRequests?.toLocaleString() ?? "0"}</div>
                      <div className="flex-1 mt-auto relative opacity-80 group-hover:opacity-100 transition-opacity">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                          <path d="M0,20 L5,18 L10,22 L15,10 L20,15 L25,5 L30,22 L35,12 L40,18 L45,8 L50,20 L55,5 L60,15 L65,22 L70,8 L75,18 L80,10 L85,25 L90,5 L95,15 L100,20" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinejoin="round" />
                          <path d="M30,22 L32,27 L36,25 M85,25 L88,29 L92,26 M15,10 L17,14 L20,12" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>

                    {/* Widget: Errors Donut */}
                    <div className="col-span-1 bg-card/60 backdrop-blur-md border border-border/50 rounded-xl p-5 shadow-sm flex flex-col relative items-center justify-center group hover:border-border/80 transition-colors h-48 lg:h-56">
                      <div className="absolute top-4 left-5 right-5 flex justify-between items-center text-sm font-medium text-muted-foreground">
                        <span>Errors</span>
                        <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest hidden sm:flex">
                          <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-[#0EA5E9]" /> 400</span>
                          <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-[#A855F7]" /> 500</span>
                        </div>
                      </div>
                      <div className="relative w-28 h-28 lg:w-32 lg:h-32 mt-6">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 drop-shadow-md">
                          <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="currentColor" strokeWidth="3" className="text-muted/20" />
                          <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#0EA5E9" strokeWidth="4" strokeDasharray="60 40" strokeLinecap="round" className="drop-shadow-[0_0_4px_rgba(14,165,233,0.5)]" />
                          <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#A855F7" strokeWidth="4" strokeDasharray="15 85" strokeDashoffset="-65" strokeLinecap="round" className="drop-shadow-[0_0_4px_rgba(168,85,247,0.5)]" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pt-1">
                          <span className="text-lg lg:text-xl font-bold">{stats?.totalRequests?.toLocaleString() ?? "0"}</span>
                          <span className="text-[0.60rem] lg:text-[0.65rem] text-muted-foreground font-medium uppercase">Total</span>
                        </div>
                      </div>
                    </div>

                    {/* Widget: Top Models */}
                    <div className="col-span-1 border border-border/50 bg-card/60 backdrop-blur-md rounded-xl p-4 lg:p-5 shadow-sm flex flex-col group hover:border-border/80 transition-colors h-48 lg:h-56">
                      <div className="flex justify-between items-center text-sm font-medium text-muted-foreground mb-4">
                        <span>Top Models</span>
                        <span className="text-[9px] uppercase font-semibold">Reqs</span>
                      </div>
                      <div className="space-y-2.5 flex-1 overflow-hidden">
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-300 font-medium border border-blue-500/20 truncate max-w-[100px] lg:max-w-[70px] xl:max-w-[100px]">gpt-4o</span>
                          <span className="font-semibold text-muted-foreground tabular-nums">1.4m</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-300 font-medium border border-purple-500/20 truncate max-w-[100px] lg:max-w-[70px] xl:max-w-[100px]">claude-3-op</span>
                          <span className="font-semibold text-muted-foreground tabular-nums">794k</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-2 py-0.5 rounded bg-green-500/15 text-green-600 dark:text-green-300 font-medium border border-green-500/20 truncate max-w-[100px] lg:max-w-[70px] xl:max-w-[100px]">gemini-pro</span>
                          <span className="font-semibold text-muted-foreground tabular-nums">297k</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-2 py-0.5 rounded bg-orange-500/15 text-orange-600 dark:text-orange-300 font-medium border border-orange-500/20 truncate max-w-[100px] lg:max-w-[70px] xl:max-w-[100px]">gpt-3.5-t</span>
                          <span className="font-semibold text-muted-foreground tabular-nums">132k</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Costs | Top Apps (Users) | Latency */}

                    {/* Widget: Costs */}
                    <div className="col-span-1 border border-border/50 bg-card/60 backdrop-blur-md rounded-xl p-5 shadow-sm flex flex-col group hover:border-border/80 transition-colors h-48 lg:h-56">
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-sm font-medium text-muted-foreground">Costs</div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" /> Costs
                        </div>
                      </div>
                        ${stats?.totalCost?.toFixed(2).split('.')[0] ?? "0"}<span className="text-sm text-muted-foreground font-normal">.{stats?.totalCost?.toFixed(2).split('.')[1] ?? "00"}</span>
                      <div className="flex-1 flex items-end justify-between gap-1 sm:gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity mt-auto">
                        {[20, 35, 25, 45, 60, 40, 75, 55, 65, 90, 80, 50, 60, 70, 40, 55].map((h, i) => (
                          <div key={i} className="bg-blue-500/80 hover:bg-blue-400 w-full rounded-t-sm transition-all duration-300" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>

                    {/* Widget: Top Countries */}
                    <div className="col-span-1 border border-border/50 bg-card/60 backdrop-blur-md rounded-xl p-4 lg:p-5 shadow-sm flex flex-col group hover:border-border/80 transition-colors h-48 lg:h-56">
                      <div className="flex justify-between items-center text-sm font-medium text-muted-foreground mb-4">
                        <span>Top Countries</span>
                        <span className="text-[9px] uppercase font-semibold">Reqs</span>
                      </div>
                      <div className="space-y-3.5 flex-1 overflow-hidden relative">
                        {/* Region 1 */}
                        <div className="relative z-10 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span>🇺🇸</span>
                            <span className="font-medium truncate max-w-[80px]">US</span>
                          </div>
                          <span className="text-muted-foreground tabular-nums">4.3k</span>
                          <div className="absolute inset-y-0 left-0 bg-blue-500/10 dark:bg-blue-500/20 border-l-2 border-blue-500 -z-10 rounded-r-md" style={{ width: '80%' }}></div>
                        </div>
                        {/* Region 2 */}
                        <div className="relative z-10 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span>🇮🇩</span>
                            <span className="font-medium truncate max-w-[80px]">ID</span>
                          </div>
                          <span className="text-muted-foreground tabular-nums">2.9k</span>
                          <div className="absolute inset-y-0 left-0 bg-blue-500/10 dark:bg-blue-500/20 border-l-2 border-blue-500 -z-10 rounded-r-md" style={{ width: '55%' }}></div>
                        </div>
                        {/* Region 3 */}
                        <div className="relative z-10 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span>🇮🇳</span>
                            <span className="font-medium truncate max-w-[80px]">IN</span>
                          </div>
                          <span className="text-muted-foreground tabular-nums">2.3k</span>
                          <div className="absolute inset-y-0 left-0 bg-blue-500/10 dark:bg-blue-500/20 border-l-2 border-blue-500 -z-10 rounded-r-md" style={{ width: '40%' }}></div>
                        </div>
                        {/* Region 4 */}
                        <div className="relative z-10 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span>🇬🇧</span>
                            <span className="font-medium truncate max-w-[80px]">GB</span>
                          </div>
                          <span className="text-muted-foreground tabular-nums">1.1k</span>
                          <div className="absolute inset-y-0 left-0 bg-blue-500/10 dark:bg-blue-500/20 border-l-2 border-blue-500 -z-10 rounded-r-md" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Widget: Latency */}
                    <div className="col-span-1 md:col-span-2 border border-border/50 bg-card/60 backdrop-blur-md rounded-xl p-5 shadow-sm flex flex-col relative overflow-hidden group hover:border-border/80 transition-colors h-48 lg:h-56">
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-sm font-medium text-muted-foreground">Latency</div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" /> Latency
                        </div>
                      </div>
                        {((stats?.avgLatency ?? 0) / 1000).toFixed(2)} <span className="text-sm text-muted-foreground font-medium">s / req</span>
                      <div className="flex-1 mt-auto relative opacity-80 group-hover:opacity-100 transition-opacity">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path d="M0,25 L10,20 L20,30 L30,15 L40,25 L50,10 L60,20 L70,25 L80,35 L90,15 L100,20 L100,40 L0,40 Z" fill="url(#latencyGrad)" />
                          <path d="M0,25 L10,20 L20,30 L30,15 L40,25 L50,10 L60,20 L70,25 L80,35 L90,15 L100,20" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinejoin="round" className="drop-shadow-[0_4px_4px_rgba(34,211,238,0.3)]" />
                        </svg>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ONE SDK SECTION */}
        <section id="sdk" className="py-24 border-t border-border/20 bg-muted/10">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">One SDK for <span className="text-blue-500">100+ Models</span></h2>
              <p className="text-lg text-muted-foreground">
                Access every AI model through native SDK wrappers. Switch providers without rewriting your core logic.
              </p>
            </div>

            <div className="max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-2xl overflow-hidden">
              {/* Code Editor Header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-[#111] px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("ts")}
                    className={cn("text-xs font-mono px-3 py-1.5 rounded transition-colors", activeTab === "ts" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white")}
                  >
                    TypeScript
                  </button>
                  <button
                    onClick={() => setActiveTab("py")}
                    className={cn("text-xs font-mono px-3 py-1.5 rounded transition-colors", activeTab === "py" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white")}
                  >
                    Python
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setActiveProvider("openai")} className={cn("text-[10px] uppercase tracking-widest px-2 py-1 border rounded-full transition-colors", activeProvider === "openai" ? "bg-white text-black border-white" : "border-white/20 text-muted-foreground hover:border-white/50")}>GPT-5</button>
                  <button onClick={() => setActiveProvider("anthropic")} className={cn("text-[10px] uppercase tracking-widest px-2 py-1 border rounded-full transition-colors", activeProvider === "anthropic" ? "bg-white text-black border-white" : "border-white/20 text-muted-foreground hover:border-white/50")}>Claude</button>
                  <button onClick={() => setActiveProvider("deepseek")} className={cn("text-[10px] uppercase tracking-widest px-2 py-1 border rounded-full transition-colors", activeProvider === "deepseek" ? "bg-white text-black border-white" : "border-white/20 text-muted-foreground hover:border-white/50")}>DeepSeek</button>
                  <button onClick={() => setActiveProvider("custom")} className={cn("text-[10px] uppercase tracking-widest px-2 py-1 border rounded-full transition-colors", activeProvider === "custom" ? "bg-white text-black border-white" : "border-white/20 text-muted-foreground hover:border-white/50")}>Kimi/GLM</button>
                </div>
              </div>

              {/* Install Command */}
              <div className="bg-[#151515] border-b border-white/10 px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 w-full">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">Install</span>
                    <code className="text-xs font-mono text-green-300/90 bg-black/50 px-3 py-1.5 rounded border border-white/5 text-left w-full max-w-sm cursor-text select-all">
                      {activeTab === "ts" ? "npm install @trackyourapi/sdk" : "pip install trackyourapi"}
                    </code>
                  </div>
                </div>
              </div>

              {/* Code Content */}
              <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto text-left">
                {activeTab === "ts" && activeProvider === "openai" && (
                  <pre className="text-gray-300">
                    <span className="text-pink-400">import</span> OpenAI <span className="text-pink-400">from</span> <span className="text-green-300">"openai"</span>;<br />
                    <span className="text-pink-400">import</span> {"{ wrapOpenAI }"} <span className="text-pink-400">from</span> <span className="text-green-300">"@trackyourapi/sdk"</span>;<br />
                    <br />
                    <span className="text-gray-500">{'// Only one line to track everything'}</span><br />
                    <span className="text-blue-400">const</span> client = wrapOpenAI(<span className="text-blue-400">new</span> OpenAI(), {"{"}<br />
                    {"  "}apiKey: process.env.<span className="text-orange-300">TRACKYOURAPI_API_KEY</span>,<br />
                    {"  "}endpoint: <span className="text-green-300">"https://trackyourapi.convex.site"</span>,<br />
                    {"}"});<br />
                    <br />
                    <span className="text-blue-400">const</span> response = <span className="text-pink-400">await</span> client.chat.completions.<span className="text-yellow-200">create</span>({"{"}<br />
                    {"  "}model: <span className="text-green-300">"gpt-4o"</span>, <span className="text-gray-500">{'// Switch models instantly'}</span><br />
                    {"  "}messages: [{"{"} role: <span className="text-green-300">"user"</span>, content: <span className="text-green-300">"Build reliable AI"</span> {"}"}]<br />
                    {"}"});
                  </pre>
                )}
                {activeTab === "ts" && activeProvider === "anthropic" && (
                  <pre className="text-gray-300">
                    <span className="text-pink-400">import</span> Anthropic <span className="text-pink-400">from</span> <span className="text-green-300">"@anthropic-ai/sdk"</span>;<br />
                    <span className="text-pink-400">import</span> {"{ wrapAnthropic }"} <span className="text-pink-400">from</span> <span className="text-green-300">"@trackyourapi/sdk"</span>;<br />
                    <br />
                    <span className="text-gray-500">{'// Zero context leaks, premium observability'}</span><br />
                    <span className="text-blue-400">const</span> client = wrapAnthropic(<span className="text-blue-400">new</span> Anthropic(), {"{"}<br />
                    {"  "}apiKey: process.env.<span className="text-orange-300">TRACKYOURAPI_API_KEY</span>,<br />
                    {"  "}endpoint: <span className="text-green-300">"https://trackyourapi.convex.site"</span>,<br />
                    {"}"});<br />
                    <br />
                    <span className="text-blue-400">const</span> response = <span className="text-pink-400">await</span> client.messages.<span className="text-yellow-200">create</span>({"{"}<br />
                    {"  "}model: <span className="text-green-300">"claude-3-opus-4.6"</span>,<br />
                    {"  "}max_tokens: <span className="text-purple-400">4096</span>,<br />
                    {"  "}messages: [{"{"} role: <span className="text-green-300">"user"</span>, content: <span className="text-green-300">"Build reliable AI"</span> {"}"}]<br />
                    {"}"});
                  </pre>
                )}
                {activeTab === "ts" && activeProvider === "deepseek" && (
                  <pre className="text-gray-300">
                    <span className="text-pink-400">import</span> OpenAI <span className="text-pink-400">from</span> <span className="text-green-300">"openai"</span>;<br />
                    <span className="text-pink-400">import</span> {"{ wrapOpenAI }"} <span className="text-pink-400">from</span> <span className="text-green-300">"@trackyourapi/sdk"</span>;<br />
                    <br />
                    <span className="text-gray-500">{'// DeepSeek V3/R1 integration is seamless'}</span><br />
                    <span className="text-blue-400">const</span> client = wrapOpenAI(<span className="text-blue-400">new</span> OpenAI({"{"}<br />
                    {"  "}baseURL: <span className="text-green-300">"https://api.deepseek.com"</span>,<br />
                    {"  "}apiKey: process.env.<span className="text-orange-300">DEEPSEEK_API_KEY</span><br />
                    {"}"}), {"{"}<br />
                    {"  "}apiKey: process.env.<span className="text-orange-300">TRACKYOURAPI_API_KEY</span>,<br />
                    {"  "}provider: <span className="text-green-300">"deepseek"</span><br />
                    {"}"});<br />
                    <br />
                    <span className="text-blue-400">const</span> response = <span className="text-pink-400">await</span> client.chat.completions.<span className="text-yellow-200">create</span>({"{"}<br />
                    {"  "}model: <span className="text-green-300">"deepseek-reasoner"</span>,<br />
                    {"  "}messages: [{"{"} role: <span className="text-green-300">"user"</span>, content: <span className="text-green-300">"Solve the Riemann Hypothesis"</span> {"}"}]<br />
                    {"}"});
                  </pre>
                )}
                {activeTab === "ts" && activeProvider === "custom" && (
                  <pre className="text-gray-300">
                    <span className="text-pink-400">import</span> OpenAI <span className="text-pink-400">from</span> <span className="text-green-300">"openai"</span>;<br />
                    <span className="text-pink-400">import</span> {"{ wrapOpenAI }"} <span className="text-pink-400">from</span> <span className="text-green-300">"@trackyourapi/sdk"</span>;<br />
                    <br />
                    <span className="text-gray-500">{'// Kimi, GLM, Perplexity — track any OpenAI-compatible API'}</span><br />
                    <span className="text-blue-400">const</span> client = wrapOpenAI(<span className="text-blue-400">new</span> OpenAI({"{"} baseURL: <span className="text-green-300">"..."</span> {"}"}), {"{"}<br />
                    {"  "}apiKey: process.env.<span className="text-orange-300">TRACKYOURAPI_API_KEY</span>,<br />
                    {"  "}provider: <span className="text-green-300">"kimi"</span><br />
                    {"}"});<br />
                    <br />
                    <span className="text-blue-400">const</span> response = <span className="text-pink-400">await</span> client.chat.completions.<span className="text-yellow-200">create</span>({"{"}<br />
                    {"  "}model: <span className="text-green-300">"moonshot-v1-8k"</span>,<br />
                    {"  "}messages: [{"{"} role: <span className="text-green-300">"user"</span>, content: <span className="text-green-300">"Focus on cost"</span> {"}"}]<br />
                    {"}"});
                  </pre>
                )}
                {activeTab === "py" && (
                  <pre className="text-gray-300">
                    <span className="text-pink-400">from</span> openai <span className="text-pink-400">import</span> OpenAI<br />
                    <span className="text-pink-400">from</span> trackyourapi <span className="text-pink-400">import</span> wrap_openai<br />
                    <br />
                    <span className="text-gray-500">{'# Native threading, zero additional latency'}</span><br />
                    client = wrap_openai(<br />
                    {"    "}OpenAI(),<br />
                    {"    "}api_key=os.environ.get(<span className="text-green-300">"TRACKYOURAPI_API_KEY"</span>),<br />
                    {"    "}endpoint=<span className="text-green-300">"https://trackyourapi.convex.site"</span><br />
                    )<br />
                    <br />
                    response = client.chat.completions.<span className="text-yellow-200">create</span>(<br />
                    {"    "}model=<span className="text-green-300">"gpt-4o"</span>,<br />
                    {"    "}messages=[{"{"}<span className="text-green-300">"role"</span>: <span className="text-green-300">"user"</span>, <span className="text-green-300">"content"</span>: <span className="text-green-300">"Build reliable AI"</span>{"}"}]<br />
                    )
                  </pre>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                View all supported models <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* 3. FEATURE: TRACING & LOGS */}
        <section id="features" className="py-24 relative overflow-hidden bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#0EA5E9] mb-4">01 Debugging</div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Trace and debug your agents with ease.</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Visualize your multi-step LLM interactions, log requests in real-time, and pinpoint the root cause of errors before they impact users.
                </p>
                <div className="space-y-4">
                  {['Sub-millisecond latency impact', 'Full Request/Response Body Storage', 'Advanced Cost Attribution'].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 dark:bg-[#0EA5E9]/10 text-[#0EA5E9]">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="mt-8 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold tracking-widest text-xs uppercase px-8 shadow-[0_4px_14px_0_rgba(14,165,233,0.39)] hover:shadow-[0_6px_20px_rgba(14,165,233,0.23)]">
                  Start Tracing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="relative h-[440px] w-full rounded-2xl border border-border/50 bg-card/60 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl p-4 md:p-6 overflow-hidden flex flex-col group mt-12 lg:mt-0">
                {/* Decorative Window Controls & Live Badge */}
                <div className="flex justify-between items-center border-b border-border/50 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <span className="ml-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Traces</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-500/10 text-green-500 px-2 py-1 rounded border border-green-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Connected</span>
                  </div>
                </div>

                {/* Traces List */}
                <div className="flex-1 space-y-3 relative overflow-hidden">

                  {liveTraces.slice(0, 4).map((trace, idx) => {
                    const isError = trace.status === "429 ERR" || trace.status?.includes("ERR");
                    const isOpenAI = trace.provider === "openai";
                    const isAnthropic = trace.provider === "anthropic";
                    const isGemini = trace.provider === "google" || trace.provider === "gemini";
                    
                    return (
                      <div key={trace._id} className={cn(
                        "relative rounded-xl p-4 border transition-all duration-300 cursor-pointer group/row overflow-hidden",
                        idx === 0 ? "bg-card/80 shadow-[0_4px_24px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] hover:-translate-y-0.5 z-10" : 
                        isError ? "bg-red-500/5 border-red-500/20 hover:bg-red-500/10 shadow-[0_4px_20px_rgba(239,68,68,0.1)] hover:shadow-[0_8px_24px_rgba(239,68,68,0.2)] hover:-translate-y-0.5 z-10" :
                        "hover:bg-card/60 border-transparent hover:border-border/50 hover:shadow-lg hover:-translate-y-0.5",
                        idx > 2 && "opacity-50 hover:opacity-100"
                      )}>
                        {/* Background Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/row:translate-x-full duration-1000 ease-in-out" />

                        {/* Status Marker */}
                        <div className={cn(
                          "absolute inset-y-0 left-0 w-1 rounded-l-xl transition-all duration-300",
                          isError ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" : 
                          idx === 0 ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]" : 
                          "bg-muted-foreground/30 group-hover/row:bg-green-500/50"
                        )} />
                        
                        <div className="flex items-center justify-between pl-3 pr-1 relative z-10">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "px-2.5 py-1.5 rounded-md text-[10px] font-bold border transition-colors",
                              isError ? "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 shadow-[inset_0_1px_4px_rgba(239,68,68,0.2)]" : 
                              idx === 0 ? "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30 shadow-[inset_0_1px_4px_rgba(34,197,94,0.2)]" :
                              "bg-muted text-muted-foreground border-border"
                            )}>
                              {trace.status || "200 OK"}
                            </div>
                            <div>
                              <div className={cn(
                                "text-[13px] sm:text-sm font-bold font-mono flex items-center gap-2",
                                isError ? "text-red-600 dark:text-red-400" : "text-foreground/90"
                              )}>
                                POST <span className="text-muted-foreground font-medium truncate max-w-[120px] sm:max-w-[160px] group-hover/row:text-foreground/70 transition-colors">/v1/chat/completions</span>
                              </div>
                              <div className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-2 mt-1.5 font-medium">
                                <span className="flex items-center gap-1.5 bg-background/50 px-1.5 py-0.5 rounded-sm border border-border/50 backdrop-blur-sm">
                                  <div className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    isOpenAI ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" : 
                                    isAnthropic ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" : 
                                    isGemini ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" : "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                                  )} /> 
                                  {trace.model}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span>{Math.floor((Date.now() - trace.timestamp) / 1000)}s ago</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-4 sm:gap-8 text-right">
                            <div className="flex flex-col items-end justify-center">
                              <span className={cn(
                                "text-[12px] sm:text-[14px] font-bold font-mono transition-colors",
                                trace.latency > 0 ? "text-cyan-600 dark:text-cyan-400 group-hover/row:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" : "text-muted-foreground"
                              )}>
                                {trace.latency > 0 ? `${trace.latency}ms` : "--"}
                              </span>
                              {idx === 0 && <span className="text-[8px] sm:text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-1 opacity-70">Latency</span>}
                            </div>
                            <div className="flex flex-col items-end w-14 sm:w-16 justify-center">
                              <span className={cn(
                                "text-[12px] sm:text-[14px] font-bold font-mono",
                                isError ? "text-red-500" : "text-foreground/80 group-hover/row:text-foreground transition-colors"
                              )}>
                                {trace.cost > 0 ? `$${trace.cost.toFixed(4)}` : "--"}
                              </span>
                              {idx === 0 && <span className="text-[8px] sm:text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-1 opacity-70">Cost</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}


                </div>

                {/* Bottom Fade Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-card to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* 4. FEATURE: ANALYTICS DASHBOARD */}
        <section className="py-24 bg-muted/30 border-y border-border/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#0EA5E9] mb-4">02 Analytics</div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Understand your LLM spend.</h2>
              <p className="text-lg text-muted-foreground">
                Get a single pane of glass for all your AI infrastructure costs. Track by provider, user, or custom business logic.
              </p>
            </div>

            <div className="relative mx-auto max-w-5xl rounded-2xl border border-border/50 bg-[#141414] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden font-sans flex flex-col mt-8 lg:mt-0">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 dark:border-white/5 bg-[#141414]">
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-widest text-white uppercase">
                  <span className="opacity-60">USERS:</span>
                  <span className="text-white">LAST 7 DAYS</span>
                  <span className="opacity-60">USING MEDIAN</span>
                  <ChevronDown className="h-3 w-3 opacity-60 ml-1" />
                </div>
                <div className="flex items-center gap-4 text-white/50">
                  <Monitor className="h-4 w-4 hover:text-white transition-colors cursor-pointer" />
                  <Settings2 className="h-4 w-4 hover:text-white transition-colors cursor-pointer" />
                  <HelpCircle className="h-4 w-4 hover:text-white transition-colors cursor-pointer" />
                </div>
              </div>

              {/* Main Grid Layout */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-white/10">

                {/* Box 1: Left Top (Bar + Smoothing Line) */}
                <div className="bg-[#141414] p-6 relative group cursor-crosshair h-[240px]">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-[10px] uppercase font-bold text-white/50 tracking-widest">Load Time vs Bounce Rate</div>
                    <div className="text-[10px] uppercase font-bold text-white/50 tracking-widest flex items-center gap-1 cursor-pointer hover:text-white"><Settings2 className="w-3 h-3" /> Options</div>
                  </div>
                  <div className="absolute inset-x-6 bottom-6 top-16 flex items-end justify-between gap-[2px]">
                    {[120, 140, 90, 110, 80, 50, 45, 60, 40, 35, 30, 20, 10, 8, 12, 5, 4, 2, 2, 1, 0, 0, 0, 0].map((h, i) => (
                      <div key={i} className="flex-1 bg-blue-500/20 hover:bg-blue-400/50 border-t border-blue-400/50 rounded-t-sm transition-all" style={{ height: `${h}px` }} />
                    ))}
                  </div>
                  {/* Data points and Line */}
                  <div className="absolute inset-x-6 bottom-6 top-16 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                      <path d="M0,80 Q10,70 20,40 T40,60 T60,50 T80,45 T100,5" fill="none" stroke="url(#lineGrad)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                      <circle cx="20" cy="40" r="3" fill="#8b5cf6" className="drop-shadow-[0_0_12px_rgba(139,92,246,1)]" />
                    </svg>
                  </div>
                  {/* Tooltip mockup */}
                  <div className="absolute left-[20%] top-[25%] bg-white text-black p-3 rounded-lg shadow-xl z-10 w-32 animate-pulse before:absolute before:-bottom-2 before:left-4 before:w-4 before:h-4 before:bg-white before:rotate-45 border-t-4 border-[#8b5cf6]">
                    <div className="text-black/60 mb-1 text-[8px] uppercase tracking-widest font-bold">Bounce Rate</div>
                    <div className="text-xl font-bold tracking-tight text-[#8b5cf6]">57.1%</div>
                  </div>
                </div>

                {/* Box 2: Right Top (Density Bar Chart) */}
                <div className="bg-[#141414] p-6 relative h-[240px]">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-[10px] uppercase font-bold text-white/50 tracking-widest">Start Render vs Bounce Rate</div>
                    <div className="text-[10px] uppercase font-bold text-white/50 tracking-widest flex items-center gap-1 cursor-pointer hover:text-white"><Settings2 className="w-3 h-3" /> Options</div>
                  </div>
                  <div className="absolute inset-x-6 bottom-6 top-16 flex items-end justify-between gap-[1px]">
                    {[15, 20, 35, 45, 60, 80, 110, 140, 120, 90, 70, 50, 45, 40, 30, 25, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 2, 1, 1, 0, 0, 0].map((h, i) => (
                      <div key={i} className="flex-1 bg-emerald-500/20 hover:bg-emerald-400/60 border-t border-emerald-400/40 rounded-t-sm transition-all" style={{ height: `${h}px` }} />
                    ))}
                  </div>
                </div>

                {/* Box 3: Bottom Full width block split to 4 metrics */}
                <div className="bg-[#141414] col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 content-start h-auto md:h-[160px]">

                  {/* Stat 1 */}
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-[9px] uppercase font-bold text-white/50 tracking-widest">Page Load (LUX)</div>
                      <div className="text-[9px] uppercase font-bold text-white/50 tracking-widest">Page Views (LUX)</div>
                    </div>
                    <div className="flex justify-between items-end mb-4">
                      <div className="text-3xl font-bold text-white tracking-tighter">0.7s</div>
                      <div className="text-2xl font-bold text-white/80 tracking-tighter">2.7Mpvs</div>
                    </div>
                    <div className="h-12 w-full mt-2">
                      <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="fillGrad1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(249,115,22,0.3)" />
                            <stop offset="100%" stopColor="rgba(249,115,22,0)" />
                          </linearGradient>
                        </defs>
                        <path d="M0,45 Q20,40 40,25 T80,10 T100,5" fill="none" stroke="rgba(249,115,22,0.4)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                        <path d="M0,5 Q20,15 40,20 T80,40 T100,45 L100,50 L0,50 Z" fill="url(#fillGrad1)" />
                        <path d="M0,5 Q20,15 40,20 T80,40 T100,45" fill="none" stroke="#f97316" strokeWidth="2" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_6px_rgba(249,115,22,0.8)]" />
                      </svg>
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="relative border-l border-white/10 pl-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-[9px] uppercase font-bold text-white/50 tracking-widest">Bounce Rate (LUX)</div>
                      <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest"><Settings2 className="w-3 h-3" /></div>
                    </div>
                    <div className="text-3xl font-bold text-white tracking-tighter mb-4">40.6%</div>
                    <div className="h-12 w-full mt-2 relative">
                      <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                        <path d="M0,25 Q20,20 40,30 T80,25 T100,35" fill="none" stroke="#ec4899" strokeWidth="2" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_6px_rgba(236,72,153,0.8)]" />
                      </svg>
                      <div className="absolute right-0 top-1/2 w-2 h-2 rounded-full bg-[#ec4899] shadow-[0_0_8px_#ec4899]" />
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="relative border-l border-white/10 pl-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-[9px] uppercase font-bold text-white/50 tracking-widest">Sessions</div>
                    </div>
                    <div className="text-3xl font-bold text-white tracking-tighter mb-4">479K</div>
                    <div className="h-12 w-full mt-2 relative overflow-hidden flex items-end justify-between gap-1">
                      {[10, 15, 8, 20, 25, 12, 30, 40, 25, 20].map((h, i) => (
                        <div key={i} className="flex-1 bg-cyan-500/30 hover:bg-cyan-400 rounded-sm transition-colors" style={{ height: `${h}px`, boxShadow: i === 7 ? '0 0 12px rgba(6,182,212,0.8)' : 'none', background: i === 7 ? '#22d3ee' : '' }} />
                      ))}
                    </div>
                  </div>

                  {/* Stat 4 */}
                  <div className="relative border-l border-white/10 pl-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-[9px] uppercase font-bold text-white/50 tracking-widest">Session Length (LUX)</div>
                      <div className="text-[9px] uppercase font-bold text-white/50 tracking-widest text-right">PVs Per Session</div>
                    </div>
                    <div className="flex justify-between items-end mb-4">
                      <div className="text-3xl font-bold text-white tracking-tighter">17min</div>
                      <div className="text-2xl font-bold text-white/80 tracking-tighter">2pvs</div>
                    </div>
                    <div className="h-12 w-full mt-2 relative">
                      <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                        <path d="M0,45 Q20,35 40,40 T60,20 T80,10 T100,5" fill="none" stroke="#a855f7" strokeWidth="2" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                      </svg>
                    </div>
                  </div>

                </div>
              </div>

              {/* Center Modal Overlay matching the screenshot */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="bg-white text-black p-10 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] space-y-4 text-center pointer-events-auto transform transition-transform hover:scale-105 duration-300 min-w-[320px]">
                  <BarChart3 className="h-12 w-12 text-[#0EA5E9] mx-auto mb-6 opacity-90" strokeWidth={1.5} />
                  <div className="text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                    ${stats?.costThisMonth?.toFixed(2) ?? "0.00"}
                  </div>
                  <div className="text-[10px] uppercase font-black tracking-[0.2em] text-black/50 mt-2">Total Spend This Month</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. BOTTOM CTA */}
        <section className="py-32 relative overflow-hidden bg-background">
          {/* Animated Background Grid & Orbs */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-[80%] -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-violet-500/10 dark:bg-violet-600/10 rounded-full blur-[100px] -z-10 pointer-events-none translate-x-[20%] -translate-y-1/2" />

          {/* Floating Accents */}
          <div className="absolute top-32 left-[2%] 2xl:left-[10%] hidden xl:flex items-center gap-3 animate-pulse z-0">
            <div className="bg-background/80 backdrop-blur border border-border/50 shadow-[0_0_30px_rgba(34,197,94,0.1)] rounded-xl p-3 text-xs font-mono font-medium flex items-center gap-3 text-muted-foreground w-64">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-ping" />
              <div className="flex flex-col">
                <span className="text-foreground tracking-tight font-bold">200 OK — POST /v1/chat</span>
                <span className="text-[10px] text-green-500/80">Captured successfully</span>
              </div>
            </div>
          </div>

          <div className="absolute top-28 right-[2%] 2xl:right-[12%] hidden xl:flex items-center gap-3 animate-bounce z-0" style={{ animationDuration: '6s' }}>
            <div className="bg-background/80 backdrop-blur border border-border/50 shadow-[0_0_30px_rgba(239,68,68,0.15)] rounded-xl p-3 text-xs font-mono font-medium flex items-center gap-3 text-muted-foreground w-64">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="text-foreground tracking-tight font-bold">429 ERR — Rate Limit</span>
                <span className="text-[10px] text-red-500/80">Spike detected at 10:41am</span>
              </div>
            </div>
          </div>

          <div className="absolute top-72 left-[8%] 2xl:left-[18%] hidden xl:flex items-center gap-3 animate-bounce z-0" style={{ animationDuration: '5s' }}>
            <div className="bg-background/80 backdrop-blur border border-border/50 shadow-[0_0_30px_rgba(249,115,22,0.1)] rounded-xl p-3 text-xs font-mono font-medium flex items-center gap-3 text-muted-foreground w-64">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
              <div className="flex flex-col text-left">
                <span className="text-foreground tracking-tight font-bold">Model Fallback</span>
                <span className="text-[10px] text-orange-500/80">Routed to gemini-1.5-flash</span>
              </div>
            </div>
          </div>

          <div className="absolute top-64 right-[10%] 2xl:right-[20%] hidden xl:flex animate-pulse z-0">
            <div className="bg-background/80 backdrop-blur border border-border/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-xl p-4 text-[11px] font-mono flex items-center gap-4">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Activity className="h-5 w-5 text-cyan-500" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-cyan-500 font-bold text-lg leading-none">142ms</span>
                <span className="text-muted-foreground uppercase tracking-widest text-[9px] mt-1">P99 Latency</span>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-8 border border-blue-500/20 shadow-sm">
              <Zap className="h-3 w-3" />
              Start Building
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 text-foreground dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-blue-100 dark:to-white/60">
              Ready to scale?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of developers building production-ready AI agents with complete observability and exact cost attribution.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="h-14 px-10 rounded-2xl text-[15px] font-bold bg-[#0EA5E9] text-white hover:bg-[#0284C7] transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:-translate-y-1">
                <Link to="/dashboard">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl text-[15px] font-bold bg-background border-border hover:bg-muted/50 transition-all hover:-translate-y-1">
                View Documentation
              </Button>
            </div>

            {/* Trusted By Row */}
            <div className="mt-20 pt-10 border-t border-border/40">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-8">Trusted by incredible engineering teams</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default">
                {/* Simulated Logos using text for native rendering */}
                <div className="text-2xl font-bold font-serif tracking-tighter flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-foreground flex items-center justify-center text-background text-sm">A</div> Acme
                </div>
                <div className="text-2xl font-black italic tracking-[0.3em]">GLOBAL</div>
                <div className="text-2xl font-medium tracking-[0.2em] flex items-center gap-2"><Zap className="w-6 h-6" /> STRIPE</div>
                <div className="text-2xl font-bold rounded-lg border-2 border-foreground px-3 py-1 uppercase tracking-widest">Nexus</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/20 py-16 bg-muted/10 text-sm text-muted-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-foreground">
                <Zap className="h-5 w-5" />
                <span className="font-bold tracking-tighter text-lg">TRACKYOURAPI</span>
              </div>
              <p className="max-w-xs">The absolute source of truth for your AI stack.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Product</h4>
                <div className="flex flex-col gap-2">
                  <a href="#" className="hover:text-foreground transition-colors">Features</a>
                  <a href="#" className="hover:text-foreground transition-colors">Integrations</a>
                  <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Resources</h4>
                <div className="flex flex-col gap-2">
                  <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
                  <a href="#" className="hover:text-foreground transition-colors">API Reference</a>
                  <a href="#" className="hover:text-foreground transition-colors">Blog</a>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Legal</h4>
                <div className="flex flex-col gap-2">
                  <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} TrackYourAPI Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
              <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
              <a href="#" className="hover:text-foreground transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
