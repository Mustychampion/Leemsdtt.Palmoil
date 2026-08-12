import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { db } from "@/integrations/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const schema = z.object({
  full_name: z.string().trim().min(1, "Required").max(120),
  phone: z.string().trim().min(5, "Required").max(40),
  email: z.string().trim().email("Invalid email").max(255),
  preferred_size: z.string().trim().max(80).optional().or(z.literal("")),
  quantity: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export function Contact() {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse({
      full_name: fd.get("full_name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      preferred_size: fd.get("preferred_size") ?? "",
      quantity: fd.get("quantity") ?? "",
      message: fd.get("message") ?? "",
    });
    if (!parsed.success) {
      toast.error("Please check the form", { description: parsed.error.issues[0]?.message });
      return;
    }
    setLoading(true);
    let error = null;
    try {
      await addDoc(collection(db, "inquiries"), {
        full_name: parsed.data.full_name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        preferred_size: parsed.data.preferred_size || null,
        quantity: parsed.data.quantity || null,
        message: parsed.data.message || null,
        status: "new",
        created_at: serverTimestamp()
      });
    } catch (e: any) {
      error = e;
    }
    setLoading(false);
    if (error) {
      toast.error("Couldn't send inquiry", { description: error.message });
      return;
    }
    toast.success("Inquiry sent", { description: "We typically respond within 4 business hours." });
    form.reset();
  };
  return (
    <section id="contact" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-4">
            Talk to Sales
          </div>
          <h2 className="text-4xl md:text-5xl text-foreground mb-6">
            Ready to order or get a <em className="text-primary not-italic">tailored quote</em>?
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Tell us what you need — household, retail, restaurant, supermarket or bulk distribution.
            Our team responds within <strong className="text-foreground">4 business hours</strong>.
          </p>
          <div className="space-y-5">
            {[
              { icon: Phone, label: "Phone", value: "+234 803 953 5043 / +234 703 437 2698" },
              { icon: MessageCircle, label: "WhatsApp", value: "+234 803 953 5043" },
              { icon: Mail, label: "Email", value: "sales@leemsdtt.com" },
              { icon: MapPin, label: "Office", value: "ValorTrust Integrated Services Ltd, Kano, Nigeria" },
              { icon: Clock, label: "Hours", value: "Mon – Sat · 8:00am – 6:00pm WAT" },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-lg bg-gradient-leaf flex items-center justify-center shrink-0">
                  <c.icon className="h-5 w-5 text-[var(--gold)]" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                  <div className="font-medium text-foreground">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={onSubmit} className="bg-secondary/60 border border-border rounded-2xl p-8 md:p-10 shadow-card space-y-5 self-start">
          <div className="font-display text-2xl text-foreground">Request a Quote</div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="c-name">Full name</Label>
              <Input id="c-name" name="full_name" required placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-phone">Phone</Label>
              <Input id="c-phone" name="phone" required type="tel" placeholder="+234…" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="c-email">Email</Label>
              <Input id="c-email" name="email" required type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-size">Preferred size</Label>
              <Input id="c-size" name="preferred_size" placeholder="500ml / 1L / 3L / 5L" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-qty">Quantity</Label>
              <Input id="c-qty" name="quantity" placeholder="e.g. 200 units / monthly" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="c-msg">Message</Label>
              <Textarea id="c-msg" name="message" rows={4} placeholder="Tell us about your needs…" />
            </div>
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send Inquiry"}
          </Button>
        </form>
      </div>
    </section>
  );
}