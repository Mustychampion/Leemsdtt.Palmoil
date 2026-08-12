import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Trust } from "@/components/site/Trust";
import { About } from "@/components/site/About";
import { Products } from "@/components/site/Products";
import { Bulk } from "@/components/site/Bulk";
import { Distributors } from "@/components/site/Distributors";
import { Quality } from "@/components/site/Quality";
import { Testimonials } from "@/components/site/Testimonials";
import { Faq } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LeemsDTT — Trusted Palm Oil Supply Across Nigeria" },
      { name: "description", content: "Professionally processed, carefully packaged palm oil for households, retailers, restaurants, supermarkets, and bulk distributors across Nigeria. By ValorTrust Integrated Services Ltd." },
      { property: "og:title", content: "LeemsDTT — Trusted Palm Oil Supply Across Nigeria" },
      { property: "og:description", content: "Professionally processed, carefully packaged palm oil for households, retailers, restaurants, supermarkets, and bulk distributors across Nigeria. By ValorTrust Integrated Services Ltd." },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "LeemsDTT",
          alternateName: "LeemsDTT Palm Oil",
          parentOrganization: { "@type": "Organization", name: "ValorTrust Integrated Services Ltd" },
          description: "Nigerian palm oil processing, packaging, and distribution.",
          areaServed: "NG",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Trust />
        <About />
        <Products />
        <Bulk />
        <Distributors />
        <Quality />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
