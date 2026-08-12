import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Distributors } from "@/components/site/Distributors";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/distributors")({
  head: () => ({
    meta: [
      { title: "Become a LeemsDTT Palm Oil Distributor in Nigeria" },
      { name: "description", content: "Join the LeemsDTT distributor network. Regional partnerships, wholesale pricing, marketing support and a real account manager — apply today." },
      { property: "og:title", content: "Become a LeemsDTT Palm Oil Distributor in Nigeria" },
      { property: "og:description", content: "We are actively expanding our distributor network across Nigeria." },
      { property: "og:url", content: "/distributors" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/distributors" }],
  }),
  component: DistributorsPage,
});

function DistributorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20"><Distributors /></main>
      <Footer />
      <Toaster />
    </div>
  );
}