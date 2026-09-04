import { useEffect, useState } from "react";
import { db } from "@/integrations/firebase/client";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  CalendarDays,
  User,
  Clock,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  published: boolean;
  createdAt: any;
  updatedAt: any;
}

function formatDate(ts: any): string {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function BlogCard({ post }: { post: BlogPost }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-border bg-background overflow-hidden hover:shadow-elegant transition-shadow duration-300 flex flex-col"
    >
      {/* Cover Image */}
      {post.coverImageUrl && (
        <div className="relative overflow-hidden h-52">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Category + read time */}
        <div className="flex items-center justify-between mb-3">
          {post.category && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
          )}
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
            <Clock className="h-3 w-3" />
            {estimateReadTime(post.content)}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-display text-xl font-semibold text-foreground mb-2 leading-snug">
          {post.title}
        </h2>

        {/* Excerpt highlight */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{post.excerpt}</p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-4">
          {post.author && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" /> {post.author}
            </span>
          )}
          {post.createdAt && (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" /> {formatDate(post.createdAt)}
            </span>
          )}
        </div>

        {/* Read More / Collapse button */}
        <Button
          variant={expanded ? "ghost" : "outline"}
          size="sm"
          className="w-full text-xs font-semibold gap-1.5 border-primary/30 hover:border-primary/60 hover:text-primary transition-colors"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" /> Show Less
            </>
          ) : (
            <>
              Read More <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </Button>

        {/* Expandable full content */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-5 border-t border-border mt-4">
                <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none text-sm text-foreground/85 leading-relaxed whitespace-pre-line">
                  {post.content}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

interface BlogProps {
  /** Max number of posts to show. If omitted, shows all. */
  limit?: number;
  /** Whether to show the section heading (for homepage preview use false and add your own) */
  showHeading?: boolean;
}

export function Blog({ limit, showHeading = true }: BlogProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "blog_posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost));
        setPosts(limit ? all.slice(0, limit) : all);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [limit]);

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-secondary/30 h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <BookOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No articles published yet. Check back soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6">
        {showHeading && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <div className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-4">
                LeemsDTT Blog
              </div>
              <h2 className="text-4xl md:text-5xl text-foreground">
                Insights, news &amp; <em className="text-primary not-italic">palm oil knowledge</em>.
              </h2>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed max-w-xl">
                Tips, industry updates, and sourcing guidance from the LeemsDTT team.
              </p>
            </div>
            <Button asChild variant="outline" size="lg" className="text-xs font-semibold gap-2 border-primary/30 shrink-0">
              <Link to="/blog">
                View all articles <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
