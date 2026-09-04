import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Hotel, CheckCircle2, ArrowRight } from "lucide-react";
import { getSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/industries/hotels")({
  head: () => {
    const seo = getSeoMeta({
      title: "Palm Oil Supply for Hotels & Hospitality — LeemsDTT Nigeria",
      description: "Premium food-grade red palm oil supply for hotels, resorts, and institutional hospitality kitchens across Nigeria. Batch testing, security sealing, and corporate invoicing.",
      path: "/industries/hotels",
    });

    const breadcrumbs = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
      { name: "Hotels & Hospitality", path: "/industries/hotels" },
    ]);

    return {
      ...seo,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
      ],
    };
  },
  component: HotelIndustryPage,
});

function HotelIndustryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <section className="py-16 bg-primary-deep text-white">
          <div className="container mx-auto px-6 max-w-4xl space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
              <Hotel className="h-4 w-4" /> Hotel & Institutional Kitchen Procurement
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold">
              Food-Grade Red Palm Oil for Hotels & Resorts
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              LeemsDTT provides hospitality corporate buyers with documented batch accountability, clean food-grade 5L and 25L packaging, and dependable long-term supply agreements.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6 max-w-4xl space-y-12">
            <div className="space-y-6">
              <h2 className="font-display text-3xl font-bold text-foreground">
                Built for Hotel Procurement & Quality Assurance Standard
              </h2>
              <ul className="space-y-4">
                {[
                  "ValorTrust Integrated Services Ltd corporate accountability (RC 9268182)",
                  "Tamper-proof induction sealed 5L jugs & 25L heavy-duty jerrycans",
                  "Verified FFA and density parameters ensuring food-safety audit compliance",
                  "Dedicated account manager for hotel purchasing departments",
                  "Flexible credit terms and scheduled monthly supply contracts for qualified accounts",
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
                Request Hotel Procurement Pricing
              </h3>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                Connect with our commercial procurement specialists for hotel dining, buffet, and banqueting requirements.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild variant="gold" size="lg">
                  <Link to="/bulk-supply">Request Hotel Quote <ArrowRight className="h-4 w-4 ml-1" /></Link>
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
