import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Hotel, Store, Warehouse, ArrowRight, Building2 } from "lucide-react";
import { getSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/industries/")({
  head: () => {
    const seo = getSeoMeta({
      title: "Commercial Industry Solutions — LeemsDTT Palm Oil Supply",
      description: "Tailored red palm oil commercial supply solutions across Nigeria for restaurants, hotels, supermarkets, caterers, and wholesale distributors.",
      path: "/industries",
    });

    const breadcrumbs = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Industry Solutions", path: "/industries" },
    ]);

    return {
      ...seo,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
      ],
    };
  },
  component: IndustriesHubPage,
});

const industryCards = [
  {
    slug: "restaurants",
    title: "Restaurants & Caterers",
    desc: "Consistent oil color, high thermal stability, and clean aroma for high-volume kitchen frying and soup preparation.",
    icon: UtensilsCrossed,
    recommended: "3L & 5L Packaging Packs",
  },
  {
    slug: "hotels",
    title: "Hotels & Hospitality Kitchens",
    desc: "Dependable scheduled supply contracts, food-safety batch records, and bulk volume availability for hotel dining rooms.",
    icon: Hotel,
    recommended: "5L & 25L Commercial Jerrycans",
  },
  {
    slug: "supermarkets",
    title: "Supermarkets & Retail Stores",
    desc: "Premium tamper-evident packaged bottles (500ml, 1L, 3L, 5L) with sleek shelf branding that attracts quality-conscious shoppers.",
    icon: Store,
    recommended: "500ml, 1L & 5L Shelf Formats",
  },
  {
    slug: "wholesalers",
    title: "Wholesalers & Distributors",
    desc: "Tiered wholesale pricing, territorial distributor protection, and regional logistics dispatch from our Kano operations base.",
    icon: Warehouse,
    recommended: "25L Jerrycans & Full Pallets",
  },
];

function IndustriesHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <section className="py-16 bg-gradient-hero text-white text-center">
          <div className="container mx-auto px-6 max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 text-xs font-semibold uppercase tracking-wider text-white/90">
              <Building2 className="h-4 w-4 text-[var(--gold)]" /> Tailored B2B Supply Solutions
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold">
              Palm Oil Built for How Your Industry Cooks & Operates
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              We supply Nigerian businesses with predictable fulfillment, batch consistency, and transparent pricing tailored to commercial scale.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {industryCards.map((ind) => (
                <div key={ind.slug} className="rounded-2xl border border-border bg-background p-8 hover:shadow-card transition-all flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <ind.icon className="h-6 w-6" />
                    </div>
                    <h2 className="font-display text-2xl text-foreground font-semibold">{ind.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-sm">{ind.desc}</p>
                    <div className="text-xs font-semibold text-primary bg-secondary/60 p-3 rounded-lg border border-border">
                      Primary Formats: {ind.recommended}
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/industries/${ind.slug}` as any}>
                      Explore {ind.title} Supply <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
