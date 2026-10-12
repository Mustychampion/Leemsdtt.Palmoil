/**
 * LeemsDTT Enterprise SEO Engine & Metadata Utilities
 * Corporate Entity: ValorTrust Integrated Services Ltd (RC 9268182)
 * Brand: LeemsDTT Premium Palm Oil
 */

export const DEFAULT_SITE_URL = "https://www.leemsdtt.name.ng";

export function getSiteUrl(): string {
  if (typeof process !== "undefined" && process.env) {
    if (process.env.VITE_SITE_URL) return process.env.VITE_SITE_URL.replace(/\/$/, "");
    if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return DEFAULT_SITE_URL;
}

export interface SeoMetaProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "product";
  imageWidth?: number | string;
  imageHeight?: number | string;
  imageType?: string;
  imageAlt?: string;
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export function buildCanonicalUrl(path = "/"): string {
  const baseUrl = getSiteUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath === "/" ? "" : cleanPath}`;
}

export function getSeoMeta({
  title,
  description,
  path = "/",
  image = "/images/og-image.jpg",
  type = "website",
  imageWidth = 1200,
  imageHeight = 630,
  imageType = "image/jpeg",
  imageAlt = "LeemsDTT Premium Red Palm Oil",
  noIndex = false,
  publishedTime,
  modifiedTime,
}: SeoMetaProps) {
  const canonical = buildCanonicalUrl(path);
  const cleanImage = image.trim().replace(/ /g, "%20");
  const fullImageUrl = cleanImage.startsWith("http")
    ? cleanImage
    : `${getSiteUrl()}${cleanImage.startsWith("/") ? cleanImage : `/${cleanImage}`}`;

  const metaTags: Array<{ name?: string; property?: string; content: string }> = [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "description", content: description },
    { name: "author", content: "LeemsDTT — ValorTrust Integrated Services Ltd" },
    
    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: canonical },
    { property: "og:image", content: fullImageUrl },
    { property: "og:image:width", content: String(imageWidth) },
    { property: "og:image:height", content: String(imageHeight) },
    { property: "og:image:type", content: imageType },
    { property: "og:image:alt", content: imageAlt },
    { property: "og:site_name", content: "LeemsDTT Palm Oil & Digital Capabilities" },
    { property: "og:locale", content: "en_NG" },

    // Twitter / X Cards
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@Leemsdtt" },
    { name: "twitter:creator", content: "@Leemsdtt" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: fullImageUrl },
  ];

  if (type === "article") {
    if (publishedTime) {
      metaTags.push({ property: "article:published_time", content: publishedTime });
    }
    if (modifiedTime) {
      metaTags.push({ property: "article:modified_time", content: modifiedTime });
    }
    metaTags.push({ property: "article:publisher", content: "https://www.valortrustgroupco.name.ng" });
  }

  if (noIndex) {
    metaTags.push({ name: "robots", content: "noindex, nofollow" });
  } else {
    metaTags.push({ name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" });
  }

  return {
    meta: [
      { title },
      ...metaTags,
    ],
    links: [
      { rel: "canonical", href: canonical },
    ],
  };
}

export interface BlogPostingSchemaProps {
  title: string;
  description: string;
  slug: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  category?: string;
  keywords?: string[];
}

/**
 * Article & BlogPosting Schema.org Generator
 */
export function getBlogPostingSchema({
  title,
  description,
  slug,
  image = "/images/digital-transformation-nigerian-businesses.jpg",
  datePublished,
  dateModified,
  author = "LEEMS DTT",
  category,
  keywords = [],
}: BlogPostingSchemaProps) {
  const siteUrl = getSiteUrl();
  const cleanSlug = (slug || "").replace(/^\/+/, "");
  const articleUrl = cleanSlug ? `${siteUrl}/blog/${cleanSlug}` : siteUrl;
  const fullImageUrl = image.startsWith("http") ? image : `${siteUrl}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}/#article`,
    isPartOf: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    headline: title,
    description,
    url: articleUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    image: [fullImageUrl],
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || datePublished || new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: author || "LEEMS DTT",
      url: siteUrl,
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: "en-NG",
    articleSection: category || "Digital Transformation",
    keywords: Array.isArray(keywords) ? keywords.join(", ") : keywords,
  };
}

/**
 * Global Organization Schema (ValorTrust Integrated Services Ltd & LeemsDTT)
 */
export function getOrganizationSchema() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "ValorTrust Integrated Services Ltd",
    alternateName: ["LeemsDTT", "LeemsDTT Palm Oil"],
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/assets/valortrust-logo.png`,
    },
    brand: {
      "@type": "Brand",
      name: "LeemsDTT",
      description: "Premium Nigerian packaged red palm oil brand by ValorTrust Integrated Services Ltd.",
      logo: `${siteUrl}/assets/leemsdtt-logo.png`,
    },
    taxID: "RC 9268182",
    description: "Registered Nigerian enterprise producing and supplying premium packaged red palm oil to households, retail, restaurants, hotels, supermarkets, and bulk distributors across Nigeria.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kano",
      addressRegion: "Kano State",
      addressCountry: "NG",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+2348039535043",
        contactType: "sales & bulk supply",
        email: "leemsdtt.valortrust@gmail.com",
        areaServed: "NG",
        availableLanguage: ["en", "ha"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+2347034372698",
        contactType: "customer support",
        email: "leemsdtt.valortrust@gmail.com",
        areaServed: "NG",
        availableLanguage: ["en"],
      },
    ],
    sameAs: [
      "https://x.com/Leemsdtt",
      "https://instagram.com/leemsdtt",
      "https://tiktok.com/leemsdtt",
      "https://www.valortrustgroupco.name.ng",
    ],
  };
}

/**
 * WebSite Schema
 */
export function getWebSiteSchema() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "LeemsDTT Palm Oil",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: "en-NG",
  };
}

/**
 * Product Schema for Packaging Sizes
 */
export function getProductSchema(product: {
  name: string;
  size: string;
  description: string;
  image: string;
  slug: string;
}) {
  const siteUrl = getSiteUrl();
  const productUrl = `${siteUrl}/products/${product.slug}`;
  const imageUrl = product.image.startsWith("http") ? product.image : `${siteUrl}${product.image}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}/#product`,
    name: `LeemsDTT ${product.name} (${product.size}) — Premium Red Palm Oil`,
    description: product.description,
    image: [imageUrl],
    brand: {
      "@type": "Brand",
      name: "LeemsDTT",
    },
    manufacturer: {
      "@type": "Organization",
      name: "ValorTrust Integrated Services Ltd",
    },
    category: "Food & Grocery > Cooking Oils > Palm Oil",
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "ValorTrust Integrated Services Ltd",
      },
    },
  };
}

/**
 * Breadcrumb Schema Generator
 */
export function getBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

/**
 * Service Schema for Bulk & Wholesale Supply
 */
export function getBulkServiceSchema() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Bulk Palm Oil Wholesale & Commercial Supply",
    provider: {
      "@id": `${siteUrl}/#organization`,
    },
    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },
    description: "Scheduled commercial supply of 100% pure, unadulterated red palm oil in 500ml, 1L, 3L, 5L, and 25L jerrycans for hotels, supermarkets, restaurants, caterers, and wholesalers across Nigeria.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "LeemsDTT Packaging Formats",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "LeemsDTT 500ml Household Bottle" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "LeemsDTT 1L Family Pack" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "LeemsDTT 3L Catering Pack" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "LeemsDTT 5L Vendor & Family Jug" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "LeemsDTT 25L Commercial Jerrycan" } },
      ],
    },
  };
}
