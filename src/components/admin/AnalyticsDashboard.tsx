import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { db } from "@/integrations/firebase/client";
import { collection, getDocs, query, orderBy, limit, deleteDoc, doc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Users, Globe, Smartphone, Monitor, RefreshCw, Search,
  Activity, ArrowUpRight, Wifi, MapPin, Eye, Trash2
} from "lucide-react";
import type { VisitorLogRecord } from "@/lib/analytics";

export function AnalyticsDashboard() {
  const [logs, setLogs] = useState<VisitorLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const loadLogs = async () => {
    setLoading(true);
    try {
      let snap;
      try {
        const q = query(collection(db, "visitor_logs"), orderBy("created_at", "desc"), limit(250));
        snap = await getDocs(q);
      } catch (e) {
        console.warn("Index query fallback for visitor_logs:", e);
        snap = await getDocs(collection(db, "visitor_logs"));
      }

      const items: VisitorLogRecord[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<VisitorLogRecord, "id">),
      }));

      // Sort in memory by created_at descending
      items.sort((a, b) => {
        const tA = new Date(a.created_at || 0).getTime();
        const tB = new Date(b.created_at || 0).getTime();
        return tB - tA;
      });

      setLogs(items);
    } catch (err: any) {
      console.error("Failed to load visitor logs:", err);
      toast.error("Could not load visitor logs", {
        description: err.message?.includes("permission")
          ? "Firestore permission error: Please ensure 'visitor_logs' rules allow read access."
          : err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const deleteLog = async (id: string) => {
    if (!confirm("Delete this log entry?")) return;
    try {
      await deleteDoc(doc(db, "visitor_logs", id));
      setLogs((prev) => prev.filter((l) => l.id !== id));
      toast.success("Log entry deleted");
    } catch (err: any) {
      toast.error("Failed to delete log entry", { description: err.message });
    }
  };

  // Metrics computation
  const stats = useMemo(() => {
    const totalVisits = logs.length;
    const uniqueIps = new Set(logs.map((l) => l.ip_address).filter((ip) => ip && ip !== "unknown")).size;
    const returningCount = logs.filter((l) => l.is_returning || l.visit_count > 1).length;
    const mobileCount = logs.filter((l) => l.device_type === "Mobile").length;
    const desktopCount = logs.filter((l) => l.device_type === "Desktop").length;

    // Top Countries
    const countryMap: Record<string, number> = {};
    const cityMap: Record<string, number> = {};
    const ispMap: Record<string, number> = {};
    const pathMap: Record<string, number> = {};

    logs.forEach((l) => {
      const c = l.country || "Unknown Country";
      countryMap[c] = (countryMap[c] || 0) + 1;

      if (l.city) {
        cityMap[l.city] = (cityMap[l.city] || 0) + 1;
      }
      if (l.isp) {
        ispMap[l.isp] = (ispMap[l.isp] || 0) + 1;
      }
      if (Array.isArray(l.path_history)) {
        l.path_history.forEach((p) => {
          pathMap[p] = (pathMap[p] || 0) + 1;
        });
      }
    });

    const topCountries = Object.entries(countryMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topCities = Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topIsps = Object.entries(ispMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topPages = Object.entries(pathMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return {
      totalVisits,
      uniqueIps,
      returningCount,
      returningPercent: totalVisits ? Math.round((returningCount / totalVisits) * 100) : 0,
      mobileCount,
      mobilePercent: totalVisits ? Math.round((mobileCount / totalVisits) * 100) : 0,
      desktopCount,
      desktopPercent: totalVisits ? Math.round((desktopCount / totalVisits) * 100) : 0,
      topCountries,
      topCities,
      topIsps,
      topPages,
    };
  }, [logs]);

  // Filtering
  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (deviceFilter !== "all" && l.device_type !== deviceFilter) return false;
      if (typeFilter === "returning" && !(l.is_returning || l.visit_count > 1)) return false;
      if (typeFilter === "new" && (l.is_returning || l.visit_count > 1)) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const ip = (l.ip_address || "").toLowerCase();
        const city = (l.city || "").toLowerCase();
        const country = (l.country || "").toLowerCase();
        const isp = (l.isp || "").toLowerCase();
        const asn = (l.asn || "").toLowerCase();
        if (!ip.includes(q) && !city.includes(q) && !country.includes(q) && !isp.includes(q) && !asn.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [logs, deviceFilter, typeFilter, search]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "—";
      return format(d, "d MMM yyyy, HH:mm");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Live Visitor Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            Automatic tracking recording visitor IP, geolocations, ISP/ASN, and device telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadLogs} disabled={loading} className="gap-1.5">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Logged Visits
            </CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold font-display text-foreground">{stats.totalVisits}</div>
            <p className="text-xs text-muted-foreground mt-1">Recorded sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Unique IP Addresses
            </CardTitle>
            <Globe className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold font-display text-foreground">{stats.uniqueIps}</div>
            <p className="text-xs text-muted-foreground mt-1">Distinct network visitors</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Returning Visitors
            </CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold font-display text-foreground">{stats.returningCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.returningPercent}% of total audience
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Mobile vs Desktop
            </CardTitle>
            <Smartphone className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold font-display text-foreground">
              {stats.mobilePercent}% <span className="text-sm font-normal text-muted-foreground">Mobile</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.desktopPercent}% Desktop / {stats.mobileCount} mobile users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Locations */}
        <Card className="bg-card border-border">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" /> Top Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-2 text-xs">
            {stats.topCountries.length === 0 ? (
              <p className="text-muted-foreground py-2">No location data recorded yet.</p>
            ) : (
              stats.topCountries.map(([country, count]) => (
                <div key={country} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
                  <span className="font-medium text-foreground truncate">{country}</span>
                  <Badge variant="secondary" className="text-[10px]">{count} visits</Badge>
                </div>
              ))
            )}
            {stats.topCities.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1">
                  Top Cities
                </span>
                <div className="flex flex-wrap gap-1">
                  {stats.topCities.map(([city, count]) => (
                    <Badge key={city} variant="outline" className="text-[11px]">
                      {city}: {count}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top ISPs / Carriers */}
        <Card className="bg-card border-border">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
              <Wifi className="h-4 w-4 text-emerald-500" /> Networks &amp; ISPs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-2 text-xs">
            {stats.topIsps.length === 0 ? (
              <p className="text-muted-foreground py-2">No ISP data recorded yet.</p>
            ) : (
              stats.topIsps.map(([isp, count]) => (
                <div key={isp} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
                  <span className="font-medium text-foreground truncate max-w-[190px]" title={isp}>{isp}</span>
                  <Badge variant="secondary" className="text-[10px]">{count}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Popular Paths */}
        <Card className="bg-card border-border">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
              <ArrowUpRight className="h-4 w-4 text-amber-500" /> Pages Visited
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-2 text-xs">
            {stats.topPages.length === 0 ? (
              <p className="text-muted-foreground py-2">No page paths recorded yet.</p>
            ) : (
              stats.topPages.map(([page, count]) => (
                <div key={page} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
                  <span className="font-mono text-foreground truncate max-w-[190px]">{page}</span>
                  <Badge variant="secondary" className="text-[10px]">{count} views</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-card border-border">
        <CardHeader className="p-4 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold">Detailed Visitor Log Stream</CardTitle>
            <CardDescription className="text-xs">
              Showing {filteredLogs.length} of {logs.length} logged visits
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-48 sm:w-60">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search IP, city, ISP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs bg-background"
              />
            </div>
            <Select value={deviceFilter} onValueChange={setDeviceFilter}>
              <SelectTrigger className="w-28 h-8 text-xs bg-background">
                <SelectValue placeholder="Device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
                <SelectItem value="Desktop">Desktop</SelectItem>
                <SelectItem value="Tablet">Tablet</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-28 h-8 text-xs bg-background">
                <SelectValue placeholder="Visitor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visitors</SelectItem>
                <SelectItem value="new">First Time</SelectItem>
                <SelectItem value="returning">Returning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-b-lg overflow-x-auto border-t border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-36 text-xs">Timestamp</TableHead>
                  <TableHead className="text-xs">IP Address</TableHead>
                  <TableHead className="text-xs">Location</TableHead>
                  <TableHead className="text-xs">Device</TableHead>
                  <TableHead className="text-xs">ISP &amp; ASN</TableHead>
                  <TableHead className="text-xs">Visits</TableHead>
                  <TableHead className="text-xs">Landing Path</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-xs">
                      <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                      Loading visitor logs from Firestore...
                    </TableCell>
                  </TableRow>
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-xs">
                      No visitor records found. Logs will populate automatically as visitors browse the site.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id} className="text-xs">
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {formatDate(log.created_at)}
                      </TableCell>
                      <TableCell className="font-mono font-medium text-foreground">
                        {log.ip_address || "unknown"}
                      </TableCell>
                      <TableCell>
                        {log.city || log.country ? (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 text-primary shrink-0" />
                            <span>
                              {log.city ? `${log.city}, ` : ""}
                              {log.country || ""}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {log.device_type === "Mobile" ? (
                            <Smartphone className="h-3.5 w-3.5 text-blue-500" />
                          ) : log.device_type === "Tablet" ? (
                            <Smartphone className="h-3.5 w-3.5 text-amber-500" />
                          ) : (
                            <Monitor className="h-3.5 w-3.5 text-emerald-500" />
                          )}
                          <span>{log.device_type || "Desktop"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[180px] truncate" title={`${log.isp || ""} ${log.asn || ""}`}>
                          {log.isp ? (
                            <span className="font-medium">{log.isp}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                          {log.asn && (
                            <span className="ml-1 text-[10px] text-muted-foreground">({log.asn})</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant={log.is_returning || log.visit_count > 1 ? "default" : "secondary"}
                            className="text-[10px] px-1.5 py-0"
                          >
                            {log.is_returning || log.visit_count > 1 ? "Returning" : "New"}
                          </Badge>
                          <span className="text-muted-foreground font-mono">
                            ×{log.visit_count || 1}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-muted-foreground max-w-[120px] truncate">
                        {Array.isArray(log.path_history) && log.path_history.length > 0
                          ? log.path_history[0]
                          : "/"}
                      </TableCell>
                      <TableCell className="text-right">
                        {log.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteLog(log.id!)}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            title="Delete entry"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
