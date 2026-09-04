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
import { getSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => getSeoMeta({
    title: "LeemsDTT — Trusted Palm Oil Supply Across Nigeria",
    description: "Professionally processed, carefully packaged red palm oil for households, retailers, restaurants, supermarkets, and bulk distributors across Nigeria. A brand of ValorTrust Integrated Services Ltd (RC 9268182).",
    path: "/",
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
