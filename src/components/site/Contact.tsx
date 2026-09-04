import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, Clock, MessageSquare, MapPin } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/integrations/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendEmailNotification } from "@/lib/email";

export function Contact() {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const full_name = fd.get("full_name") as string;
    const phone = fd.get("phone") as string;
    const email = fd.get("email") as string;
    const preferred_size = fd.get("preferred_size") as string;
    const quantity = fd.get("quantity") as string;
    const message = fd.get("message") as string;

    setLoading(true);
    let error = null;

    try {
      // 1. Save to Firestore (inquiries)
      await addDoc(collection(db, "inquiries"), {
        full_name,
        phone,
        email,
        preferred_size: preferred_size || null,
        quantity: quantity || null,
        message: message || null,
        status: "new",
        created_at: serverTimestamp(),
      });

      // Also save to legacy collection just in case
      addDoc(collection(db, "contact_inquiries"), {
        full_name,
        phone,
        email,
        preferred_size: preferred_size || null,
        quantity: quantity || null,
        message: message || null,
        status: "new",
        created_at: serverTimestamp(),
      }).catch(() => {});
    } catch (err: any) {
      error = err;
    }

    // 2. Dispatch Direct Email Notification to leemsdtt.valortrust@gmail.com
    await sendEmailNotification({
      formType: "Contact Inquiry",
      fullName: full_name,
      phone,
      email,
      preferredSize: preferred_size,
      quantity,
      message,
    });

    setLoading(false);

    if (error) {
      toast.error("Couldn't save to database, but notification was sent", { description: error.message });
    }

    toast.success("Inquiry received!", {
      description: "A direct email notification has been dispatched to leemsdtt.valortrust@gmail.com and our team will get back to you within 4 hours.",
    });
    form.reset();
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-4">
              Get in Touch
            </div>
            <h2 className="text-4xl md:text-5xl text-foreground">
              Ready for palm oil you can <em className="text-primary not-italic">depend on</em>?
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Whether you need a single carton for home cooking, regular restaurant deliveries, or wholesale jerrycans for distribution — we are ready.
          </p>
          <div className="space-y-6 pt-2">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Direct Phone</div>
                <div className="text-foreground font-medium mt-0.5">+234 803 953 5043</div>
                <div className="text-foreground font-medium">+234 703 437 2698</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">WhatsApp</div>
                <a
                  href="https://wa.me/2348039535043"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium mt-0.5 inline-block"
                >
                  Chat with Sales (+234 803 953 5043)
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email</div>
                <a href="mailto:leemsdtt.valortrust@gmail.com" className="text-foreground hover:text-primary font-medium mt-0.5 inline-block">
                  leemsdtt.valortrust@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Base of Operations</div>
                <div className="text-foreground font-medium mt-0.5">ValorTrust Integrated Services Ltd (RC 9268182)</div>
                <div className="text-muted-foreground text-sm">Kano, Nigeria — Nationwide Delivery</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Business Hours</div>
                <div className="text-foreground font-medium mt-0.5">Mon – Sat: 8:00 AM – 6:00 PM WAT</div>
                <div className="text-muted-foreground text-xs">Inquiries outside hours answered next morning</div>
              </div>
            </div>
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
              <Input id="c-phone" name="phone" required type="tel" placeholder="+234..." />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="c-email">Email</Label>
              <Input id="c-email" name="email" required type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-size">Preferred size</Label>
              <Input id="c-size" name="preferred_size" placeholder="500ml / 1L / 3L / 5L / 25L" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-qty">Quantity</Label>
              <Input id="c-qty" name="quantity" placeholder="e.g. 20 cartons / monthly" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="c-msg">Message</Label>
              <Textarea id="c-msg" name="message" rows={4} placeholder="Tell us about your needs..." />
            </div>
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Inquiry"}
          </Button>
        </form>
      </div>
    </section>
  );
}