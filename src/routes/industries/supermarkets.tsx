import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Store, CheckCircle2, ArrowRight } from "lucide-react";
import { getSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/industries/supermarkets")({
  head: () => {
    const seo = getSeoMeta({
      title: "Retail & Supermarket Palm Oil Supply — LeemsDTT Nigeria",
      description: "Supply your supermarket and retail store shelves with LeemsDTT packaged red palm oil in 500ml, 1L, 3L, and 5L tamper-evident bottles. High shelf turnover and consumer trust.",
      path: "/industries/supermarkets",
    });

    const breadcrumbs = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
      { name: "Supermarkets & Retail", path: "/industries/supermarkets" },
    ]);

    return {
      ...seo,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
      ],
    };
  },
  component: SupermarketIndustryPage,
});

function SupermarketIndustryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <section className="py-16 bg-primary-deep text-white">
          <div className="container mx-auto px-6 max-w-4xl space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
              <Store className="h-4 w-4" /> Retail & Supermarket Shelf Supply
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold">
              Premium Packaged Palm Oil for Supermarket Shelves
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Modern Nigerian retail shoppers demand clean, packaged, tamper-evident palm oil with transparent corporate lineage. LeemsDTT delivers instant shelf appeal and repeat customer loyalty.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6 max-w-4xl space-y-12">
            <div className="space-y-6">
              <h2 className="font-display text-3xl font-bold text-foreground">
                Supermarket Shelf Advantages with LeemsDTT
              </h2>
              <ul className="space-y-4">
                {[
                  "Clean PET and HDPE packaging designed for zero leaks on retail shelves",
                  "Vibrant product visibility showcasing natural red palm oil clarity",
                  "Complete barcode & batch trace labelling for inventory scanning",
                  "Carton packaging structured for straightforward warehouse stocking",
                  "High consumer repeat purchase rates driven by unadulterated quality",
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
                Stock LeemsDTT in Your Stores
              </h3>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                Stock your supermarket chain or grocery store network with 500ml, 1L, 3L, and 5L LeemsDTT units.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild variant="gold" size="lg">
                  <Link to="/contact">Request Retail Supply Terms <ArrowRight className="h-4 w-4 ml-1" /></Link>
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
