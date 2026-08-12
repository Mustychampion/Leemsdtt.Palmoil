import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Handshake, MapPin, TrendingUp, LifeBuoy } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { db } from "@/integrations/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const schema = z.object({
  full_name: z.string().trim().min(1, "Required").max(120),
  business_name: z.string().trim().min(1, "Required").max(160),
  phone: z.string().trim().min(5, "Required").max(40),
  email: z.string().trim().email("Invalid email").max(255),
  region: z.string().trim().min(1, "Required").max(160),
  capacity: z.string().trim().max(2000).optional().or(z.literal("")),
});

const benefits = [
  { icon: Handshake, title: "Regional Partnerships", body: "Become the LeemsDTT presence in your state or zone with protected coverage." },
  { icon: MapPin, title: "Wholesale Arrangements", body: "Negotiated wholesale pricing with predictable replenishment cycles." },
  { icon: TrendingUp, title: "Business Growth Support", body: "Marketing collateral, product training, and sales support to grow your route." },
  { icon: LifeBuoy, title: "Direct Account Manager", body: "A real human assigned to your account — not a generic call-centre queue." },
];

export function Distributors() {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse({
      full_name: fd.get("full_name"),
      business_name: fd.get("business_name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      region: fd.get("region"),
      capacity: fd.get("capacity") ?? "",
    });
    if (!parsed.success) {
      toast.error("Please check the form", { description: parsed.error.issues[0]?.message });
      return;
    }
    setLoading(true);
    let error = null;
    try {
      await addDoc(collection(db, "distributor_applications"), {
        full_name: parsed.data.full_name,
        business_name: parsed.data.business_name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        region: parsed.data.region,
        capacity: parsed.data.capacity || null,
        status: "new",
        created_at: serverTimestamp()
      });
    } catch (e: any) {
      error = e;
    }
    setLoading(false);
    if (error) {
      toast.error("Couldn't submit application", { description: error.message });
      return;
    }
    toast.success("Application received", {
      description: "Our distributor team will reach out within 2 business days.",
    });
    form.reset();
  };
  return (
    <section id="distributors" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 grid lg:grid-cols-5 gap-16">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-4">
              Distributor Opportunity
            </div>
            <h2 className="text-4xl md:text-5xl text-foreground">
              Sell a product your customers <em className="text-primary not-italic">come back for</em>.
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We are actively expanding our distributor network across Nigeria. If you have route presence,
            storage, and a real customer base, we want to talk to you.
          </p>
          <div className="space-y-4">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-4">
                <div className="h-11 w-11 shrink-0 rounded-lg bg-gradient-leaf flex items-center justify-center">
                  <b.icon className="h-5 w-5 text-[var(--gold)]" />
                </div>
                <div>
                  <div className="font-semibold text-foreground mb-0.5">{b.title}</div>
                  <div className="text-sm text-muted-foreground">{b.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <form
          onSubmit={onSubmit}
          className="lg:col-span-3 bg-secondary/60 border border-border rounded-2xl p-8 md:p-10 shadow-card space-y-5"
        >
          <div className="font-display text-2xl text-foreground mb-2">Apply to Become a Distributor</div>
          <p className="text-sm text-muted-foreground -mt-3">Tell us about your business — we review every application personally.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="d-name">Full name</Label>
              <Input id="d-name" name="full_name" required placeholder="Adebayo Okoro" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="d-biz">Business name</Label>
              <Input id="d-biz" name="business_name" required placeholder="Okoro Foods Enterprise" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="d-phone">Phone / WhatsApp</Label>
              <Input id="d-phone" name="phone" required type="tel" placeholder="+234 80…" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="d-email">Email</Label>
              <Input id="d-email" name="email" required type="email" placeholder="you@business.com" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="d-region">Region of operation</Label>
              <Input id="d-region" name="region" required placeholder="e.g. Kano State, North-West Zone" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="d-msg">Tell us about your distribution capacity</Label>
              <Textarea id="d-msg" name="capacity" rows={4} placeholder="Storage, current routes, monthly volume you can handle…" />
            </div>
          </div>
          <Button type="submit" variant="deep" size="lg" className="w-full" disabled={loading}>
            {loading ? "Submitting…" : "Submit Application"}
          </Button>
        </form>
      </div>
    </section>
  );
}