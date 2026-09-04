import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Products } from "@/components/site/Products";
import { Quality } from "@/components/site/Quality";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { getSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/products")({
  head: () => {
    const seo = getSeoMeta({
      title: "Palm Oil Products — 500ml, 1L, 3L, 5L & 25L | LeemsDTT Nigeria",
      description: "Premium Nigerian red palm oil in 500ml, 1L, 3L, 5L, and 25L jerrycans. Pure, batch-tested packaging for households, retail, restaurants, supermarkets, and bulk buyers.",
      path: "/products",
    });

    const breadcrumbs = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
    ]);

    return {
      ...seo,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
      ],
    };
  },
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <Products />
        <Quality />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}