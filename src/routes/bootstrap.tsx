import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { verifySecret, superAdminExists } from "@/lib/bootstrap.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import logo from "@/assets/leemsdtt-logo.png";
import { ShieldCheck } from "lucide-react";
import { auth, db } from "@/integrations/firebase/client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { getSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/bootstrap")({
  head: () => getSeoMeta({
    title: "First-time Setup — LeemsDTT",
    description: "Internal Super Admin initialization.",
    path: "/bootstrap",
    noIndex: true,
  }),
  component: BootstrapPage,
});

function BootstrapPage() {
  const navigate = useNavigate();
  const check = useServerFn(superAdminExists);
  const verify = useServerFn(verifySecret);
  const [checking, setChecking] = useState(true);
  const [closed, setClosed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ secret: "", fullName: "", email: "", password: "" });

  useEffect(() => {
    check({}).then((r) => setClosed(r.exists)).finally(() => setChecking(false));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(db, "profiles", user.uid), { email: form.email, full_name: form.fullName });
      await addDoc(collection(db, "user_roles"), { user_id: user.uid, role: "super_admin" });
      
      toast.success("Super Admin created", { description: "You are now logged in." });
      navigate({ to: "/admin" });
    } catch (err: any) {
      console.error("Firebase Auth Error:", err);
      toast.error("Bootstrap failed", { description: err?.message ?? "Try again." });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Checking setup status...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-background rounded-2xl shadow-elegant p-8 space-y-6">
        <Link to="/" className="flex items-center gap-3 justify-center">
          <img src={logo} alt="LeemsDTT" className="h-12 w-12" />
          <div className="font-display text-xl text-foreground">LeemsDTT — First-time Setup</div>
        </Link>
        {closed ? (
          <div className="text-center space-y-3">
            <ShieldCheck className="h-10 w-10 text-primary mx-auto" />
            <div className="font-display text-lg">Setup already complete</div>
            <p className="text-sm text-muted-foreground">A Super Admin exists. New team members must be invited from the admin dashboard.</p>
            <Button asChild variant="deep"><Link to="/login">Go to sign in</Link></Button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="font-display text-2xl">Create the first Super Admin</h1>
              <p className="text-sm text-muted-foreground mt-1">This form only works once. Enter the bootstrap secret to continue.</p>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secret">Bootstrap secret</Label>
                <Input id="secret" type="password" required value={form.secret} onChange={(e) => setForm({ ...form, secret: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password (min 8)</Label>
                <Input id="password" type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Super Admin"}
              </Button>
            </form>
          </>
        )}
      </div>
      <Toaster />
    </div>
  );
}