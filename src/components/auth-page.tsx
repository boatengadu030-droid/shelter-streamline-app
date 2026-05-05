import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sprout, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export function AuthPage({ onBack }: { onBack?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: name },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. Check your email to confirm.");
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) toast.error("Google sign-in failed");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <div className="absolute inset-0 opacity-30 mix-blend-soft-light shimmer" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur">
              <Sprout className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-xl font-bold">Havenlight</p>
              <p className="text-[10px] tracking-[0.18em] opacity-80">ORPHANAGE OS</p>
            </div>
          </div>
          <div className="float-in">
            <h1 className="font-display text-5xl font-bold leading-[1.05]">
              Care, dignity and hope — measured every day.
            </h1>
            <p className="mt-6 max-w-md text-base opacity-90">
              A calm operations system for the people who run children's homes. Children, sponsors,
              compliance and inventory — in one quiet place.
            </p>
          </div>
          <div className="text-xs opacity-70">© Havenlight {new Date().getFullYear()}</div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md p-8 shadow-soft">
          {onBack && (
            <button onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to home
            </button>
          )}
          <h2 className="font-display text-3xl font-bold">Welcome</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to continue, or create your home's first account.</p>

          <Tabs defaultValue="signin" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-4">
              <form onSubmit={signIn} className="space-y-3">
                <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><Label>Password</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "…" : "Sign in"}</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-4">
              <form onSubmit={signUp} className="space-y-3">
                <div><Label>Full name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><Label>Password</Label><Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "…" : "Create account"}</Button>
                <p className="text-xs text-muted-foreground">First account becomes Administrator.</p>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" className="w-full" onClick={google}>Continue with Google</Button>
        </Card>
      </div>
    </div>
  );
}
