import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Bulk } from "@/components/site/Bulk";
import { BulkQuote } from "@/components/site/BulkQuote";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/bulk-supply")({
  head: () => ({
    meta: [
      { title: "Bulk Palm Oil Supply for Businesses | LeemsDTT" },
      { name: "description", content: "Reliable bulk palm oil supply for hotels, supermarkets, restaurants, caterers and wholesalers across Nigeria. Stable pricing, scheduled fulfilment, dedicated account contact." },
      { property: "og:title", content: "Bulk Palm Oil Supply for Businesses | LeemsDTT" },
      { property: "og:description", content: "Volume palm oil supply with stable pricing and scheduled fulfilment." },
      { property: "og:url", content: "/bulk-supply" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/bulk-supply" }],
  }),
  component: BulkPage,
});

function BulkPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20"><Bulk /><BulkQuote /></main>
      <Footer />
      <Toaster />
    </div>
  );
}