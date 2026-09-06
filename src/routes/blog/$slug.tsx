import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { db } from "@/integrations/firebase/client";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  CalendarDays,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Check,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Building,
  PhoneCall,
} from "lucide-react";
import { getSeoMeta, getBreadcrumbSchema, getBlogPostingSchema } from "@/lib/seo";
import { CORNERSTONE_ARTICLES, type BlogArticleData } from "@/data/blogArticles";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const slug = params.slug;
    const article = CORNERSTONE_ARTICLES[slug] || null;
    return { slug, article };
  },
  head: ({ params, loaderData }) => {
    const slug = params?.slug || loaderData?.slug || "digital-transformation-nigerian-businesses";
    const fallback = loaderData?.article || CORNERSTONE_ARTICLES[slug];

    const title = (fallback?.seoTitle || (fallback ? fallback.title : "Article")) + " | LeemsDTT Nigeria";
    const description = fallback?.metaDescription || fallback?.excerpt || "Read insightful articles and practical technology roadmaps from LeemsDTT Nigeria.";
    const image = fallback?.coverImageUrl || "/images/digital-transformation-nigerian-businesses.jpg";

    const seo = getSeoMeta({
      title,
      description,
      path: `/blog/${slug}`,
      image,
      type: "article",
      publishedTime: fallback?.publishedAt,
      modifiedTime: fallback?.updatedAt,
    });

    const articleSchema = getBlogPostingSchema({
      title: fallback?.title || title,
      description,
      slug,
      image,
      datePublished: fallback?.publishedAt,
      dateModified: fallback?.updatedAt,
      author: fallback?.author || "LEEMS DTT",
      category: fallback?.category,
      keywords: fallback?.secondaryKeywords || fallback?.tags,
    });

    const breadcrumbs = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: fallback?.title || slug, path: `/blog/${slug}` },
    ]);

    return {
      ...seo,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(articleSchema) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs) },
      ],
    };
  },
  component: BlogPostView,
});

