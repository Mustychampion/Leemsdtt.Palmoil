import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { auth } from "@/integrations/firebase/client";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { TeamManagement } from "@/components/admin/TeamManagement";
import { PriceManagement } from "@/components/admin/PriceManagement";
import { BlogManagement } from "@/components/admin/BlogManagement";
import { Link } from "@tanstack/react-router";
import { LogOut, ExternalLink, ShieldCheck, Mail, Users, Tag, Truck, MessageSquare, FileText } from "lucide-react";
import { getSeoMeta } from "@/lib/seo";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin")({
  head: () => getSeoMeta({
    title: "Admin Portal — LeemsDTT Internal",
    description: "LeemsDTT internal administration portal.",
    path: "/admin",
    noIndex: true,
  }),
  component: AdminPage,
});

function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-sm">
        Loading admin session...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
        <ShieldCheck className="h-12 w-12 text-primary" />
        <h1 className="font-display text-2xl text-foreground font-bold">Authentication Required</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          You must be signed in with an authorized team account to access the administration portal.
        </p>
        <Button asChild variant="gold">
          <Link to="/login">Sign In to Staff Account</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-display text-lg font-bold text-foreground">LeemsDTT Admin</div>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">Internal</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{user.email}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut(auth)}
            className="text-muted-foreground hover:text-destructive text-xs"
          >
            <LogOut className="h-3.5 w-3.5 mr-1" /> Sign Out
          </Button>
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link to="/" target="_blank">
              View Public Site <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="inquiries" className="space-y-6">
          <TabsList className="bg-background border border-border flex flex-wrap h-auto p-1 gap-1">
            <TabsTrigger value="inquiries" className="flex items-center gap-1.5 text-xs">
              <MessageSquare className="h-3.5 w-3.5" /> Customer Inquiries
            </TabsTrigger>
            <TabsTrigger value="distributors" className="flex items-center gap-1.5 text-xs">
              <Truck className="h-3.5 w-3.5" /> Distributor Apps
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center gap-1.5 text-xs">
              <Mail className="h-3.5 w-3.5" /> Bulk Quotes
            </TabsTrigger>
            <TabsTrigger value="prices" className="flex items-center gap-1.5 text-xs">
              <Tag className="h-3.5 w-3.5" /> Product Prices
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-1.5 text-xs">
              <Users className="h-3.5 w-3.5" /> Team Staff
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-1.5 text-xs">
              <FileText className="h-3.5 w-3.5" /> Blog Posts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inquiries" className="space-y-4">
            <SubmissionsTable table="inquiries" canEdit={true} canDelete={true} />
          </TabsContent>

          <TabsContent value="distributors" className="space-y-4">
            <SubmissionsTable table="distributor_applications" canEdit={true} canDelete={true} />
          </TabsContent>

          <TabsContent value="quotes" className="space-y-4">
            <SubmissionsTable table="bulk_quotes" canEdit={true} canDelete={true} />
          </TabsContent>

          <TabsContent value="prices" className="space-y-4">
            <PriceManagement />
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <TeamManagement />
          </TabsContent>

          <TabsContent value="blog" className="space-y-4">
            <BlogManagement />
          </TabsContent>
        </Tabs>
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}