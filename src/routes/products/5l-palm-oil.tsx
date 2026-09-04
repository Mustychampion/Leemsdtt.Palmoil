import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS_DATA } from "@/data/products";
import { ProductDetailView } from "@/components/site/ProductDetailView";
import { getSeoMeta, getProductSchema, getBreadcrumbSchema } from "@/lib/seo";

const product = PRODUCTS_DATA["5l-palm-oil"];

export const Route = createFileRoute("/products/5l-palm-oil")({
  head: () => {
    const seo = getSeoMeta({
      title: "5L Palm Oil Vendor & Family Jug — LeemsDTT Nigeria",
      description: "Buy 5 Litre red palm oil jug for extended families, food vendors, canteens, and bulk cooking across Nigeria. Food-grade HDPE container with security seal.",
      path: "/products/5l-palm-oil",
      image: product.image,
      type: "product",
    });

    const productSchema = getProductSchema(product);
    const breadcrumbsSchema = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "5L Vendor & Family Jug", path: "/products/5l-palm-oil" },
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
