import { motion } from "framer-motion";

const steps = [
  { n: "01", title: "Sourcing", body: "Carefully selected palm fruit from trusted Nigerian growers — quality starts before processing." },
  { n: "02", title: "Processing", body: "Controlled extraction under hygienic conditions to preserve aroma, colour, and purity." },
  { n: "03", title: "Quality Checks", body: "Every batch passes visual, density, and clarity inspection before it reaches a bottle." },
  { n: "04", title: "Packaging", body: "Food-grade bottles and jugs filled, sealed and labelled under controlled conditions." },
  { n: "05", title: "Storage", body: "Climate-conscious warehousing to protect the oil's integrity until dispatch." },
  { n: "06", title: "Distribution", body: "Organised logistics with traceable handover — no mystery middlemen between us and you." },
];

export function Quality() {
  return (
    <section id="quality" className="py-24 md:py-32 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <div className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-4">
            Quality Assurance
          </div>
          <h2 className="text-4xl md:text-5xl text-foreground">
            Operational discipline you can <em className="text-primary not-italic">actually see</em> — not just claims.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden shadow-card">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-background p-8"
            >
              <div className="font-display text-4xl text-[var(--gold)] mb-3">{s.n}</div>
              <div className="font-display text-xl text-foreground mb-2">{s.title}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}