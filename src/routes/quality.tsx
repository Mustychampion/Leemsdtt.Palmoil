import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Quality } from "@/components/site/Quality";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Award, CheckCircle2 } from "lucide-react";
import { getSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/quality")({
  head: () => {
    const seo = getSeoMeta({
      title: "Quality Assurance & Processing Standards — LeemsDTT Palm Oil",
      description: "Discover LeemsDTT's 6-step quality control journey from plantation sourcing to batch testing, multi-stage clarification, and food-grade sealed packaging across Nigeria.",
      path: "/quality",
    });

    const breadcrumbs = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Quality Assurance", path: "/quality" },
    ]);

    return {
      ...seo,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
      ],
    };
  },
  component: QualityPage,
});

function QualityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24">
        <section className="py-16 bg-gradient-hero text-white">
          <div className="container mx-auto px-6 max-w-4xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs uppercase tracking-wider text-white/90">
              <ShieldCheck className="h-4 w-4 text-[var(--gold)]" /> Quality & Compliance Assurance
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold">
              Uncompromising Quality in Every Drop
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              LeemsDTT operates under strict processing, batch-testing, and packaging controls to eliminate adulteration, artificial coloring, and unstable shelf settling.
            </p>
          </div>
        </section>

        <Quality />

        <section className="py-16 bg-background border-t border-border text-center">
          <div className="container mx-auto px-6 max-w-3xl space-y-6">
            <Award className="h-12 w-12 text-primary mx-auto" />
            <h2 className="font-display text-3xl font-bold text-foreground">
              Experience the LeemsDTT Quality Difference
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Whether you are buying for a household or managing commercial purchasing for a hotel, supermarket, or restaurant — request a sample or formal quote today.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Button asChild variant="gold" size="lg">
                <Link to="/contact">Request a Quote <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/products">Browse Packaging Sizes</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
