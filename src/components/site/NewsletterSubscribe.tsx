import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, BellRing, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { db } from "@/integrations/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendNotificationAlert } from "@/lib/notifications";

interface Props {
  variant?: "footer" | "card" | "inline";
  source?: string;
  className?: string;
}

export function NewsletterSubscribe({ variant = "footer", source = "Website Footer", className = "" }: Props) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("Wholesale & Bulk Supply");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // 1. Save subscriber record to Firestore
      await addDoc(collection(db, "subscribers"), {
        email: email.trim().toLowerCase(),
        phone: phone.trim() || null,
        interest,
        source,
        status: "active",
        created_at: serverTimestamp(),
      });

      // 2. Dispatch immediate notification to owner (Email + WhatsApp alert)
      await sendNotificationAlert({
        formType: "Newsletter Subscription",
        email: email.trim(),
        phone: phone.trim() || undefined,
        businessType: interest,
        source,
        message: `New subscriber opted in for palm oil updates and market trends from ${source}. Primary interest: ${interest}.`,
      });

      setSubscribed(true);
      toast.success("Subscribed successfully!", {
        description: "You'll receive market price updates, supply schedules, and palm oil insights.",
      });
      setEmail("");
      setPhone("");
    } catch (err: any) {
      console.error("Subscription error:", err);
      // Even if Firestore has an issue, attempt notification
      sendNotificationAlert({
        formType: "Newsletter Subscription",
        email: email.trim(),
        phone: phone.trim() || undefined,
        businessType: interest,
        source,
        message: `New subscriber joined from ${source}: ${email.trim()}`,
      }).catch(() => {});

      toast.success("Subscription received!", {
        description: "Thank you for subscribing to LeemsDTT updates.",
      });
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  if (variant === "card") {
    return (
      <div className={`rounded-3xl bg-gradient-to-br from-primary/10 via-background to-primary/5 border border-primary/20 p-8 sm:p-10 shadow-elegant ${className}`}>
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            <BellRing className="h-3.5 w-3.5 text-[var(--gold)]" /> Market Alerts &amp; Pricing
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Stay Ahead of Palm Oil Market Prices &amp; Sourcing Updates
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Get timely notifications when bulk wholesale prices adjust, seasonal harvesting updates occur, and practical supply chain advice is published.
          </p>

          {subscribed ? (
            <div className="pt-4 flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
              <CheckCircle2 className="h-5 w-5" />
              <span>You are subscribed! We will keep you updated.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pt-4 max-w-md mx-auto space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background text-foreground border-border"
                />
                <Button type="submit" variant="gold" disabled={loading} className="shrink-0 font-semibold">
                  {loading ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
              <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" /> No spam guaranteed
                </span>
                <span>•</span>
                <span>Unsubscribe anytime</span>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Footer Variant
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[var(--gold)]" />
        <span className="text-white font-semibold text-sm uppercase tracking-wider">
          Market &amp; Supply Updates
        </span>
      </div>
      <p className="text-xs text-white/70 leading-relaxed">
        Subscribe to receive direct notifications on price adjustments, bulk batch releases, and distribution schedules.
      </p>

      {subscribed ? (
        <div className="flex items-center gap-2 text-emerald-400 text-xs py-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Subscribed! Thank you for joining our network.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
              <Input
                type="email"
                required
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 bg-white/10 border-white/15 text-white placeholder:text-white/40 text-xs h-9 focus-visible:ring-[var(--gold)]"
              />
            </div>
            <Button
              type="submit"
              variant="gold"
              size="sm"
              disabled={loading}
              className="text-xs font-semibold h-9 px-4 shrink-0 shadow-sm"
            >
              {loading ? "..." : "Join"}
            </Button>
          </div>
          <p className="text-[10px] text-white/50">
            Direct notification sent to LeemsDTT sales team for priority processing.
          </p>
        </form>
      )}
    </div>
  );
}
