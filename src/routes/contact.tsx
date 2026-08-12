import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Contact } from "@/components/site/Contact";
import { Faq } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact LeemsDTT — Request a Palm Oil Quote" },
      { name: "description", content: "Talk to LeemsDTT sales. Request a quote for household, retail, restaurant, supermarket or bulk palm oil supply across Nigeria. Response within 4 business hours." },
      { property: "og:title", content: "Contact LeemsDTT — Request a Palm Oil Quote" },
      { property: "og:description", content: "Request a tailored palm oil quote. We respond within 4 business hours." },
      { property: "og:url", content: "/contact" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20"><Contact /><Faq /></main>
      <Footer />
      <Toaster />
    </div>
  );
}