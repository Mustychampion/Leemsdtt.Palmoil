import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { About } from "@/components/site/About";
import { Quality } from "@/components/site/Quality";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { getSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => {
    const seo = getSeoMeta({
      title: "About LeemsDTT — Nigerian Palm Oil Brand by ValorTrust",
      description: "LeemsDTT is a flagship brand of ValorTrust Integrated Services Ltd (RC 9268182). Trusted Nigerian processing, packaging, and supply for homes, businesses, and bulk buyers.",
      path: "/about",
    });

    const breadcrumbs = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about" },
    ]);

    return {
      ...seo,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
      ],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <About />
        <Quality />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}