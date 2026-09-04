import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { BookOpen, ShieldCheck, Flame, Scale, ArrowRight } from "lucide-react";
import { getSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/insights/")({
  head: () => {
    const seo = getSeoMeta({
      title: "Palm Oil Knowledge & Sourcing Insights — LeemsDTT Nigeria",
      description: "Learn how to identify pure red palm oil, avoid adulterated market products, understand FFA standards, and optimize storage for commercial & household kitchens in Nigeria.",
      path: "/insights",
    });

    const breadcrumbs = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Palm Oil Insights", path: "/insights" },
    ]);

    return {
      ...seo,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
      ],
    };
  },
  component: InsightsHubPage,
});

const articles = [
  {
    id: "how-to-identify-pure-palm-oil",
    title: "How to Identify 100% Pure Red Palm Oil & Avoid Adulteration",
    category: "Quality Assurance",
    readTime: "5 min read",
    snippet: "Unadulterated red palm oil should retain its natural rich beta-carotene aroma, smooth viscosity, and natural settling characteristics without synthetic dyes like Sudan red.",
    icon: ShieldCheck,
  },
  {
    id: "palm-oil-processing-and-clarification",
    title: "The 6 Stages of Professional Palm Oil Processing & Clarification",
    category: "Sourcing & Technology",
    readTime: "6 min read",
    snippet: "From fresh oil palm fruit bunch harvesting in southern plantations to sterilisation, mechanical digestion, settling clarification, and food-grade bottling.",
    icon: Flame,
  },
  {
    id: "commercial-bulk-palm-oil-purchasing-guide",
    title: "Commercial Palm Oil Procurement Guide for Hotels & Restaurants",
    category: "B2B Procurement",
    readTime: "7 min read",
    snippet: "Why free fatty acid (FFA) percentages, container seal integrity, and scheduled supplier agreements are essential for commercial kitchen budget management.",
    icon: Scale,
  },
];

function InsightsHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <section className="py-16 bg-gradient-hero text-white text-center">
          <div className="container mx-auto px-6 max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 text-xs font-semibold uppercase tracking-wider text-white/90">
              <BookOpen className="h-4 w-4 text-[var(--gold)]" /> Educational Sourcing Guide
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold">
              Nigerian Palm Oil Sourcing & Quality Insights
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Empowering households, chefs, and commercial buyers with practical knowledge on palm oil quality, processing discipline, and supply chain accountability.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid md:grid-cols-3 gap-8">
              {articles.map((art) => (
                <div key={art.id} className="rounded-2xl border border-border bg-background p-6 hover:shadow-card transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-primary">{art.category}</span>
                      <span>{art.readTime}</span>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
                      <art.icon className="h-5 w-5" />
                    </div>
                    <h2 className="font-display text-xl font-semibold text-foreground">{art.title}</h2>
                    <p className="text-xs text-muted-foreground leading-relaxed">{art.snippet}</p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full text-xs">
                    <Link to="/quality">
                      Read Quality Standards <ArrowRight className="h-3.5 w-3.5 ml-1" />
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
