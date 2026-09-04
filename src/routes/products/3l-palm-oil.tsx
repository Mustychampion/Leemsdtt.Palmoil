import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS_DATA } from "@/data/products";
import { ProductDetailView } from "@/components/site/ProductDetailView";
import { getSeoMeta, getProductSchema, getBreadcrumbSchema } from "@/lib/seo";

const product = PRODUCTS_DATA["3l-palm-oil"];

export const Route = createFileRoute("/products/3l-palm-oil")({
  head: () => {
    const seo = getSeoMeta({
      title: "3L Palm Oil Catering Pack — LeemsDTT Nigeria",
      description: "Buy 3 Litre catering pack red palm oil for restaurants, caterers, boarding kitchens, and bulk buyers across Nigeria. Guaranteed pure, unadulterated quality.",
      path: "/products/3l-palm-oil",
      image: product.image,
      type: "product",
    });

    const productSchema = getProductSchema(product);
    const breadcrumbsSchema = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "3L Catering Pack", path: "/products/3l-palm-oil" },
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
