import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/integrations/firebase/client";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import logo from "@/assets/leemsdtt-logo.png";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Team Login — LeemsDTT Admin" },
      { name: "description", content: "LeemsDTT internal team login." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate({ to: "/admin" });
    });
    return () => unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      toast.error("Authentication failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-background rounded-2xl shadow-elegant p-8 space-y-6">
        <Link to="/" className="flex items-center gap-3 justify-center">
          <img src={logo} alt="LeemsDTT" className="h-12 w-12" />
          <div className="font-display text-xl text-foreground">LeemsDTT Admin</div>
        </Link>
        <div className="text-center">
          <h1 className="font-display text-2xl text-foreground">Team sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Internal access only. Accounts are created by a Super Admin.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? "Please wait…" : "Sign in"}
          </Button>
        </form>
        <div className="text-center text-xs text-muted-foreground">
          First-time setup? <Link to="/bootstrap" className="text-primary font-semibold">Bootstrap Super Admin</Link>
        </div>
      </div>
      <Toaster />
    </div>
  );
}