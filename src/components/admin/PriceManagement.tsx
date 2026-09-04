import { useEffect, useState } from "react";
import { db } from "@/integrations/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Tag, Save, RefreshCw } from "lucide-react";

export interface ProductPriceItem {
  id: string;
  size: string;
  name: string;
  price: number;
  formattedPrice: string;
  isBulkPricing: boolean;
}

export const DEFAULT_PRODUCT_PRICES: Record<string, { price: number; formattedPrice: string; isBulkPricing?: boolean }> = {
  "500ml": { price: 1500, formattedPrice: "₦1,500" },
  "1l": { price: 2800, formattedPrice: "₦2,800" },
  "3l": { price: 8200, formattedPrice: "₦8,200" },
  "5l": { price: 13500, formattedPrice: "₦13,500" },
  "25l": { price: 65000, formattedPrice: "Contact for Bulk Pricing", isBulkPricing: true },
};

export function PriceManagement() {
  const [prices, setPrices] = useState<Record<string, { price: number; formattedPrice: string; isBulkPricing?: boolean }>>(DEFAULT_PRODUCT_PRICES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadPrices = async () => {
    setLoading(true);
    try {
      const ref = doc(db, "product_prices", "current_prices");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setPrices({
          ...DEFAULT_PRODUCT_PRICES,
          ...data.items,
        });
      }
    } catch (e: any) {
      console.warn("Could not load Firestore product prices, using defaults:", e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPrices();
  }, []);

  const handlePriceChange = (key: string, val: string) => {
    const num = parseFloat(val) || 0;
    const formatted = `₦${num.toLocaleString()}`;
    setPrices((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        price: num,
        formattedPrice: prev[key]?.isBulkPricing ? "Contact for Bulk Pricing" : formatted,
      },
    }));
  };

  const handleBulkToggle = (key: string, checked: boolean) => {
    setPrices((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        isBulkPricing: checked,
        formattedPrice: checked ? "Contact for Bulk Pricing" : `₦${(prev[key]?.price || 0).toLocaleString()}`,
      },
    }));
  };

  const savePrices = async () => {
    setSaving(true);
    try {
      const ref = doc(db, "product_prices", "current_prices");
      await setDoc(ref, {
        items: prices,
        updated_at: new Date().toISOString(),
      }, { merge: true });
      toast.success("Product prices updated successfully");
    } catch (error: any) {
      toast.error("Failed to save prices", { description: error.message });
    }
    setSaving(false);
  };

  const items = [
    { key: "500ml", label: "500ml Household Bottle" },
    { key: "1l", label: "1 Liter Family Pack" },
    { key: "3l", label: "3 Liter Catering Pack" },
    { key: "5l", label: "5 Liter Vendor & Family Jug" },
    { key: "25l", label: "25 Liter Bulk Jerrycan" },
  ];

  return (
    <Card className="border border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Product Price Management</CardTitle>
              <CardDescription className="text-xs">
                Set public retail and wholesale prices displayed across the storefront.
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadPrices} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button size="sm" variant="gold" onClick={savePrices} disabled={saving}>
              <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save Prices"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(({ key, label }) => {
            const item = prices[key] || DEFAULT_PRODUCT_PRICES[key];
            return (
              <div key={key} className="p-4 rounded-lg border border-border bg-secondary/20 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold text-foreground text-sm">{label}</Label>
                  <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {item?.formattedPrice || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground mb-1 block">Price in Naira (₦)</Label>
                    <Input
                      type="number"
                      value={item?.price || 0}
                      onChange={(e) => handlePriceChange(key, e.target.value)}
                      disabled={item?.isBulkPricing}
                      className="h-9"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <Switch
                      id={`bulk-${key}`}
                      checked={!!item?.isBulkPricing}
                      onCheckedChange={(c) => handleBulkToggle(key, c)}
                    />
                    <Label htmlFor={`bulk-${key}`} className="text-xs text-muted-foreground cursor-pointer">
                      Bulk Tag
                    </Label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
