import { useEffect, useState } from "react";
import { format } from "date-fns";
import { db } from "@/integrations/firebase/client";
import { collection, query, orderBy, getDocs, updateDoc, deleteDoc, doc, where } from "firebase/firestore";
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

type TableName = "inquiries" | "distributor_applications" | "bulk_quotes";

const STATUS_OPTIONS = ["new", "contacted", "qualified", "won", "lost", "archived"];

interface Props {
  table: TableName;
  columns: { key: string; label: string }[];
  canEdit: boolean;
  canDelete: boolean;
}

export function SubmissionsTable({ table, columns, canEdit, canDelete }: Props) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    let q = query(collection(db, table), orderBy("created_at", "desc"));
    if (filter !== "all") {
      q = query(collection(db, table), where("status", "==", filter), orderBy("created_at", "desc"));
    }
    try {
      const snap = await getDocs(q);
      setRows(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error: any) {
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
      toast.error("Couldn't update", { description: error.message });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this submission? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, table, id));
      toast.success("Deleted");
      load();
    } catch (error: any) {
      toast.error("Couldn't delete", { description: error.message });
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
              {columns.map((c) => <TableHead key={c.key}>{c.label}</TableHead>)}
              <TableHead className="w-36">Status</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={columns.length + 3} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={columns.length + 3} className="text-center py-8 text-muted-foreground">No submissions yet.</TableCell></TableRow>
            ) : rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {row.created_at ? format(new Date(row.created_at), "d MMM, HH:mm") : "—"}
                </TableCell>
                {columns.map((c) => (
                  <TableCell key={c.key} className="max-w-[220px] truncate">{row[c.key] ?? "—"}</TableCell>
                ))}
                <TableCell>
                  {canEdit ? (
                    <Select value={row.status} onValueChange={(v) => updateStatus(row.id, v)}>
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
                      <DialogHeader><DialogTitle>Submission details</DialogTitle></DialogHeader>
                      <dl className="space-y-2 text-sm">
                        {Object.entries(row).map(([k, v]) => (
                          <div key={k} className="grid grid-cols-3 gap-2">
                            <dt className="text-muted-foreground capitalize">{k.replace(/_/g, " ")}</dt>
                            <dd className="col-span-2 break-words">{String(v ?? "—")}</dd>
                          </div>
                        ))}
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