import { Star } from "lucide-react";

const reviews = [
  {
    name: "Mrs. Aisha B.",
    role: "Household customer · Kano",
    body: "I stopped trusting palm oil from the market because of adulteration. LeemsDTT has been the same quality for over a year now. My jollof tells the truth.",
  },
  {
    name: "Chukwuma E.",
    role: "Restaurant owner · Abuja",
    body: "We get our 5L jugs weekly without fail. The colour and aroma are consistent — customers notice when food tastes the same every visit.",
  },
  {
    name: "Salisu Trading Ltd.",
    role: "Distributor · Kaduna",
    body: "Working with LeemsDTT has been straightforward. Pricing is honest, deliveries arrive when they say, and the account manager actually picks up.",
  },
  {
    name: "Funmi A.",
    role: "Supermarket buyer · Lagos",
    body: "Their 1L packaging moves fastest on our shelves. Clean labels, no leakage in transit, and re-orders are processed quickly.",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <div className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-4">
            What Customers Say
          </div>
          <h2 className="text-4xl md:text-5xl text-foreground">
            Real buyers. Real kitchens. Real <em className="text-primary not-italic">repeat orders</em>.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <figure key={r.name} className="rounded-2xl border border-border bg-secondary/40 p-8 hover:shadow-card transition-shadow">
              <div className="flex gap-1 mb-4 text-[var(--gold)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg text-foreground leading-relaxed mb-6 font-display italic">
                "{r.body}"
              </blockquote>
              <figcaption>
                <div className="font-semibold text-foreground">{r.name}</div>
                <div className="text-sm text-muted-foreground">{r.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}