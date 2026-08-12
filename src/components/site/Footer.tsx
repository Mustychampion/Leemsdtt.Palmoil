import logo from "@/assets/leemsdtt-logo.png";
import { Link } from "@tanstack/react-router";
import { Instagram, Globe, TicketCheckIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary-deep text-white/80">
      <div className="container mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <img src={logo} alt="LeemsDTT" className="h-12 w-12" />
            <div>
              <div className="font-display text-xl text-white">LeemsDTT</div>
              <div className="text-xs uppercase tracking-[0.18em] text-white/60">Premium Palm Oil</div>
            </div>
          </div>
          <p className="max-w-md text-sm leading-relaxed">
            A brand of <strong className="text-white">ValorTrust Integrated Services Ltd</strong> (RC 9268182).
            Trusted palm oil supply for households, businesses, and bulk buyers across Nigeria.
          </p>
        </div>
        <div>
          <div className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-[var(--gold)]">Products</Link></li>
            <li><Link to="/bulk-supply" className="hover:text-[var(--gold)]">Bulk Supply</Link></li>
            <li><Link to="/distributors" className="hover:text-[var(--gold)]">Distributors</Link></li>
            <li><Link to="/about" className="hover:text-[var(--gold)]">About</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--gold)]">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</div>
          <ul className="space-y-2 text-sm">
            <li>+234 803 953 5043 / +234 703 437 2698</li>
            <li>sales@leemsdtt.com</li>
            <li>Mon – Sat · 8am – 6pm WAT</li>
            <li>Kano, Nigeria</li>
            <li>
              <a href="https://www.valortrustgroupco.fu.name.ng" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold)] inline-flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" /> www.valortrustgroupco.name.ng
              </a>
            </li>
            <li>
              <a href="https://instagram.com/leemsdtt" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold)] inline-flex items-center gap-1.5">
                <Instagram className="h-3.5 w-3.5" /> @leemsdtt
              </a>
            </li>
            <li>
              <a href="https://tiktok.com/leemsdtt" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold)] inline-flex items-center gap-1.5">
                <TicketCheckIcon className="h-3.5 w-3.5" /> @leemsdtt
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <div>© {new Date().getFullYear()} LeemsDTT · ValorTrust Integrated Services Ltd. All rights reserved.</div>
          <div>Made for Nigerian buyers who refuse to compromise.</div>
        </div>
      </div>
    </footer>
  );
}