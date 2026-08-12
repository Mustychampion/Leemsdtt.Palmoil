import valor from "@/assets/valortrust-logo.png";
import { motion } from "framer-motion";
import { ShieldCheck, Droplets, Package, Truck } from "lucide-react";

const pillars = [
  { icon: Droplets, label: "Pure Extraction" },
  { icon: ShieldCheck, label: "Batch Tested" },
  { icon: Package, label: "Sealed & Labelled" },
  { icon: Truck, label: "Delivered Nationwide" },
];

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-secondary/50">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl bg-gradient-to-br from-primary-deep to-primary p-10 md:p-14 text-white overflow-hidden shadow-elegant min-h-[420px] flex flex-col justify-between"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-25"
            style={{ backgroundImage: "radial-gradient(circle at 30% 20%, var(--gold), transparent 55%)" }}
          />
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-4">Built by</div>
            <div className="font-display text-4xl md:text-5xl leading-tight">
              Valor<span className="text-[var(--gold)]">Trust</span><br />Integrated Services
            </div>
            <p className="text-white/70 mt-4 text-sm max-w-sm">
              LeemsDTT is a flagship brand of ValorTrust — a registered Nigerian enterprise (RC 9268182) built for reliable food-grade supply.
            </p>
          </div>
          <div className="relative grid grid-cols-2 gap-3 mt-10">
            {pillars.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm p-4 flex items-center gap-3"
              >
                <p.icon className="h-5 w-5 text-[var(--gold)] shrink-0" />
                <span className="text-sm text-white/90 font-medium">{p.label}</span>
              </motion.div>
            ))}
          </div>
          <div className="relative mt-8 bg-background/95 text-foreground rounded-xl p-4 flex items-center gap-3 max-w-xs">
            <img src={valor} alt="ValorTrust Integrated Services" className="h-10" />
            <div className="text-[11px] text-muted-foreground leading-snug">RC 9268182 — Registered Nigerian Enterprise</div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="space-y-6"
        >
          <div className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">About LeemsDTT</div>
          <h2 className="text-4xl md:text-5xl text-foreground">
            A serious operation built on a simple promise — palm oil you can trust, every single time.
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            We exist because too many Nigerian buyers — from households to hotels — have been let down by
            adulterated product, unstable supply, and suppliers who disappear after the first order. LeemsDTT
            was built to be the dependable opposite.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 pt-4">
            <div>
              <div className="font-display text-xl text-primary mb-2">Our Mission</div>
              <p className="text-sm text-muted-foreground">Deliver clean, consistent, professionally processed palm oil to every Nigerian buyer who refuses to compromise.</p>
            </div>
            <div>
              <div className="font-display text-xl text-primary mb-2">Our Vision</div>
              <p className="text-sm text-muted-foreground">To become Nigeria's most trusted palm oil supply network for homes, businesses, and institutions.</p>
            </div>
            <div>
              <div className="font-display text-xl text-primary mb-2">Quality Commitment</div>
              <p className="text-sm text-muted-foreground">Strict batch control from sourcing through packaging — nothing leaves us until it meets our standard.</p>
            </div>
            <div>
              <div className="font-display text-xl text-primary mb-2">Customer Promise</div>
              <p className="text-sm text-muted-foreground">Honest communication, on-time delivery, and a team that picks up when you call.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}