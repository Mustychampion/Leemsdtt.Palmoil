import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import logo from "@/assets/leemsdtt-logo.png";
import { useEffect, useState } from "react";
import { auth } from "@/integrations/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

const nav = [
  { label: "Products", to: "/products" },
  { label: "Bulk Supply", to: "/bulk-supply" },
  { label: "Distributors", to: "/distributors" },
  { label: "Quality", to: "/quality" },
  { label: "Industries", to: "/industries" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setHasSession(!!user));
    return () => unsubscribe();
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="LeemsDTT" className="h-11 w-11 object-contain" />
          <div className="leading-tight">
            <div className={`font-display text-lg font-semibold ${scrolled ? "text-foreground" : "text-white"}`}>
              LeemsDTT
            </div>
            <div className={`text-[10px] uppercase tracking-[0.18em] ${scrolled ? "text-muted-foreground" : "text-white/70"}`}>
              Premium Palm Oil
            </div>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-7">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to as any}
              className={`text-sm font-medium transition-colors ${
                scrolled ? "text-foreground/80 hover:text-primary" : "text-white/85 hover:text-[var(--gold)]"
              }`}
              activeProps={{ className: scrolled ? "text-primary font-semibold" : "text-[var(--gold)] font-semibold" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {hasSession && (
            <Button asChild variant="ghost" size="sm" className={scrolled ? "" : "text-white hover:text-[var(--gold)] hover:bg-white/10"}>
              <Link to="/admin">Dashboard</Link>
            </Button>
          )}
          <Button asChild variant="hero" size="default" className="hidden sm:inline-flex">
            <Link to="/contact">Request a Quote</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}