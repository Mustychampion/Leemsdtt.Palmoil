import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Warehouse, CheckCircle2, ArrowRight } from "lucide-react";
import { getSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/industries/wholesalers")({
  head: () => {
    const seo = getSeoMeta({
      title: "Wholesale Palm Oil Distributor Supply — LeemsDTT Nigeria",
      description: "Wholesale palm oil supplier for major commodity traders, regional distributors, and market wholesalers in Nigeria. Tiered pricing and scheduled haulage dispatch from Kano.",
      path: "/industries/wholesalers",
    });

    const breadcrumbs = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
      { name: "Wholesalers & Distributors", path: "/industries/wholesalers" },
    ]);

    return {
      ...seo,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
      ],
    };
  },
  component: WholesalerIndustryPage,
});

function WholesalerIndustryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <section className="py-16 bg-primary-deep text-white">
          <div className="container mx-auto px-6 max-w-4xl space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
              <Warehouse className="h-4 w-4" /> B2B Wholesale & Distributor Supply
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold">
              Wholesale Palm Oil Supply & Distribution Partnerships
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Expand your regional distribution route with LeemsDTT. We partner with established commodity wholesalers, market distributors, and depot operators across Nigeria.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6 max-w-4xl space-y-12">
            <div className="space-y-6">
              <h2 className="font-display text-3xl font-bold text-foreground">
                Wholesale Commercial Terms & Benefits
              </h2>
              <ul className="space-y-4">
                {[
                  "Territorial distribution arrangements for key markets and states",
                  "Direct factory-gate pricing for high-volume pallet & truckload buyers",
                  "Consistently available 25L commercial drums alongside 5L and 1L consumer packs",
                  "Marketing collateral, promotional branding & sales support from ValorTrust",
                  "Scheduled logistics dispatch handling from our central Kano operations hub",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-base text-foreground/90">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-secondary/40 border border-border rounded-2xl p-8 text-center space-y-6">
              <h3 className="font-display text-2xl font-semibold text-foreground">
                Apply for Wholesale & Distributor Terms
              </h3>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                Join our growing network of regional palm oil distributors across Kano, Abuja, Kaduna, Lagos, and nationwide routes.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild variant="gold" size="lg">
                  <Link to="/distributors">Become a Distributor <ArrowRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
