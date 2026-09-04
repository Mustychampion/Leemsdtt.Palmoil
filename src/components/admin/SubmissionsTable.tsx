import { useEffect, useState } from "react";
import { format } from "date-fns";
import { db } from "@/integrations/firebase/client";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export type TableName = "inquiries" | "distributor_applications" | "bulk_quotes";

const STATUS_OPTIONS = ["new", "contacted", "qualified", "won", "lost", "archived"];

const DEFAULT_COLUMNS: Record<TableName, { key: string; label: string }[]> = {
  inquiries: [
    { key: "full_name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "preferred_size", label: "Size" },
    { key: "message", label: "Message" },
  ],
  distributor_applications: [
    { key: "company_name", label: "Company" },
    { key: "contact_name", label: "Contact" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "location", label: "Location" },
  ],
  bulk_quotes: [
    { key: "company_name", label: "Company" },
    { key: "contact_name", label: "Contact" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "requested_volume", label: "Volume" },
  ],
};

interface Props {
  table?: TableName;
  columns?: { key: string; label: string }[];
  canEdit?: boolean;
  canDelete?: boolean;
}

export function SubmissionsTable({
  table = "inquiries",
  columns,
  canEdit = true,
  canDelete = true,
}: Props) {
  const activeColumns = columns || DEFAULT_COLUMNS[table] || DEFAULT_COLUMNS.inquiries;
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    try {
      let snap;
      try {
        let q = query(collection(db, table), orderBy("created_at", "desc"));
        if (filter !== "all") {
          q = query(collection(db, table), where("status", "==", filter), orderBy("created_at", "desc"));
        }
        snap = await getDocs(q);
      } catch (queryErr) {
        // Fallback for missing composite indexes: fetch collection and filter/sort in memory
        console.warn("Falling back to client-side filtering for", table, queryErr);
        snap = await getDocs(collection(db, table));
      }

      let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      if (filter !== "all") {
        items = items.filter((item: any) => item.status === filter);
      }

      // Safe date sorting
      items.sort((a: any, b: any) => {
        const getMs = (val: any) => {
          if (!val) return 0;
          if (typeof val.toDate === "function") return val.toDate().getTime();
          if (val.seconds) return val.seconds * 1000;
          return new Date(val).getTime() || 0;
        };
        return getMs(b.created_at) - getMs(a.created_at);
      });

      setRows(items);
    } catch (error: any) {
      console.error("Submissions load error:", error);
      toast.error("Couldn't load submissions", { description: error.message });
      setRows([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [table, filter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, table, id), { status });
      toast.success("Status updated");
      load();
    } catch (error: any) {
      toast.error("Couldn't update status", { description: error.message });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this submission? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, table, id));
      toast.success("Submission deleted");
      load();
    } catch (error: any) {
      toast.error("Couldn't delete submission", { description: error.message });
    }
  };

  const formatCreatedAt = (val: any) => {
    if (!val) return "—";
    try {
      let d: Date;
      if (typeof val.toDate === "function") {
        d = val.toDate();
      } else if (val.seconds) {
        d = new Date(val.seconds * 1000);
      } else {
        d = new Date(val);
      }
      if (isNaN(d.getTime())) return "—";
      return format(d, "d MMM, HH:mm");
    } catch {
      return "—";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Filter status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
        </div>
        <div className="text-sm text-muted-foreground">{rows.length} {rows.length === 1 ? "entry" : "entries"}</div>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Received</TableHead>
              {activeColumns.map((c) => <TableHead key={c.key}>{c.label}</TableHead>)}
              <TableHead className="w-36">Status</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={activeColumns.length + 3} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={activeColumns.length + 3} className="text-center py-8 text-muted-foreground">No submissions recorded yet.</TableCell></TableRow>
            ) : rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatCreatedAt(row.created_at)}
                </TableCell>
                {activeColumns.map((c) => {
                  const val = row[c.key];
                  let displayVal = "—";
                  if (val != null) {
                    if (typeof val === 'object') {
                      try {
                        displayVal = JSON.stringify(val);
                      } catch {
                        displayVal = "[object Object]";
                      }
                    } else {
                      displayVal = String(val);
                    }
                  }
                  return (
                    <TableCell key={c.key} className="max-w-[220px] truncate">{displayVal}</TableCell>
                  );
                })}
                <TableCell>
                  {canEdit ? (
                    <Select value={row.status || "new"} onValueChange={(v) => updateStatus(row.id, v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="secondary">{row.status || "new"}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">View</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader><DialogTitle>Submission Details</DialogTitle></DialogHeader>
                      <dl className="space-y-2 text-sm">
                        {Object.entries(row).map(([k, v]) => {
                          let displayVal = "—";
                          if (k === "created_at") {
                            displayVal = formatCreatedAt(v);
                          } else if (v != null) {
                            if (typeof v === 'object') {
                              try { displayVal = JSON.stringify(v); } catch { displayVal = "[object Object]"; }
                            } else {
                              displayVal = String(v);
                            }
                          }
                          return (
                            <div key={k} className="grid grid-cols-3 gap-2">
                              <dt className="text-muted-foreground capitalize">{k.replace(/_/g, " ")}</dt>
                              <dd className="col-span-2 break-words">
                                {displayVal}
                              </dd>
                            </div>
                          );
                        })}
                      </dl>
                    </DialogContent>
                  </Dialog>
                  {canDelete && (
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(row.id)}>Delete</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}