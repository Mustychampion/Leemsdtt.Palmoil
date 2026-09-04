import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Bulk } from "@/components/site/Bulk";
import { BulkQuote } from "@/components/site/BulkQuote";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { getSeoMeta, getBulkServiceSchema, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/bulk-supply")({
  head: () => {
    const seo = getSeoMeta({
      title: "Bulk & Commercial Palm Oil Supply for Businesses | LeemsDTT Nigeria",
      description: "Reliable bulk palm oil supply for hotels, supermarkets, restaurants, caterers, and wholesalers across Nigeria. Stable pricing, scheduled fulfilment, and dedicated account contact.",
      path: "/bulk-supply",
    });

    const serviceSchema = getBulkServiceSchema();
    const breadcrumbs = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Bulk Supply", path: "/bulk-supply" },
    ]);

    return {
      ...seo,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(serviceSchema) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
      ],
    };
  },
  component: BulkPage,
});

function BulkPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <Bulk />
        <BulkQuote />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}