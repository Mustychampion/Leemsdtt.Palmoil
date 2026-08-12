import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { auth } from "@/integrations/firebase/client";
import { useAuth, hasAnyRole } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { TeamManagement } from "@/components/admin/TeamManagement";
import logo from "@/assets/leemsdtt-logo.png";
import { LogOut, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "LeemsDTT Admin Dashboard" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const { loading, user, roles } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  const isSuperAdmin = roles.includes("super_admin");
  const canSeeSubmissions = hasAnyRole(roles, ["super_admin", "sales", "support"]);
  const canEditSubmissions = hasAnyRole(roles, ["super_admin", "sales"]);

  const signOut = async () => {
    await auth.signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="LeemsDTT" className="h-9 w-9" />
            <div className="font-display text-base">LeemsDTT Admin</div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              {roles.length === 0 ? (
                <Badge variant="outline">No role assigned</Badge>
              ) : roles.map((r) => <Badge key={r} variant="secondary">{r}</Badge>)}
            </div>
            <div className="text-sm text-muted-foreground hidden md:block">{user.email}</div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        {roles.length === 0 && (
          <div className="mb-6 rounded-xl border border-border bg-background p-6">
            <div className="flex items-start gap-4">
              <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div className="flex-1">
                <div className="font-display text-lg text-foreground">No role assigned</div>
                <p className="text-sm text-muted-foreground mb-3">
                  A Super Admin must assign you a role before you can view submissions. Contact your Super Admin to be granted access.
                </p>
              </div>
            </div>
          </div>
        )}

        {canSeeSubmissions && (
          <Tabs defaultValue="inquiries">
            <TabsList>
              <TabsTrigger value="inquiries">Contact inquiries</TabsTrigger>
              <TabsTrigger value="bulk">Bulk quotes</TabsTrigger>
              <TabsTrigger value="distributors">Distributor applications</TabsTrigger>
              {isSuperAdmin && <TabsTrigger value="team">Team</TabsTrigger>}
            </TabsList>
            <TabsContent value="inquiries" className="mt-6">
              <SubmissionsTable
                table="inquiries"
                canEdit={canEditSubmissions}
                canDelete={isSuperAdmin}
                columns={[
                  { key: "full_name", label: "Name" },
                  { key: "email", label: "Email" },
                  { key: "phone", label: "Phone" },
                  { key: "preferred_size", label: "Size" },
                  { key: "quantity", label: "Quantity" },
                ]}
              />
            </TabsContent>
            <TabsContent value="bulk" className="mt-6">
              <SubmissionsTable
                table="bulk_quotes"
                canEdit={canEditSubmissions}
                canDelete={isSuperAdmin}
                columns={[
                  { key: "business_name", label: "Business" },
                  { key: "business_type", label: "Type" },
                  { key: "email", label: "Email" },
                  { key: "monthly_volume", label: "Volume" },
                  { key: "delivery_location", label: "Location" },
                ]}
              />
            </TabsContent>
            <TabsContent value="distributors" className="mt-6">
              <SubmissionsTable
                table="distributor_applications"
                canEdit={canEditSubmissions}
                canDelete={isSuperAdmin}
                columns={[
                  { key: "full_name", label: "Name" },
                  { key: "business_name", label: "Business" },
                  { key: "email", label: "Email" },
                  { key: "phone", label: "Phone" },
                  { key: "region", label: "Region" },
                ]}
              />
            </TabsContent>
            {isSuperAdmin && (
              <TabsContent value="team" className="mt-6"><TeamManagement /></TabsContent>
            )}
          </Tabs>
        )}

        {!canSeeSubmissions && roles.length > 0 && (
          <div className="rounded-xl border border-border bg-background p-8 text-center text-muted-foreground">
            Your role ({roles.join(", ")}) does not have access to submissions. Contact a Super Admin if you need access.
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
}