import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Store, Hotel, UtensilsCrossed, Users, ShoppingBag, Building2, Warehouse, Boxes } from "lucide-react";
import { motion } from "framer-motion";
const targets = [
  { icon: Store, label: "Supermarkets" },
  { icon: Hotel, label: "Hotels" },
  { icon: UtensilsCrossed, label: "Restaurants" },
  { icon: Users, label: "Caterers" },
  { icon: ShoppingBag, label: "Food Vendors" },
  { icon: Building2, label: "Retail Stores" },
  { icon: Warehouse, label: "Wholesalers" },
  { icon: Boxes, label: "Distributors" },
];

export function Bulk() {
  return (
    <section id="bulk" className="py-24 md:py-32 bg-primary-deep text-white relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(circle at 70% 30%, var(--gold), transparent 50%)" }}
      />
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-[var(--gold)] font-semibold mb-4">
            Bulk & Commercial Supply
          </div>
          <h2 className="text-4xl md:text-5xl mb-6 text-white">
            Built to keep your <em className="text-[var(--gold)] not-italic">shelves, kitchens and pots</em> full — every week of the year.
          </h2>
          <p className="text-white/75 leading-relaxed text-lg mb-8">
            We supply hotels, supermarkets, restaurants, caterers, and distributors with reliable volume,
            stable pricing, and consistent quality. If your business runs on palm oil, your supplier should run like a business.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              "Volume availability across 500ml, 1L, 3L, 5L, and 25L formats",
              "Stable, competitive wholesale pricing",
              "Scheduled fulfilment and long-term supply partnerships",
              "Dedicated account contact for every bulk client",
            ].map((l) => (
              <li key={l} className="flex gap-3 text-white/85">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--gold)] shrink-0" />
                {l}
              </li>
            ))}
          </ul>
          <Button asChild variant="hero" size="xl">
            <Link to="/bulk-supply" hash="bulk-quote">Discuss Bulk Supply</Link>
          </Button>
        </div>
        <div className="space-y-6">
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-10 flex items-center justify-center min-h-[280px] overflow-hidden">
            <div aria-hidden className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, var(--gold), transparent 60%)" }} />
            <motion.img
              src="/images/25L.png"
              alt="LeemsDTT 25L commercial jerrycan"
              className="relative h-64 w-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {targets.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 text-center hover:bg-white/10 transition-colors"
              >
                <t.icon className="h-5 w-5 mx-auto mb-2 text-[var(--gold)]" />
                <div className="text-[11px] text-white/85 font-medium">{t.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}