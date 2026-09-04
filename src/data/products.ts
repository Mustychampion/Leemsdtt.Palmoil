export interface ProductDetails {
  slug: string;
  size: string;
  name: string;
  headline: string;
  description: string;
  longDescription: string;
  image: string;
  price: number;
  formattedPrice: string;
  isBulkPricing?: boolean;
  targetUsers: string[];
  features: string[];
  specs: {
    volume: string;
    containerType: string;
    sealType: string;
    shelfLife: string;
    storage: string;
    origin: string;
  };
  faqs: Array<{ q: string; a: string }>;
  relatedSlugs: string[];
}

export const MASTER_PRODUCT_ARTWORK = {
  url: "/images/leemsdtt-official-product-artwork.jpg",
  filename: "leemsdtt-official-product-artwork.jpg",
};

export const PRODUCTS_DATA: Record<string, ProductDetails> = {
  "500ml-palm-oil": {
    slug: "500ml-palm-oil",
    size: "500ml",
    name: "Household Bottle",
    headline: "Daily Home Cooking, Compact Kitchens & Gifting",
    description: "Compact 500ml bottle of 100% pure, professionally processed Nigerian red palm oil. Ideal for individual households, small kitchens, and everyday cooking.",
    longDescription: "The LeemsDTT 500ml Household Bottle is designed for buyers who require premium quality in a convenient, space-saving format. Sourced from choice oil palm fruit bunches in southern Nigeria, this batch-tested oil maintains natural aroma, rich red beta-carotene color, and heat stability without artificial colorants or chemical additives.",
    image: "/images/500ml.png",
    price: 1500,
    formattedPrice: "₦1,500",
    targetUsers: ["Households", "Small Kitchens", "Retail Buyers", "Gift Hampers"],
    features: [
      "100% pure unadulterated red palm oil",
      "Tamper-evident sealed food-grade bottle",
      "Rich natural aroma & vibrant palm carotenoids",
      "Zero artificial dyes, Sudan dyes, or preservatives",
      "Convenient pour spout for easy kitchen handling",
    ],
    specs: {
      volume: "500 Millilitres",
      containerType: "PET Food-Grade Transparent Bottle",
      sealType: "Tamper-Proof Screw Cap with Inner Seal",
      shelfLife: "18 to 24 Months (Unopened)",
      storage: "Store in a cool, dry place away from direct sun",
      origin: "Nigeria (Processed under ValorTrust Quality Controls)",
    },
    faqs: [
      {
        q: "Is the 500ml LeemsDTT palm oil suitable for daily cooking?",
        a: "Yes, it is specially bottled for daily household meals like soups, stews, beans, and traditional Nigerian dishes.",
      },
      {
        q: "Can retail stores stock the 500ml format?",
        a: "Absolutely. Supermarkets and retail shops stock 500ml bottles for customers who prefer smaller, fresh purchases.",
      },
    ],
    relatedSlugs: ["1l-palm-oil", "3l-palm-oil", "5l-palm-oil"],
  },
  "1l-palm-oil": {
    slug: "1l-palm-oil",
    size: "1L",
    name: "Family Pack",
    headline: "Regular Family Meals, Food Vendors & Market Resale",
    description: "1 Litre family pack of pure Nigerian palm oil. Carefully packaged for regular family meal preparation, food stalls, and retail shelves.",
    longDescription: "The LeemsDTT 1L Family Pack provides the perfect balance between volume and convenience. Every bottle undergoes stringent clarification to ensure smooth texture, free fatty acid (FFA) balance, and zero sediment settling. Supplied across Nigeria for dependable kitchen performance.",
    image: "/images/1L2.png",
    price: 2800,
    formattedPrice: "₦2,800",
    targetUsers: ["Regular Households", "Small Food Vendors", "Supermarket Shelves", "Market Resellers"],
    features: [
      "High natural vitamin A & E content preserved",
      "Durable food-grade bottle with grip handles",
      "Batch-tested for clarity and low FFA",
      "Consistent color & natural aroma in every bottle",
      "Ideal for weekly home cooking & retail sales",
    ],
    specs: {
      volume: "1 Litre (1,000 ml)",
      containerType: "Heavy-Duty PET Food-Grade Bottle",
      sealType: "Pressure-Sealed Security Cap",
      shelfLife: "24 Months",
      storage: "Cool, dry ambient temperature",
      origin: "Nigeria",
    },
    faqs: [
      {
        q: "How many meals does a 1L bottle serve?",
        a: "Depending on kitchen usage, 1 Litre typically serves an average Nigerian family for 1 to 2 weeks of regular cooking.",
      },
      {
        q: "Do you offer carton discounts for 1L bottles?",
        a: "Yes, wholesale buyers and retailers can order 1L bottles by the carton with tiered bulk pricing.",
      },
    ],
    relatedSlugs: ["500ml-palm-oil", "3l-palm-oil", "5l-palm-oil"],
  },
  "3l-palm-oil": {
    slug: "3l-palm-oil",
    size: "3L",
    name: "Catering Pack",
    headline: "Restaurants, Caterers, Boarding Kitchens & Bulk Buyers",
    description: "3 Litre catering pack tailored for fast-paced commercial kitchens, event caterers, restaurants, and larger households needing steady supply.",
    longDescription: "Built for active kitchens that demand consistent taste and high thermal stability. The LeemsDTT 3L Catering Pack eliminates constant repurchasing while ensuring your cooks work with clean, unadulterated red palm oil that enhances every dish.",
    image: "/images/3L2.png",
    price: 8200,
    formattedPrice: "₦8,200",
    targetUsers: ["Restaurants & Buka Eateries", "Event Caterers", "Boarding Schools", "Weekly Bulk Households"],
    features: [
      "Commercial volume in an easy-pour ergonomically handles jug",
      "Zero adulteration guarantees authentic taste across dishes",
      "Batch-tested under ValorTrust QA guidelines",
      "Secure seal prevents leakage during transit",
      "Cost-effective per-litre pricing for business buyers",
    ],
    specs: {
      volume: "3 Litres (3,000 ml)",
      containerType: "HDPE Food-Grade Jug with Ergonomic Handle",
      sealType: "Induction Heat Sealed Security Cap",
      shelfLife: "24 Months",
      storage: "Store upright in cool environment",
      origin: "Nigeria",
    },
    faqs: [
      {
        q: "Why do restaurants prefer the 3L LeemsDTT jug?",
        a: "The 3L jug is easy to pour directly into cooking pots without spills while giving commercial kitchens several days of high-volume cooking.",
      },
    ],
    relatedSlugs: ["1l-palm-oil", "5l-palm-oil", "25l-palm-oil"],
  },
  "5l-palm-oil": {
    slug: "5l-palm-oil",
    size: "5L",
    name: "Vendor & Family Jug",
    headline: "Extended Families, Food Vendors & Regular Commercial Cooking",
    description: "5 Litre high-capacity jug for extended families, commercial food vendors, and weekly catering supply. Clean, batch-tested, and built for heavy kitchen use.",
    longDescription: "The 5L Vendor & Family Jug is one of LeemsDTT's most popular commercial formats across Nigeria. It combines high volume with food-grade HDPE protection, ensuring that large families, canteens, and food businesses never run dry.",
    image: "/images/5L2.png",
    price: 13500,
    formattedPrice: "₦13,500",
    targetUsers: ["Extended Families", "Commercial Canteens", "Small Hotels", "Food Vendors"],
    features: [
      "Maximum capacity in standard jug format",
      "Heavy-duty HDPE container built for transport resilience",
      "Guaranteed 100% pure palm oil with natural carotenoid profile",
      "Strict quality testing against adulteration and artificial color",
      "Bulk pricing advantage for regular buyers",
    ],
    specs: {
      volume: "5 Litres (5,000 ml)",
      containerType: "Reinforced HDPE Food-Grade Container",
      sealType: "Security Ring Tamper-Evident Screw Cap",
      shelfLife: "24 Months",
      storage: "Keep in shaded storage area",
      origin: "Nigeria",
    },
    faqs: [
      {
        q: "Can I subscribe for regular monthly 5L deliveries?",
        a: "Yes, businesses and households can set up scheduled weekly or monthly supply agreements with LeemsDTT.",
      },
    ],
    relatedSlugs: ["3l-palm-oil", "25l-palm-oil", "1l-palm-oil"],
  },
  "25l-palm-oil": {
    slug: "25l-palm-oil",
    size: "25L",
    name: "Bulk Jerrycan",
    headline: "Hotels, Supermarkets, Wholesalers & Institutional Supply",
    description: "Heavy-duty 25 Litre commercial jerrycan for wholesale distributors, hotels, supermarkets, institutional kitchens, and major food processors.",
    longDescription: "The 25L Bulk Jerrycan represents LeemsDTT's core B2B commercial supply asset. Built for heavy commercial transport across Nigerian routes, every 25L container provides 100% pure, unadulterated red palm oil with verified FFA stability, ideal for high-volume commercial kitchens, bulk repackaging, or wholesale resale.",
    image: "/images/25L.png",
    price: 65000,
    formattedPrice: "Contact for Bulk Pricing",
    isBulkPricing: true,
    targetUsers: ["Wholesalers & Distributors", "Hotels & Resorts", "Supermarket Networks", "Institutional Kitchens", "Industrial Food Processors"],
    features: [
      "Maximum bulk savings for high-volume commercial purchasers",
      "Heavy-duty double-walled commercial jerrycan",
      "Batch trace code on every container for quality accountability",
      "Guaranteed consistent viscosity, color, and aroma",
      "Direct account management and scheduled logistics dispatch",
    ],
    specs: {
      volume: "25 Litres (25,000 ml)",
      containerType: "Industrial Grade HDPE Commercial Jerrycan",
      sealType: "Heavy-Duty Threaded Plug + Security Ring Cap",
      shelfLife: "24 Months",
      storage: "Store on pallets in covered warehouse environment",
      origin: "Nigeria",
    },
    faqs: [
      {
        q: "What is the minimum order quantity for 25L bulk jerrycans?",
        a: "Single jerrycans can be ordered for business trial, while wholesale discounts apply for orders starting from 10 units up to full truckloads.",
      },
      {
        q: "Do you deliver 25L jerrycans across Nigeria?",
        a: "Yes, we dispatch 25L commercial orders from our base of operations in Kano to Abuja, Kaduna, Lagos, and nationwide locations.",
      },
    ],
    relatedSlugs: ["5l-palm-oil", "3l-palm-oil", "1l-palm-oil"],
  },
};
