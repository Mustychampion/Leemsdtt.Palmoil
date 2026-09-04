import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS_DATA } from "@/data/products";
import { ProductDetailView } from "@/components/site/ProductDetailView";
import { getSeoMeta, getProductSchema, getBreadcrumbSchema } from "@/lib/seo";

const product = PRODUCTS_DATA["1l-palm-oil"];

export const Route = createFileRoute("/products/1l-palm-oil")({
  head: () => {
    const seo = getSeoMeta({
      title: "1L Palm Oil Family Pack — LeemsDTT Nigeria",
      description: "Buy 1 Litre pure packaged red palm oil in Nigeria. Professionally processed family pack for daily meals, food vendors, and market resale. By ValorTrust.",
      path: "/products/1l-palm-oil",
      image: product.image,
      type: "product",
    });

    const productSchema = getProductSchema(product);
    const breadcrumbsSchema = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "1L Family Pack", path: "/products/1l-palm-oil" },
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
