import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Blog } from "@/components/site/Blog";
import { Toaster } from "@/components/ui/sonner";
import { getSeoMeta, getBreadcrumbSchema } from "@/lib/seo";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/blog/")({
  head: () => {
    const seo = getSeoMeta({
      title: "Blog & Insights — Technology, Data & Value Chains | LeemsDTT Nigeria",
      description:
        "Practical digital transformation roadmaps, SME technology guides, operational insights, and commercial sourcing knowledge from LeemsDTT — ValorTrust Integrated Services Ltd.",
      path: "/blog",
      type: "website",
    });

    const breadcrumbs = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]);

    return {
      ...seo,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
      ],
    };
  },
  component: BlogIndexPage,
});

function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-8">
        {/* Hero banner */}
        <section className="py-16 bg-gradient-hero text-white text-center">
          <div className="container mx-auto px-6 max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 text-xs font-semibold uppercase tracking-wider text-white/90">
              <BookOpen className="h-4 w-4 text-[var(--gold)]" /> LeemsDTT Insights &amp; Knowledge Hub
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              Business Technology &amp; Market Insights
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Educational roadmaps, practical digital capability frameworks, and commercial insights from LeemsDTT — empowering Nigerian enterprises to build measurable value.
            </p>
          </div>
        </section>

        {/* All posts listing */}
        <Blog showHeading={false} />
      </main>

      <Footer />
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
