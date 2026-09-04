import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS_DATA } from "@/data/products";
import { ProductDetailView } from "@/components/site/ProductDetailView";
import { getSeoMeta, getProductSchema, getBreadcrumbSchema } from "@/lib/seo";

const product = PRODUCTS_DATA["500ml-palm-oil"];

export const Route = createFileRoute("/products/500ml-palm-oil")({
  head: () => {
    const seo = getSeoMeta({
      title: "500ml Palm Oil Household Bottle — LeemsDTT Nigeria",
      description: "Buy 500ml pure packaged red palm oil in Nigeria. Professionally processed, batch tested, unadulterated red palm oil for households, small kitchens, and retail.",
      path: "/products/500ml-palm-oil",
      image: product.image,
      type: "product",
    });

    const productSchema = getProductSchema(product);
    const breadcrumbsSchema = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "500ml Household Bottle", path: "/products/500ml-palm-oil" },
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
