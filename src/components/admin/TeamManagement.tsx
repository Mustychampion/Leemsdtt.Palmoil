import { useEffect, useState } from "react";
import { db } from "@/integrations/firebase/client";
import { collection, getDocs, addDoc, deleteDoc, query, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { AppRole } from "@/hooks/useAuth";

const ALL_ROLES: AppRole[] = ["super_admin", "content", "sales", "support", "marketing"];

interface Member {
  id: string;
  email: string | null;
  full_name: string | null;
  roles: AppRole[];
}

export function TeamManagement() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<{ userId: string; role: AppRole | "" } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [profilesSnap, rolesSnap] = await Promise.all([
        getDocs(collection(db, "profiles")),
        getDocs(collection(db, "user_roles")),
      ]);
      const byUser = new Map<string, AppRole[]>();
      rolesSnap.forEach(d => {
        const r = d.data();
        const arr = byUser.get(r.user_id) ?? [];
        arr.push(r.role);
        byUser.set(r.user_id, arr);
      });
      setMembers(profilesSnap.docs.map(d => {
        const p = d.data();
        return { id: p.id || d.id, email: p.email, full_name: p.full_name, roles: byUser.get(p.id || d.id) ?? [] };
      }));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addRole = async (userId: string, role: AppRole) => {
    try {
      await addDoc(collection(db, "user_roles"), { user_id: userId, role });
      toast.success("Role assigned");
      load();
    } catch (error: any) {
      toast.error("Couldn't assign", { description: error.message });
    }
  };

  const removeRole = async (userId: string, role: AppRole) => {
    try {
      const q = query(collection(db, "user_roles"), where("user_id", "==", userId), where("role", "==", role));
      const snap = await getDocs(q);
      await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
      toast.success("Role removed");
      load();
    } catch (error: any) {
      toast.error("Couldn't remove", { description: error.message });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Assign one or more roles per team member. Roles control which sections of the dashboard they can use.
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="w-72">Assign</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
            ) : members.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No team members yet.</TableCell></TableRow>
            ) : members.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.full_name || "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{m.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {m.roles.length === 0 ? <span className="text-xs text-muted-foreground">No roles</span> :
                      m.roles.map((r) => (
                        <Badge key={r} variant="secondary" className="gap-1">
                          {r}
                          <button onClick={() => removeRole(m.id, r)} className="ml-1 hover:text-destructive" aria-label="Remove">×</button>
                        </Badge>
                      ))
                    }
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Select value={adding?.userId === m.id ? adding.role : ""} onValueChange={(v) => setAdding({ userId: m.id, role: v as AppRole })}>
                      <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select role…" /></SelectTrigger>
                      <SelectContent>
                        {ALL_ROLES.filter((r) => !m.roles.includes(r)).map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button size="sm" disabled={!(adding?.userId === m.id && adding.role)} onClick={() => {
                      if (adding?.userId === m.id && adding.role) { addRole(m.id, adding.role); setAdding(null); }
                    }}>Add</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}