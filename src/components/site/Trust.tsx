import { CheckCircle2, Factory, Truck, Headphones } from "lucide-react";

const items = [
  {
    icon: CheckCircle2,
    title: "Consistent Product Quality",
    body: "Customers receive the same trusted quality standard every time they order — no surprises, no adulteration.",
  },
  {
    icon: Factory,
    title: "Professional Processing",
    body: "Every batch is processed under controlled conditions designed to preserve aroma, colour, and product integrity.",
  },
  {
    icon: Truck,
    title: "Reliable Supply Chain",
    body: "Orders are handled through organised sourcing, packaging, and distribution systems built for dependability.",
  },
  {
    icon: Headphones,
    title: "Customer Accountability",
    body: "Direct channels for inquiries, feedback, and support — you always know who is on the other side.",
  },
];

export function Trust() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <div className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-4">
            Why Buyers Choose LeemsDTT
          </div>
          <h2 className="text-4xl md:text-5xl text-foreground">
            Built for buyers who can't afford <em className="text-primary not-italic">adulterated</em>,
            inconsistent, or unreliable palm oil.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden shadow-card">
          {items.map((i) => (
            <div key={i.title} className="bg-background p-8 md:p-10 group hover:bg-secondary/60 transition-colors">
              <div className="h-14 w-14 rounded-xl bg-gradient-leaf flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <i.icon className="h-7 w-7 text-[var(--gold)]" />
              </div>
              <h3 className="text-2xl mb-3 text-foreground">{i.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{i.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}