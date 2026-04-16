import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Terminal, Code2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useApiKeys } from "@/hooks/use-api-keys"

export default function DocsPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const { apiKeys } = useApiKeys()
  
  const firstActiveKey = apiKeys?.find(k => k.isActive)?.key || "qtn_your_api_key_here"
  const endpoint = import.meta.env.VITE_SUPABASE_URL ?? 'https://your-supabase-url.supabase.co'

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(id)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const jsCodeOpenAI = `import OpenAI from 'openai'
import { wrapOpenAI } from '@trackyourapi/sdk'

const openai = wrapOpenAI(new OpenAI(), {
  apiKey: '${firstActiveKey}',
  endpoint: '${endpoint}'
})

// ✅ All calls are now auto-tracked
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello!' }],
})`

  const jsCodeAnthropic = `import Anthropic from '@anthropic-ai/sdk'
import { wrapAnthropic } from '@trackyourapi/sdk'

const anthropic = wrapAnthropic(new Anthropic(), {
  apiKey: '${firstActiveKey}',
  endpoint: '${endpoint}'
})

const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello!' }],
})`

  const jsCodeGemini = `import { GoogleGenerativeAI } from '@google/generative-ai'
import { wrapGemini } from '@trackyourapi/sdk'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = wrapGemini(
  genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }),
  { 
    apiKey: '${firstActiveKey}', 
    endpoint: '${endpoint}' 
  }
)

const result = await model.generateContent('Explain quantum computing')`

  const pyCodeOpenAI = `from openai import OpenAI
from trackyourapi import wrap_openai

client = wrap_openai(
    OpenAI(), 
    api_key="${firstActiveKey}", 
    endpoint="${endpoint}"
)

# ✅ All calls are now auto-tracked
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}],
)`

  const pyCodeAnthropic = `from anthropic import Anthropic
from trackyourapi import wrap_anthropic

client = wrap_anthropic(
    Anthropic(), 
    api_key="${firstActiveKey}", 
    endpoint="${endpoint}"
)

message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}],
)`

  const proxyCodeClaude = `export ANTHROPIC_BASE_URL="${endpoint}/functions/v1/proxy/${firstActiveKey}/anthropic"

# Now run claude code
claude "Refactor my app"`

  const proxyCodeOpenAI = `export OPENAI_BASE_URL="${endpoint}/functions/v1/proxy/${firstActiveKey}/openai/v1"

# Now use Cursor, Aider, or any OpenAI-compatible CLI`

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xs font-bold uppercase tracking-[0.2em]">Documentation</h1>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-6 p-6 relative max-w-5xl mx-auto w-full">
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,oklch(0_0_0/0.01)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0_0_0/0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] dark:bg-[linear-gradient(to_right,oklch(1_0_0/0.02)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.02)_1px,transparent_1px)]" />

          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tighter uppercase">Quick Start</h1>
            <p className="text-muted-foreground text-sm tracking-tight">
              Track every OpenAI, Anthropic, and Gemini call automatically with just 3 lines of code.
            </p>
          </div>

          <div className="grid gap-6">
            <Card className="rounded-none border-border/50 shadow-none">
              <CardHeader className="pb-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">1. Install the SDK</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="ts" className="w-full">
                  <TabsList className="rounded-none grid w-full max-w-[400px] grid-cols-2 mb-4">
                    <TabsTrigger value="ts" className="rounded-none text-xs font-bold uppercase tracking-widest">TypeScript / Node</TabsTrigger>
                    <TabsTrigger value="py" className="rounded-none text-xs font-bold uppercase tracking-widest">Python</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ts">
                    <div className="relative group">
                      <pre className="bg-muted p-4 rounded-none text-xs font-mono border border-border/50">npm install @trackyourapi/sdk</pre>
                      <Button
                        variant="ghost" size="icon"
                        className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard("npm install @trackyourapi/sdk", "install-ts")}
                      >
                        {copiedKey === "install-ts" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="py">
                    <div className="relative group">
                      <pre className="bg-muted p-4 rounded-none text-xs font-mono border border-border/50">pip install trackyourapi</pre>
                      <Button
                        variant="ghost" size="icon"
                        className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard("pip install trackyourapi", "install-py")}
                      >
                        {copiedKey === "install-py" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="rounded-none border-border/50 shadow-none">
              <CardHeader className="pb-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">2. Initialize & Track</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Wrap your existing AI client. All requests will be transparently intercepted, timed, and logged.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="openai" className="w-full">
                  <TabsList className="rounded-none grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="openai" className="rounded-none text-xs font-bold uppercase tracking-widest">OpenAI</TabsTrigger>
                    <TabsTrigger value="anthropic" className="rounded-none text-xs font-bold uppercase tracking-widest">Anthropic</TabsTrigger>
                    <TabsTrigger value="gemini" className="rounded-none text-xs font-bold uppercase tracking-widest">Google Gemini</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="openai" className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">TypeScript / Node.js</h3>
                      <div className="relative group">
                        <pre className="bg-muted p-4 rounded-none text-xs font-mono overflow-x-auto border border-border/50 whitespace-pre-wrap">{jsCodeOpenAI}</pre>
                        <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/80" onClick={() => copyToClipboard(jsCodeOpenAI, "code-ts-openai")}>
                          {copiedKey === "code-ts-openai" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Python</h3>
                      <div className="relative group">
                        <pre className="bg-muted p-4 rounded-none text-xs font-mono overflow-x-auto border border-border/50 whitespace-pre-wrap">{pyCodeOpenAI}</pre>
                        <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/80" onClick={() => copyToClipboard(pyCodeOpenAI, "code-py-openai")}>
                          {copiedKey === "code-py-openai" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="anthropic" className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">TypeScript / Node.js</h3>
                      <div className="relative group">
                        <pre className="bg-muted p-4 rounded-none text-xs font-mono overflow-x-auto border border-border/50 whitespace-pre-wrap">{jsCodeAnthropic}</pre>
                        <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/80" onClick={() => copyToClipboard(jsCodeAnthropic, "code-ts-anth")}>
                          {copiedKey === "code-ts-anth" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Python</h3>
                      <div className="relative group">
                        <pre className="bg-muted p-4 rounded-none text-xs font-mono overflow-x-auto border border-border/50 whitespace-pre-wrap">{pyCodeAnthropic}</pre>
                        <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/80" onClick={() => copyToClipboard(pyCodeAnthropic, "code-py-anth")}>
                          {copiedKey === "code-py-anth" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="gemini" className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">TypeScript / Node.js</h3>
                      <div className="relative group">
                        <pre className="bg-muted p-4 rounded-none text-xs font-mono overflow-x-auto border border-border/50 whitespace-pre-wrap">{jsCodeGemini}</pre>
                        <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/80" onClick={() => copyToClipboard(jsCodeGemini, "code-ts-gemini")}>
                          {copiedKey === "code-ts-gemini" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs">
                      <strong>Note:</strong> Python support for Google Generative AI wrapper is coming soon.
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            <Card className="rounded-none border-border/50 shadow-none">
              <CardHeader className="pb-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">3. Universal Proxy (No-Code Integration)</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Want to track usage in Cursor, Aider, or Claude Code? Just set an environment variable to route traffic through our proxy. No code changes required!
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="claude" className="w-full">
                  <TabsList className="rounded-none grid w-full max-w-[400px] grid-cols-2 mb-6">
                    <TabsTrigger value="claude" className="rounded-none text-xs font-bold uppercase tracking-widest">Claude Code</TabsTrigger>
                    <TabsTrigger value="openai" className="rounded-none text-xs font-bold uppercase tracking-widest">Cursor / Aider</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="claude" className="space-y-6">
                    <div className="space-y-2">
                       <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mac / Linux Terminal</h3>
                       <div className="relative group">
                         <pre className="bg-muted p-4 rounded-none text-xs font-mono overflow-x-auto border border-border/50 whitespace-pre-wrap">{proxyCodeClaude}</pre>
                         <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/80" onClick={() => copyToClipboard(proxyCodeClaude, "proxy-claude")}>
                           {copiedKey === "proxy-claude" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                         </Button>
                       </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="openai" className="space-y-6">
                    <div className="space-y-2">
                       <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mac / Linux Terminal</h3>
                       <div className="relative group">
                         <pre className="bg-muted p-4 rounded-none text-xs font-mono overflow-x-auto border border-border/50 whitespace-pre-wrap">{proxyCodeOpenAI}</pre>
                         <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/80" onClick={() => copyToClipboard(proxyCodeOpenAI, "proxy-openai")}>
                           {copiedKey === "proxy-openai" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                         </Button>
                       </div>
                    </div>
                   </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

