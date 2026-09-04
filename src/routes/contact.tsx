import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Contact } from "@/components/site/Contact";
import { Faq } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { getSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => {
    const seo = getSeoMeta({
      title: "Contact LeemsDTT — Request a Palm Oil Quote",
      description: "Talk to LeemsDTT sales. Request a quote for household, retail, restaurant, supermarket, or bulk palm oil supply across Nigeria. Phone, WhatsApp (+234 803 953 5043), and office in Kano.",
      path: "/contact",
    });

    const breadcrumbs = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Contact Us", path: "/contact" },
    ]);

    return {
      ...seo,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
      ],
    };
  },
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <Contact />
        <Faq />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}