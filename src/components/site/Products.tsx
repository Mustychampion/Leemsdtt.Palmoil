import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
const products = [
  {
    size: "500ml",
    name: "Household Bottle",
    use: "Daily home cooking, small kitchens, gifting.",
    tags: ["Households", "Retail"],
    height: "h-48",
    image: "/images/500ml.png",
  },
  {
    size: "1L",
    name: "Family Pack",
    use: "Regular family meals, small food vendors, market resale.",
    tags: ["Households", "Vendors"],
    height: "h-56",
    image: "/images/1L2.png",
  },
  {
    size: "3L",
    name: "Catering Pack",
    use: "Restaurants, caterers, boarding kitchens, weekly bulk.",
    tags: ["Restaurants", "Caterers"],
    height: "h-64",
    image: "/images/3L2.png",
  },
  {
    size: "5L",
    name: "Vendor & Family Jug",
    use: "Extended family use, small-scale vendors, regular cooking.",
    tags: ["Vendors", "Family"],
    height: "h-72",
    image: "/images/5L2.png",
  },
  {
    size: "25L",
    name: "Bulk Jerrycan",
    use: "Hotels, supermarkets, wholesalers, institutional supply.",
    tags: ["Wholesale", "Hotels"],
    height: "h-80",
    image: "/images/25L.png",
  },
];

export function Products() {
  return (
    <section id="products" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-4">
              Our Packaging Sizes
            </div>
            <h2 className="text-4xl md:text-5xl text-foreground">
              One quality. Five sizes. Built for the way <em className="text-primary not-italic">Nigeria buys</em>.
            </h2>
          </div>
          <Button asChild variant="deep" size="lg">
            <Link to="/bulk-supply">Bulk pricing <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.size}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="group relative rounded-2xl bg-gradient-to-b from-secondary to-background border border-border p-8 hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`relative ${p.height} mb-6 flex items-end justify-center overflow-hidden`}>
                {p.image ? (
                  <motion.img
                    src={p.image}
                    alt={`LeemsDTT ${p.size} red palm oil`}
                    loading="lazy"
                    className="h-full w-auto object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.25)]"
                    whileHover={{ y: -6, scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  />
                ) : (
                <div
                  className="relative w-24 rounded-t-3xl rounded-b-lg shadow-lg overflow-hidden"
                  style={{
                    height: "100%",
                    background:
                      "linear-gradient(180deg, #d94a2a 0%, #b8341a 60%, #8a2010 100%)",
                  }}
                >
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-3 rounded bg-[var(--gold)]/90" />
                  <div className="absolute inset-x-2 top-12 bottom-4 rounded-md bg-background/95 flex flex-col items-center justify-center text-center p-2">
                    <div className="font-display text-xs text-primary font-bold">LeemsDTT</div>
                    <div className="text-[8px] uppercase tracking-wider text-muted-foreground mt-1">Pure Palm Oil</div>
                    <div className="font-display text-2xl text-primary-deep font-bold mt-2">{p.size}</div>
                  </div>
                </div>
                )}
              </div>
              <div className="font-display text-2xl text-foreground mb-1">{p.size}</div>
              <div className="text-sm font-semibold text-primary mb-3">{p.name}</div>
              <p className="text-sm text-muted-foreground mb-4 min-h-[3rem]">{p.use}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {p.tags.map((t) => (
                  <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-accent text-accent-foreground font-semibold">
                    {t}
                  </span>
                ))}
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/contact">Inquire about {p.size}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}