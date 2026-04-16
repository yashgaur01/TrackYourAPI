import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Eye, EyeOff, Plus, Terminal, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useApiKeys } from "@/hooks/use-api-keys"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ApiKeysPage() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const { apiKeys, generateKey, revokeKey } = useApiKeys()

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(id)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
      const key = await generateKey({ name: "Default Key" })
      setNewKey(key)
      toast.success("API Key generated! Copy it now — you won't see it again.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate key")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRevoke = async (keyId: any) => {
    try {
      await revokeKey({ keyId })
      toast.success("API Key revoked")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to revoke key")
    }
  }

  const toggleShowKey = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const firstActiveKey = apiKeys?.find(k => k.isActive)?.key || "YOUR_API_KEY"
  const httpUrl = import.meta.env.VITE_SUPABASE_URL || ''

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xs font-bold uppercase tracking-[0.2em]">API Keys</h1>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 relative">
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,oklch(0_0_0/0.01)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0_0_0/0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] dark:bg-[linear-gradient(to_right,oklch(1_0_0/0.02)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.02)_1px,transparent_1px)]" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-tighter uppercase">API Access</h1>
              <p className="text-muted-foreground text-sm tracking-tight">Manage your credentials and integrate TrackYourAPI into your app.</p>
            </div>
            <Button 
              className="rounded-none text-xs font-bold uppercase tracking-widest"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              <Plus className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate New Key"}
            </Button>
          </div>

          <div className="grid gap-6">
            {!apiKeys ? (
              <Card className="rounded-none border-border/50 shadow-none">
                <CardHeader>
                  <Skeleton className="h-4 w-32 rounded-none" />
                  <Skeleton className="h-3 w-64 rounded-none" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full rounded-none" />
                </CardContent>
              </Card>
            ) : apiKeys.length === 0 ? (
              <Card className="rounded-none border-border/50 shadow-none">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 rounded-full bg-muted mb-4">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-1">No API Keys</h3>
                  <p className="text-xs text-muted-foreground mb-6">Generate your first API key to start tracking usage.</p>
                  <Button 
                    variant="outline" 
                    className="rounded-none text-xs font-bold uppercase tracking-widest"
                    onClick={handleGenerate}
                  >
                    Generate Key
                  </Button>
                </CardContent>
              </Card>
            ) : (
              apiKeys.map((key) => (
                <Card key={key._id} className="rounded-none border-border/50 shadow-none">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider">{key.name}</CardTitle>
                        <CardDescription className="text-[10px] uppercase tracking-widest font-medium">
                          Created on {new Date(key.createdAt).toLocaleDateString()}. {key.lastUsed ? `Last used ${new Date(key.lastUsed).toLocaleString()}` : 'Never used'}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`rounded-none text-[10px] font-bold uppercase tracking-widest px-4 py-1 border-0 ${key.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}
                      >
                        {key.isActive ? 'Active' : 'Revoked'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <Input
                          type={showKeys[key._id] ? "text" : "password"}
                          value={key.key}
                          readOnly
                          className="pr-20 font-mono text-xs rounded-none border-border/50 focus-visible:ring-primary"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleShowKey(key._id)}
                            className="h-8 w-8 hover:bg-transparent"
                          >
                            {showKeys[key._id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(key.key, key._id)}
                            className="h-8 w-8 hover:bg-transparent"
                          >
                            {copiedKey === key._id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      {key.isActive && (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="rounded-none border-rose-500/20 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                          onClick={() => handleRevoke(key._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            <Card className="rounded-none border-border/50 shadow-none">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">Quick Start Guide</CardTitle>
                </div>
                <CardDescription className="text-xs tracking-tight">
                  Install our SDK and start tracking your API usage in minutes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">1. Install the SDK</h3>
                  <div className="relative group">
                    <pre className="bg-muted/50 p-4 rounded-none text-xs font-mono overflow-x-auto border border-border/50">
                      bun add @trackyourapi/sdk
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard("bun add @trackyourapi/sdk", "install")}
                    >
                      {copiedKey === "install" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">2. Initialize & Track</h3>
                  <div className="relative group">
                    <pre className="bg-muted/50 p-4 rounded-none text-xs font-mono overflow-x-auto border border-border/50">
{`import { TrackYourAPI } from "@trackyourapi/sdk";

const tracker = new TrackYourAPI({
  apiKey: "${firstActiveKey}",
  endpoint: "${httpUrl}/api/track"
});

// Automatically track OpenAI requests
const response = await tracker.openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: "Hello!" }],
});`}
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(`import { TrackYourAPI } from "@trackyourapi/sdk";

const tracker = new TrackYourAPI({
  apiKey: "${firstActiveKey}",
  endpoint: "${httpUrl}/api/track"
});

// Automatically track OpenAI requests
const response = await tracker.openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: "Hello!" }],
});`, "code")}
                    >
                      {copiedKey === "code" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={!!newKey} onOpenChange={(open) => !open && setNewKey(null)}>
          <DialogContent className="rounded-none border-border/50">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold uppercase tracking-wider">New API Key Generated</DialogTitle>
              <DialogDescription className="text-xs">
                Copy this key now. You won't be able to see it again for security reasons.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 mt-4">
              <Input
                value={newKey || ""}
                readOnly
                className="font-mono text-xs rounded-none border-border/50"
              />
              <Button
                size="icon"
                onClick={() => copyToClipboard(newKey || "", "new-key")}
                className="rounded-none shrink-0"
              >
                {copiedKey === "new-key" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button 
              className="w-full mt-4 rounded-none text-[10px] font-bold uppercase tracking-widest"
              onClick={() => setNewKey(null)}
            >
              I've saved it
            </Button>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
