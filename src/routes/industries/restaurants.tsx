import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, CheckCircle2, ArrowRight } from "lucide-react";
import { getSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/industries/restaurants")({
  head: () => {
    const seo = getSeoMeta({
      title: "Palm Oil Supplier for Restaurants & Caterers — LeemsDTT Nigeria",
      description: "Bulk red palm oil supply for restaurants, eateries, caterers, and canteens across Nigeria. Pure, unadulterated oil in 3L, 5L, and 25L packaging with stable pricing.",
      path: "/industries/restaurants",
    });

    const breadcrumbs = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
      { name: "Restaurants & Caterers", path: "/industries/restaurants" },
    ]);

    return {
      ...seo,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
      ],
    };
  },
  component: RestaurantIndustryPage,
});

function RestaurantIndustryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <section className="py-16 bg-primary-deep text-white">
          <div className="container mx-auto px-6 max-w-4xl space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
              <UtensilsCrossed className="h-4 w-4" /> Commercial Kitchen & Restaurant Supply
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold">
              Pure Palm Oil Supply for Restaurants & Caterers
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Never let adulterated oil ruin your kitchen reputation. LeemsDTT provides steady weekly supplies of rich, unadulterated red palm oil for Nigerian eateries and commercial caterers.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6 max-w-4xl space-y-12">
            <div className="space-y-6">
              <h2 className="font-display text-3xl font-bold text-foreground">
                Why Restaurant Chefs & Caterers Rely on LeemsDTT
              </h2>
              <ul className="space-y-4">
                {[
                  "100% pure extraction with zero Sudan dyes or synthetic additives",
                  "High thermal stability preserving taste & rich color in soups, stews, and fries",
                  "Convenient 3L, 5L, and 25L packaging built for rapid kitchen handling",
                  "Scheduled weekly replenishment so your kitchen never runs short during peak hours",
                  "Competitive commercial wholesale rates with transparent invoice billing",
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
                Set Up Your Restaurant Supply Contract
              </h3>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                Talk to our commercial sales team today. We assess your weekly volume requirements and set up a predictable delivery schedule.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild variant="gold" size="lg">
                  <Link to="/bulk-supply">Request Restaurant Quote <ArrowRight className="h-4 w-4 ml-1" /></Link>
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
