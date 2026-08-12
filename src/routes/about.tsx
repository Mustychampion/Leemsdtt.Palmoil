import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { About } from "@/components/site/About";
import { Quality } from "@/components/site/Quality";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About LeemsDTT — Nigerian Palm Oil by ValorTrust" },
      { name: "description", content: "LeemsDTT is the palm oil brand of ValorTrust Integrated Services Ltd (RC 9268182). Trusted Nigerian processing, packaging, and supply for homes, businesses, and bulk buyers." },
      { property: "og:title", content: "About LeemsDTT — Nigerian Palm Oil by ValorTrust" },
      { property: "og:description", content: "A serious operation built on consistency — clean, professionally processed palm oil supplied across Nigeria." },
      { property: "og:url", content: "/about" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20"><About /><Quality /></main>
      <Footer />
      <Toaster />
    </div>
  );
}