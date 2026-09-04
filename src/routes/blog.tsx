import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Blog } from "@/components/site/Blog";
import { Toaster } from "@/components/ui/sonner";
import { getSeoMeta, getBreadcrumbSchema } from "@/lib/seo";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => {
    const seo = getSeoMeta({
      title: "Blog — Palm Oil Insights & News | LeemsDTT Nigeria",
      description:
        "Read the latest articles, industry insights, quality tips and sourcing guides from the LeemsDTT palm oil team in Nigeria.",
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
  component: BlogPage,
});

function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-8">
        {/* Hero banner */}
        <section className="py-16 bg-gradient-hero text-white text-center">
          <div className="container mx-auto px-6 max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 text-xs font-semibold uppercase tracking-wider text-white/90">
              <BookOpen className="h-4 w-4 text-[var(--gold)]" /> LeemsDTT Blog
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              Palm Oil Insights &amp; News
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Tips, industry updates, sourcing guides and quality knowledge from the LeemsDTT team — helping you buy smarter.
            </p>
          </div>
        </section>

        {/* All posts — full listing with heading hidden (hero above acts as heading) */}
        <Blog showHeading={false} />
      </main>

      <Footer />
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