function BlogPostView() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const loaderData = Route.useLoaderData();
  const [article, setArticle] = useState<BlogArticleData | null>(
    loaderData?.article || CORNERSTONE_ARTICLES[slug] || null
  );
  const [loading, setLoading] = useState(!article);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        const q = query(
          collection(db, "blog_posts"),
          where("slug", "==", slug),
          where("published", "==", true)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data();
          setArticle({
            id: snapshot.docs[0].id,
            slug: docData.slug || slug,
            title: docData.title || "",
            seoTitle: docData.seoTitle || docData.title || "",
            metaDescription: docData.metaDescription || docData.excerpt || "",
            primaryKeyword: docData.primaryKeyword || "",
            secondaryKeywords: docData.secondaryKeywords || [],
            category: docData.category || "General",
            tags: docData.tags || [],
            author: docData.author || "LEEMS DTT",
            excerpt: docData.excerpt || "",
            coverImageUrl: docData.coverImageUrl || "/images/digital-transformation-nigerian-businesses.jpg",
            imageAlt: docData.title || "LeemsDTT article cover",
            published: docData.published ?? true,
            publishedAt: docData.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
            updatedAt: docData.updatedAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
            content: docData.content || "",
          });
        }
      } catch (e) {
        console.error("Failed to load article from Firestore:", e);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Article link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== "undefined" && article) {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`${article.title}\n\nRead here: ${window.location.href}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    }
  };

  const handleShareLinkedIn = () => {
    if (typeof window !== "undefined" && article) {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
    }
  };

  const handleShareX = () => {
    if (typeof window !== "undefined" && article) {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`${article.title}`);
      window.open(`https://x.com/intent/tweet?url=${url}&text=${text}&via=Leemsdtt`, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20 container mx-auto px-6 max-w-4xl animate-pulse space-y-6">
          <div className="h-6 w-32 bg-secondary/50 rounded" />
          <div className="h-12 w-3/4 bg-secondary/50 rounded" />
          <div className="h-64 w-full bg-secondary/30 rounded-2xl" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-secondary/40 rounded" />
            <div className="h-4 w-5/6 bg-secondary/40 rounded" />
            <div className="h-4 w-4/6 bg-secondary/40 rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-36 pb-24 container mx-auto px-6 text-center max-w-lg">
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">Article Not Found</h1>
          <p className="text-muted-foreground text-sm mb-6">
            The article you requested could not be located or may have been moved.
          </p>
          <Button asChild variant="gold">
            <Link to="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate read time
  const wordCount = article.content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-20">
        <article className="container mx-auto px-4 sm:px-6 max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8 overflow-x-auto py-1">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="text-foreground truncate">{article.title}</span>
          </nav>

          {/* Header Metadata */}
          <header className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                {article.category || "Digital Transformation"}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {readTime} min read
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                {new Date(article.publishedAt).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-[1.18] tracking-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-sans border-l-4 border-[var(--gold)] pl-4 py-1 italic bg-secondary/20 rounded-r-lg">
                {article.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border flex-wrap gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs border border-primary/25">
                  LD
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground flex items-center gap-1">
                    {article.author}
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    ValorTrust Integrated Services Ltd
                  </div>
                </div>
              </div>

              {/* Social share actions */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground mr-1 hidden sm:inline">Share:</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs px-2.5 gap-1.5"
                  onClick={handleShareWhatsApp}
                  title="Share on WhatsApp"
                >
                  <Share2 className="h-3 w-3 text-emerald-600" /> WhatsApp
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs px-2.5 gap-1.5"
                  onClick={handleShareLinkedIn}
                  title="Share on LinkedIn"
                >
                  LinkedIn
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs px-2.5 gap-1.5"
                  onClick={handleShareX}
                  title="Share on X"
                >
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs px-2"
                  onClick={handleCopyLink}
                  title="Copy link"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : "Copy"}
                </Button>
              </div>
            </div>
          </header>

          {/* Featured Banner Image */}
          {article.coverImageUrl && (
            <figure className="mb-12 rounded-2xl overflow-hidden border border-border shadow-lg bg-secondary/10">
              <img
                src={article.coverImageUrl}
                alt={article.imageAlt || article.title}
                className="w-full h-auto object-cover max-h-[500px]"
                loading="eager"
              />
              <figcaption className="p-3 text-center text-xs text-muted-foreground bg-secondary/30 border-t border-border/60">
                {article.imageAlt || "Digital transformation and practical technology capabilities for Nigerian businesses — LEEMS DTT."}
              </figcaption>
            </figure>
          )}

          {/* Core Framework Highlight Callout */}
          <div className="my-8 p-6 rounded-2xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Sparkles className="h-4 w-4" /> Core LEEMS DTT Framework
            </div>
            <div className="text-center py-2">
              <p className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-wide">
                Business Need <span className="text-primary mx-1">→</span> Appropriate Technology <span className="text-primary mx-1">→</span> Measurable Benefit
              </p>
            </div>
          </div>

          {/* Article Main Text */}
          <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/90 text-base leading-relaxed space-y-6">
            {article.content.split("\n\n").map((paragraph, idx) => {
              const trimmed = paragraph.trim();

              if (!trimmed) return null;

              if (trimmed.startsWith("## ")) {
                return (
                  <h2 key={idx} className="font-display text-2xl sm:text-3xl font-bold text-foreground pt-6 pb-2 border-b border-border/80">
                    {trimmed.replace(/^## /, "")}
                  </h2>
                );
              }

              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={idx} className="font-display text-xl sm:text-2xl font-semibold text-foreground pt-4 pb-1 text-primary">
                    {trimmed.replace(/^### /, "")}
                  </h3>
                );
              }

              if (trimmed === "---") {
                return <hr key={idx} className="my-8 border-border" />;
              }

              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                const items = trimmed.split("\n").map((line) => line.replace(/^[-*]\s+/, ""));
                return (
                  <ul key={idx} className="list-disc pl-6 space-y-1.5 my-4">
                    {items.map((item, iIdx) => (
                      <li key={iIdx} className="text-foreground/90">{item}</li>
                    ))}
                  </ul>
                );
              }

              if (/^\d+\.\s/.test(trimmed)) {
                const items = trimmed.split("\n").map((line) => line.replace(/^\d+\.\s+/, ""));
                return (
                  <ol key={idx} className="list-decimal pl-6 space-y-1.5 my-4">
                    {items.map((item, iIdx) => (
                      <li key={iIdx} className="text-foreground/90">{item}</li>
                    ))}
                  </ol>
                );
              }

              return (
                <p key={idx} className="leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-border flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground mr-1">Topics:</span>
              {article.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2.5 py-1 rounded-md bg-secondary text-xs text-foreground/80 font-medium border border-border/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Professional B2B Call-to-Action Card */}
          <section className="mt-14 p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/30 to-primary/5 border border-primary/25 shadow-elegant">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/25">
                <Building className="h-3.5 w-3.5" /> ValorTrust Capability Group
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Need Help Planning Your Digital Transformation?
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Every business has different operational challenges. The right technology starts with understanding those challenges.
                LEEMS DTT helps businesses assess their digital needs, identify practical technology opportunities, and implement systems aligned with their operational objectives.
              </p>
              <div className="pt-2 flex flex-wrap gap-3 items-center">
                <Button asChild variant="gold" size="lg" className="font-semibold text-xs gap-2">
                  <a href="https://wa.me/2348039535043?text=Hello%20LeemsDTT%2C%20I%20read%20your%20digital%20transformation%20article%20and%20would%20like%20to%20consult%20with%20your%20team." target="_blank" rel="noopener noreferrer">
                    <PhoneCall className="h-4 w-4" /> WhatsApp / Call 0803 953 5043
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-xs font-semibold border-primary/30 gap-1.5">
                  <a href="https://x.com/Leemsdtt" target="_blank" rel="noopener noreferrer">
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Follow @Leemsdtt on X
                  </a>
                </Button>
                <Button asChild variant="ghost" size="lg" className="text-xs font-semibold">
                  <Link to="/contact">
                    Contact Form
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Button asChild variant="ghost" className="gap-2 text-xs">
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4" /> Return to all articles
              </Link>
            </Button>
          </div>
        </article>
      </main>

      <Footer />
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
