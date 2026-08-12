import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, Truck, Award } from "lucide-react";
import { motion } from "framer-motion";
const bottles = [
  { src: "/images/5L2.png", alt: "LeemsDTT 5L red palm oil jug", h: "h-[420px]", delay: 0.1 },
  { src: "/images/3L2.png", alt: "LeemsDTT 3L red palm oil jug", h: "h-[360px]", delay: 0.25 },
  { src: "/images/1L2.png", alt: "LeemsDTT 1L red palm oil bottle", h: "h-[300px]", delay: 0.4 },
];

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-gradient-hero text-white pt-24">
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, oklch(0.78 0.15 82 / 0.4), transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.48 0.13 150 / 0.5), transparent 50%)",
        }}
      />
      <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10 py-16">
        <div className="lg:col-span-6 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm"
          >
            <span className="h-2 w-2 rounded-full bg-[var(--gold)] animate-pulse" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/90">
              A ValorTrust Integrated Services Brand
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-white"
          >
            Trusted Palm Oil Supply for{" "}
            <span className="italic text-[var(--gold)]">Homes, Businesses</span>{" "}
            & Bulk Buyers Across Nigeria.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-lg text-white/80 max-w-xl leading-relaxed"
          >
            Professionally processed, carefully packaged, and supplied with consistency.
            Whether you are buying for your household, retail store, restaurant, supermarket,
            or distribution network — LeemsDTT delivers quality you can depend on.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Button asChild variant="hero" size="xl">
              <Link to="/contact">Request a Quote</Link>
            </Button>
            <Button asChild variant="heroOutline" size="xl">
              <Link to="/distributors">Become a Distributor</Link>
            </Button>
          </motion.div>
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-lg">
            {[
              { icon: ShieldCheck, label: "100% Pure", sub: "No adulteration" },
              { icon: Award, label: "Quality First", sub: "Batch tested" },
              { icon: Truck, label: "Nationwide", sub: "Reliable delivery" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 + i * 0.1 }}
                className="space-y-1"
              >
                <s.icon className="h-5 w-5 text-[var(--gold)]" />
                <div className="text-sm font-semibold text-white">{s.label}</div>
                <div className="text-xs text-white/60">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-6 relative">
          <div className="relative flex items-end justify-center gap-4 md:gap-6 min-h-[440px]">
            {bottles.map((b, i) => (
              <motion.div
                key={b.src}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: [40, -8, 0] }}
                transition={{ duration: 1, delay: b.delay, times: [0, 0.7, 1] }}
                className={`relative ${b.h} ${i === 0 ? "z-10" : "z-0"}`}
              >
                <motion.img
                  src={b.src}
                  alt={b.alt}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="h-full w-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)]"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: b.delay + 1 }}
                />
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-6 md:mt-0 md:absolute md:-bottom-8 md:-left-4 lg:-left-8 z-20 flex bg-background text-foreground rounded-2xl p-4 md:p-5 shadow-elegant items-center gap-4 max-w-xs"
          >
            <div className="h-12 w-12 rounded-xl bg-gradient-gold flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-[var(--gold-foreground)]" />
            </div>
            <div>
              <div className="text-sm font-semibold">RC 9268182</div>
              <div className="text-xs text-muted-foreground">Registered Nigerian Enterprise</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}