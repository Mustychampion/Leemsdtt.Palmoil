import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ChevronRight, Package, Info, Download, Tag } from "lucide-react";
import { PRODUCTS_DATA, MASTER_PRODUCT_ARTWORK, type ProductDetails } from "@/data/products";
import { db } from "@/integrations/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ProductDetailView({ product }: { product: ProductDetails }) {
  const [formattedPrice, setFormattedPrice] = useState<string>(product.formattedPrice);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const key = product.size.toLowerCase();
        const snap = await getDoc(doc(db, "product_prices", "current_prices"));
        if (snap.exists()) {
          const item = snap.data().items?.[key];
          if (item?.formattedPrice) {
            setFormattedPrice(item.formattedPrice);
          }
        }
      } catch (e) {
        // fallback to initial formattedPrice
      }
    }
    fetchPrice();
  }, [product.size]);

  const relatedProducts = product.relatedSlugs
    .map((slug) => PRODUCTS_DATA[slug])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Breadcrumb Navigation */}
        <div className="bg-secondary/40 border-b border-border py-3">
          <div className="container mx-auto px-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{product.size} {product.name}</span>
          </div>
        </div>

        {/* Hero Product Showcase */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
            {/* Product Image Stage & Download Trigger */}
            <div className="lg:col-span-5 flex flex-col items-center gap-4">
              <div className="relative rounded-2xl bg-gradient-to-b from-secondary/80 to-background border border-border p-10 max-w-md w-full flex items-center justify-center min-h-[380px] shadow-card">
                <img
                  src={product.image}
                  alt={`LeemsDTT ${product.size} ${product.name} red palm oil`}
                  className="h-80 w-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Master Artwork Download Action */}
              <Button asChild variant="outline" size="sm" className="w-full max-w-md text-xs font-semibold gap-2 border-primary/30 text-foreground hover:text-primary">
                <a href={MASTER_PRODUCT_ARTWORK.url} download={MASTER_PRODUCT_ARTWORK.filename}>
                  <Download className="h-4 w-4 text-primary" /> Download Master Product Artwork
                </a>
              </Button>
            </div>

            {/* Product Copy & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
                  <Package className="h-3.5 w-3.5" />
                  Format: {product.size}
                </div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold font-mono border border-accent">
                  <Tag className="h-3.5 w-3.5 text-primary" />
                  {formattedPrice}
                </div>
              </div>

              <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight">
                LeemsDTT {product.size} <span className="text-primary">{product.name}</span>
              </h1>

              <p className="text-xl text-primary font-medium">
                {product.headline}
              </p>

              <p className="text-muted-foreground leading-relaxed text-base">
                {product.longDescription}
              </p>

              {/* Target User Tags */}
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Recommended Buyers & Use Cases</div>
                <div className="flex flex-wrap gap-2">
                  {product.targetUsers.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium border border-border">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div className="pt-2">
                <ul className="grid sm:grid-cols-2 gap-2.5">
                  {product.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-foreground/90">
                      <CheckCircle2 className="h-4 w-4 text-[var(--gold)] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order / Inquiry CTAs */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                <Button asChild variant="gold" size="xl">
                  <Link to="/contact" search={{ size: product.size }}>
                    Inquire About {product.size} <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl">
                  <Link to="/bulk-supply">
                    Bulk Pricing Options
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Specifications Table */}
        <section className="py-12 bg-secondary/30 border-y border-border">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="font-display text-2xl text-foreground mb-6 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" /> Technical & Packaging Specifications
            </h2>
            <div className="rounded-xl border border-border bg-background overflow-hidden shadow-subtle">
              <dl className="divide-y divide-border">
                <div className="grid grid-cols-3 p-4 text-sm">
                  <dt className="font-medium text-muted-foreground font-mono">Retail Price</dt>
                  <dd className="col-span-2 font-bold font-mono text-primary text-base">{formattedPrice}</dd>
                </div>
                <div className="grid grid-cols-3 p-4 text-sm bg-secondary/20">
                  <dt className="font-medium text-muted-foreground">Volume Capacity</dt>
                  <dd className="col-span-2 font-semibold text-foreground">{product.specs.volume}</dd>
                </div>
                <div className="grid grid-cols-3 p-4 text-sm">
                  <dt className="font-medium text-muted-foreground">Container Material</dt>
                  <dd className="col-span-2 text-foreground">{product.specs.containerType}</dd>
                </div>
                <div className="grid grid-cols-3 p-4 text-sm bg-secondary/20">
                  <dt className="font-medium text-muted-foreground">Closure & Integrity</dt>
                  <dd className="col-span-2 text-foreground">{product.specs.sealType}</dd>
                </div>
                <div className="grid grid-cols-3 p-4 text-sm">
                  <dt className="font-medium text-muted-foreground">Shelf Life</dt>
                  <dd className="col-span-2 text-foreground">{product.specs.shelfLife}</dd>
                </div>
                <div className="grid grid-cols-3 p-4 text-sm bg-secondary/20">
                  <dt className="font-medium text-muted-foreground">Storage Guidelines</dt>
                  <dd className="col-span-2 text-foreground">{product.specs.storage}</dd>
                </div>
                <div className="grid grid-cols-3 p-4 text-sm">
                  <dt className="font-medium text-muted-foreground">Origin & QA</dt>
                  <dd className="col-span-2 text-foreground">{product.specs.origin}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Product Specific FAQs */}
        {product.faqs && product.faqs.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-6 max-w-4xl">
              <h2 className="font-display text-2xl text-foreground mb-6">
                Frequently Asked Questions ({product.size})
              </h2>
              <Accordion type="single" collapsible className="space-y-3">
                {product.faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="border border-border rounded-xl px-5 bg-background">
                    <AccordionTrigger className="font-semibold text-left text-foreground hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}

        {/* Related Packaging Sizes */}
        {relatedProducts.length > 0 && (
          <section className="py-12 bg-secondary/20">
            <div className="container mx-auto px-6">
              <h2 className="font-display text-2xl text-foreground mb-8 text-center">
                Explore Other Packaging Sizes
              </h2>
              <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {relatedProducts.map((rel) => (
                  <div key={rel.slug} className="rounded-xl border border-border bg-background p-6 hover:shadow-card transition-all text-center">
                    <img src={rel.image} alt={`LeemsDTT ${rel.size}`} className="h-36 w-auto object-contain mx-auto mb-4" />
                    <div className="font-display text-xl font-semibold text-foreground">{rel.size}</div>
                    <div className="text-xs text-primary font-medium mb-2">{rel.name}</div>
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{rel.description}</p>
                    <Button asChild variant="outline" size="sm" className="w-full text-xs">
                      <Link to={`/products/${rel.slug}` as any}>View {rel.size} Details</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
