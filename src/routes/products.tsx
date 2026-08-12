import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Products } from "@/components/site/Products";
import { Quality } from "@/components/site/Quality";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Palm Oil Products — 500ml, 1L, 3L, 5L | LeemsDTT" },
      { name: "description", content: "Premium Nigerian palm oil in 500ml, 1L, 3L, and 5L. Same quality, four sizes — for households, retail, restaurants, supermarkets, and bulk buyers." },
      { property: "og:title", content: "Palm Oil Products — 500ml, 1L, 3L, 5L | LeemsDTT" },
      { property: "og:description", content: "Premium Nigerian palm oil packaging for every kind of buyer." },
      { property: "og:url", content: "/products" },
      { property: "og:type", content: "product" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20"><Products /><Quality /></main>
      <Footer />
      <Toaster />
    </div>
  );
}