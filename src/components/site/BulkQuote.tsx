import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/integrations/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendEmailNotification } from "@/lib/email";

const schema = z.object({
  full_name: z.string().trim().min(1).max(120),
  business_name: z.string().trim().min(1).max(160),
  business_type: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(5).max(40),
  email: z.string().trim().email().max(255),
  preferred_size: z.string().trim().max(80).optional().or(z.literal("")),
  monthly_volume: z.string().trim().max(120).optional().or(z.literal("")),
  delivery_location: z.string().trim().max(160).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export function BulkQuote() {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const obj = Object.fromEntries(fd.entries()) as Record<string, string>;
    const parsed = schema.safeParse(obj);
    if (!parsed.success) {
      toast.error("Please check the form", { description: parsed.error.issues[0]?.message });
      return;
    }
    setLoading(true);
    const payload = Object.fromEntries(
      Object.entries(parsed.data).map(([k, v]) => [k, v === "" ? null : v])
    );
    let error = null;
    try {
      await addDoc(collection(db, "bulk_quotes"), {
        ...(payload as any),
        status: "new",
        created_at: serverTimestamp()
      });
    } catch (e: any) {
      error = e;
    }

    // Direct email dispatch to leemsdtt.valortrust@gmail.com
    await sendEmailNotification({
      formType: "Bulk Quote Request",
      fullName: parsed.data.full_name,
      companyName: parsed.data.business_name,
      businessType: parsed.data.business_type,
      phone: parsed.data.phone,
      email: parsed.data.email,
      preferredSize: parsed.data.preferred_size,
      volume: parsed.data.monthly_volume,
      location: parsed.data.delivery_location,
      message: parsed.data.notes,
    });

    setLoading(false);
    if (error) {
      toast.error("Couldn't save to database, but email notification was sent", { description: error.message });
    }
    toast.success("Quote request received", { description: "Direct email notification dispatched to leemsdtt.valortrust@gmail.com and our sales team will contact you within 4 hours." });
    form.reset();
  };

  return (
    <section id="bulk-quote" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-4 text-center">
          Request a Bulk Quote
        </div>
        <h2 className="text-4xl md:text-5xl text-foreground text-center mb-4">
          Tell us what your business needs.
        </h2>
        <p className="text-muted-foreground text-lg text-center mb-12">
          For hotels, supermarkets, restaurants, caterers, and wholesalers. Stable pricing, scheduled fulfilment, dedicated account contact.
        </p>
        <form onSubmit={onSubmit} className="bg-secondary/60 border border-border rounded-2xl p-8 md:p-10 shadow-card space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bq-name">Full name</Label>
              <Input id="bq-name" name="full_name" required placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bq-biz">Business name</Label>
              <Input id="bq-biz" name="business_name" required placeholder="Acme Hotels Ltd" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bq-type">Business type</Label>
              <Input id="bq-type" name="business_type" required placeholder="Hotel / Supermarket / Restaurant / Wholesaler" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bq-phone">Phone / WhatsApp</Label>
              <Input id="bq-phone" name="phone" required type="tel" placeholder="+234…" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bq-email">Email</Label>
              <Input id="bq-email" name="email" required type="email" placeholder="purchasing@business.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bq-size">Preferred size</Label>
              <Input id="bq-size" name="preferred_size" placeholder="1L / 3L / 5L" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bq-vol">Monthly volume</Label>
              <Input id="bq-vol" name="monthly_volume" placeholder="e.g. 500 jugs / month" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bq-loc">Delivery location</Label>
              <Input id="bq-loc" name="delivery_location" placeholder="City, state" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bq-notes">Additional notes</Label>
              <Textarea id="bq-notes" name="notes" rows={4} placeholder="Frequency, lead time, packaging preferences…" />
            </div>
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Request Bulk Quote"}
          </Button>
        </form>
      </div>
    </section>
  );
}