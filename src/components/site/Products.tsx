import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Download, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { PRODUCTS_DATA, MASTER_PRODUCT_ARTWORK } from "@/data/products";
import { db } from "@/integrations/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { DEFAULT_PRODUCT_PRICES } from "@/components/admin/PriceManagement";

const initialProducts = [
  {
    slug: "500ml-palm-oil",
    key: "500ml",
    size: "500ml",
    name: "Household Bottle",
    use: "Daily home cooking, small kitchens, gifting.",
    tags: ["Households", "Retail"],
    height: "h-48",
    image: "/images/500ml.png",
    priceText: PRODUCTS_DATA["500ml-palm-oil"].formattedPrice,
  },
  {
    slug: "1l-palm-oil",
    key: "1l",
    size: "1L",
    name: "Family Pack",
    use: "Regular family meals, small food vendors, market resale.",
    tags: ["Households", "Vendors"],
    height: "h-56",
    image: "/images/1L2.png",
    priceText: PRODUCTS_DATA["1l-palm-oil"].formattedPrice,
  },
  {
    slug: "3l-palm-oil",
    key: "3l",
    size: "3L",
    name: "Catering Pack",
    use: "Restaurants, caterers, boarding kitchens, weekly bulk.",
    tags: ["Restaurants", "Caterers"],
    height: "h-64",
    image: "/images/3L2.png",
    priceText: PRODUCTS_DATA["3l-palm-oil"].formattedPrice,
  },
  {
    slug: "5l-palm-oil",
    key: "5l",
    size: "5L",
    name: "Vendor & Family Jug",
    use: "Extended family use, small-scale vendors, regular cooking.",
    tags: ["Vendors", "Family"],
    height: "h-72",
    image: "/images/5L2.png",
    priceText: PRODUCTS_DATA["5l-palm-oil"].formattedPrice,
  },
  {
    slug: "25l-palm-oil",
    key: "25l",
    size: "25L",
    name: "Bulk Jerrycan",
    use: "Hotels, supermarkets, wholesalers, institutional supply.",
    tags: ["Wholesale", "Hotels"],
    height: "h-80",
    image: "/images/25L.png",
    priceText: PRODUCTS_DATA["25l-palm-oil"].formattedPrice,
  },
];

export function Products() {
  const [prices, setPrices] = useState<Record<string, string>>({
    "500ml": PRODUCTS_DATA["500ml-palm-oil"].formattedPrice,
    "1l": PRODUCTS_DATA["1l-palm-oil"].formattedPrice,
    "3l": PRODUCTS_DATA["3l-palm-oil"].formattedPrice,
    "5l": PRODUCTS_DATA["5l-palm-oil"].formattedPrice,
    "25l": PRODUCTS_DATA["25l-palm-oil"].formattedPrice,
  });

  useEffect(() => {
    async function fetchPrices() {
      try {
        const snap = await getDoc(doc(db, "product_prices", "current_prices"));
        if (snap.exists()) {
          const items = snap.data().items;
          if (items) {
            setPrices({
              "500ml": items["500ml"]?.formattedPrice || DEFAULT_PRODUCT_PRICES["500ml"].formattedPrice,
              "1l": items["1l"]?.formattedPrice || DEFAULT_PRODUCT_PRICES["1l"].formattedPrice,
              "3l": items["3l"]?.formattedPrice || DEFAULT_PRODUCT_PRICES["3l"].formattedPrice,
              "5l": items["5l"]?.formattedPrice || DEFAULT_PRODUCT_PRICES["5l"].formattedPrice,
              "25l": items["25l"]?.formattedPrice || DEFAULT_PRODUCT_PRICES["25l"].formattedPrice,
            });
          }
        }
      } catch (e) {
        // use fallback initial prices
      }
    }
    fetchPrices();
  }, []);

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
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="lg" className="text-xs font-semibold gap-2 border-primary/30">
              <a href={MASTER_PRODUCT_ARTWORK.url} download={MASTER_PRODUCT_ARTWORK.filename}>
                <Download className="h-4 w-4 text-primary" /> Download Master Product Artwork
              </a>
            </Button>
            <Button asChild variant="hero" size="lg">
              <Link to="/bulk-supply">Bulk pricing <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </div>
        </div>

        <div className="mb-12 rounded-2xl overflow-hidden border border-border shadow-sm">
          <img 
            src={MASTER_PRODUCT_ARTWORK.url} 
            alt="LeemsDTT Official Product Artwork" 
            className="w-full h-auto object-contain bg-muted/30"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {initialProducts.map((p, i) => {
            const displayPrice = prices[p.key] || p.priceText;
            return (
              <motion.div
                key={p.size}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="group relative rounded-2xl bg-gradient-to-b from-secondary to-background border border-border p-6 hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`relative ${p.height} mb-4 flex items-end justify-center overflow-hidden`}>
                    <motion.img
                      src={p.image}
                      alt={`LeemsDTT ${p.size} red palm oil`}
                      loading="lazy"
                      className="h-full w-auto object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.25)]"
                      whileHover={{ y: -6, scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    />
                  </div>

                  {/* Price Tag Badge */}
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-display text-2xl text-foreground">{p.size}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                      <Tag className="h-3 w-3" /> {displayPrice}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-primary mb-2">{p.name}</div>
                  <p className="text-sm text-muted-foreground mb-4 min-h-[3rem]">{p.use}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-accent text-accent-foreground font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Button asChild variant="outline" size="sm" className="w-full text-xs">
                    <Link to={`/products/${p.slug}` as any}>
                      View Details <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-primary">
                    <a href={MASTER_PRODUCT_ARTWORK.url} download={MASTER_PRODUCT_ARTWORK.filename} title="Download official product artwork">
                      <Download className="h-3 w-3 mr-1" /> Download Artwork
                    </a>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}