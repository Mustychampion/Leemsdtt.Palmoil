import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Distributors } from "@/components/site/Distributors";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { getSeoMeta, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/distributors")({
  head: () => {
    const seo = getSeoMeta({
      title: "Become a LeemsDTT Palm Oil Distributor in Nigeria",
      description: "Join the LeemsDTT distributor network across Nigeria. Regional partnerships, wholesale pricing, marketing support, and direct account management — apply today.",
      path: "/distributors",
    });

    const breadcrumbs = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Distributors", path: "/distributors" },
    ]);

    return {
      ...seo,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
      ],
    };
  },
  component: DistributorsPage,
});

function DistributorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <Distributors />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}