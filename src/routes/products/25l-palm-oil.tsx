import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS_DATA } from "@/data/products";
import { ProductDetailView } from "@/components/site/ProductDetailView";
import { getSeoMeta, getProductSchema, getBreadcrumbSchema } from "@/lib/seo";

const product = PRODUCTS_DATA["25l-palm-oil"];

export const Route = createFileRoute("/products/25l-palm-oil")({
  head: () => {
    const seo = getSeoMeta({
      title: "25L Bulk Palm Oil Commercial Jerrycan — LeemsDTT Nigeria",
      description: "Wholesale 25 Litre commercial jerrycan palm oil supplier for hotels, supermarkets, caterers, and wholesalers across Nigeria. Scheduled fulfilment & wholesale pricing.",
      path: "/products/25l-palm-oil",
      image: product.image,
      type: "product",
    });

    const productSchema = getProductSchema(product);
    const breadcrumbsSchema = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "25L Commercial Jerrycan", path: "/products/25l-palm-oil" },
    ]);

    return {
      ...seo,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(productSchema) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbsSchema) },
      ],
    };
  },
  component: () => <ProductDetailView product={product} />,
});
