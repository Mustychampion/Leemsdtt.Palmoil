import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Do you supply in bulk?", a: "Yes. We supply hotels, supermarkets, restaurants, caterers, retailers, wholesalers and distributors with volume orders in 1L, 3L, and 5L formats." },
  { q: "How can I become a distributor?", a: "Fill out the distributor application form on this page. Our team reviews every submission and responds within 2 business days." },
  { q: "What locations do you serve?", a: "We deliver across Nigeria, with dedicated coverage from our base of operations and partner logistics for nationwide reach." },
  { q: "How do I place an order?", a: "Use the contact form, call us, or message on WhatsApp. We confirm availability, pricing, and delivery timeline in the same conversation." },
  { q: "What packaging sizes are available?", a: "500ml, 1L, 3L, and 5L — built to cover households, retail shelves, food businesses, and bulk institutional buyers." },
  { q: "Can businesses order directly?", a: "Absolutely. Restaurants, hotels, supermarkets, and caterers are welcome to set up direct supply arrangements with stable pricing." },
];

export function Faq() {
  return (
    <section id="faq" className="py-24 md:py-32 bg-secondary/50">
      <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-4">
            Frequently Asked
          </div>
          <h2 className="text-4xl md:text-5xl text-foreground sticky top-28">
            Answers to the questions buyers <em className="text-primary not-italic">actually ask</em>.
          </h2>
        </div>
        <div className="lg:col-span-8">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-xl bg-background px-6 data-[state=open]:shadow-card">
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </section>
  );
}