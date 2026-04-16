import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User as UserIcon, Save } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  const { user } = useAuth()
  const signOut = async () => {
    await supabase.auth.signOut();
  }

  const [name, setName] = useState("")
  const [image, setImage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Avoid resetting form if user is typing while data re-fetches
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (user && !isInitialized) {
      setName(user.user_metadata?.name || "")
      setImage(user.user_metadata?.avatar_url || "")
      setIsInitialized(true)
    }
  }, [user, isInitialized])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      let imageUrl = image;
      
      if (selectedFile && user?.id) {
        // Upload to Supabase Storage
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `${user.id}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, selectedFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        imageUrl = data.publicUrl;
      }
      
      const { error } = await supabase.auth.updateUser({
        data: {
          name: name.trim() || undefined,
          avatar_url: imageUrl || undefined
        }
      });
      
      if (error) throw error;
      
      if (selectedFile) setImage(imageUrl);
      setSelectedFile(null)
      toast.success("Profile updated successfully")
    } catch (e) {
      console.error(e);
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xs font-bold uppercase tracking-[0.2em]">Profile</h1>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 relative max-w-4xl mx-auto w-full">
          {/* Subtle background texture */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,oklch(0_0_0/0.01)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0_0_0/0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] dark:bg-[linear-gradient(to_right,oklch(1_0_0/0.02)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.02)_1px,transparent_1px)]" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-tighter uppercase">Your Profile</h1>
              <p className="text-muted-foreground text-sm tracking-tight">
                Manage your personal information and avatar.
              </p>
            </div>
            <Button 
              className="rounded-none text-xs font-bold uppercase tracking-widest"
              onClick={handleSave}
              disabled={isSaving || !isInitialized}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </div>

          <div className="grid gap-6">
            <Card className="rounded-none border-border/50 shadow-none">
              <CardHeader className="pb-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">Account Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {!user ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <Avatar className="h-32 w-32 border-4 border-border/50 shadow-2xl transition-all duration-300 group-hover:brightness-50 group-hover:scale-[1.02]">
                          <AvatarImage src={selectedFile ? URL.createObjectURL(selectedFile) : image} className="object-cover" />
                          <AvatarFallback className="text-4xl bg-primary text-primary-foreground font-black">
                            {name ? name.charAt(0).toUpperCase() : (user.email?.charAt(0).toUpperCase() || "U")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-bold text-white uppercase tracking-widest bg-black/50 px-2 py-1 rounded">Change</span>
                        </div>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setSelectedFile(e.target.files[0])
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-6 flex-1 w-full">
                      <div className="grid gap-2">
                        <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Email Address (Unchangeable)
                        </Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={user.email || ""}
                          disabled
                          className="rounded-none border-border/50 bg-muted/50 font-mono text-sm" 
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Display Name
                        </Label>
                        <Input 
                          id="name" 
                          type="text" 
                          autoComplete="off"
                          placeholder="TrackYourAPI User"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="rounded-none border-border/50 font-mono text-sm focus-visible:ring-primary" 
                        />
                      </div>

                      <div className="grid gap-2 mt-4 relative">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Profile Avatar
                        </Label>
                        <div className="flex gap-4">
                          <Button 
                            variant="outline" 
                            className="rounded-none border-border/50 font-mono text-sm flex-1"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Select Image File
                          </Button>
                          {selectedFile && (
                            <Button 
                              variant="ghost" 
                              className="rounded-none"
                              onClick={() => setSelectedFile(null)}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {selectedFile ? `Selected: ${selectedFile.name}` : "Upload an image to personalize your profile."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-none border-border/50 shadow-none bg-muted/20">
              <CardContent className="pt-6 flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold uppercase tracking-widest">Sign out of all devices</h4>
                  <p className="text-xs text-muted-foreground">This will end your current session.</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => void signOut()}
                  className="rounded-none text-xs font-bold tracking-widest uppercase border-border/50 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
