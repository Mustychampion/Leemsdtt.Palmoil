import logo from "@/assets/leemsdtt-logo.png";
import { Link } from "@tanstack/react-router";
import { Instagram, Globe, TicketCheckIcon, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary-deep text-white/80">
      <div className="container mx-auto px-6 py-16 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <img src={logo} alt="LeemsDTT" className="h-12 w-12" />
            <div>
              <div className="font-display text-xl text-white">LeemsDTT</div>
              <div className="text-xs uppercase tracking-[0.18em] text-[var(--gold)]">Premium Palm Oil</div>
            </div>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/75 mb-4">
            A flagship brand of <strong className="text-white">ValorTrust Integrated Services Ltd</strong> (RC 9268182).
            Trusted palm oil supply for households, retail, restaurants, hotels, supermarkets, and bulk distributors across Nigeria.
          </p>
          <div className="text-xs text-white/60 space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[var(--gold)]" /> Kano, Nigeria (Base of Operations)
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-[var(--gold)]" /> leemsdtt.valortrust@gmail.com
            </div>
          </div>
        </div>

        <div>
          <div className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Packaging Formats</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products/500ml-palm-oil" className="hover:text-[var(--gold)]">500ml Household</Link></li>
            <li><Link to="/products/1l-palm-oil" className="hover:text-[var(--gold)]">1L Family Pack</Link></li>
            <li><Link to="/products/3l-palm-oil" className="hover:text-[var(--gold)]">3L Catering Pack</Link></li>
            <li><Link to="/products/5l-palm-oil" className="hover:text-[var(--gold)]">5L Vendor & Family</Link></li>
            <li><Link to="/products/25l-palm-oil" className="hover:text-[var(--gold)]">25L Commercial Jerrycan</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Solutions & Company</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/bulk-supply" className="hover:text-[var(--gold)]">Bulk & Wholesale</Link></li>
            <li><Link to="/distributors" className="hover:text-[var(--gold)]">Distributor Program</Link></li>
            <li><Link to="/quality" className="hover:text-[var(--gold)]">Quality Standards</Link></li>
            <li><Link to="/industries" className="hover:text-[var(--gold)]">Industry Hub</Link></li>
            <li><Link to="/insights" className="hover:text-[var(--gold)]">Palm Oil Insights</Link></li>
            <li><Link to="/blog" className="hover:text-[var(--gold)]">Blog & News</Link></li>
            <li><Link to="/about" className="hover:text-[var(--gold)]">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--gold)]">Contact & Quotes</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact & Connect</div>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-[var(--gold)] shrink-0" />
              <a href="tel:+2348039535043" className="hover:text-[var(--gold)]">+234 803 953 5043</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-[var(--gold)] shrink-0" />
              <a href="tel:+2347034372698" className="hover:text-[var(--gold)]">+234 703 437 2698</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-[var(--gold)] shrink-0" />
              <a href="mailto:leemsdtt.valortrust@gmail.com" className="hover:text-[var(--gold)] truncate">leemsdtt.valortrust@gmail.com</a>
            </li>
            <li className="text-xs text-white/60 pt-1">
              Mon – Sat: 8:00 AM – 6:00 PM WAT
            </li>
            <li className="pt-2 flex flex-col gap-1.5 text-xs">
              <a href="https://www.valortrustgroupco.name.ng" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold)] inline-flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" /> www.valortrustgroupco.name.ng
              </a>
              <a href="https://instagram.com/leemsdtt" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold)] inline-flex items-center gap-1.5">
                <Instagram className="h-3.5 w-3.5" /> @leemsdtt
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <div>© {new Date().getFullYear()} LeemsDTT • ValorTrust Integrated Services Ltd (RC 9268182). All rights reserved.</div>
          <div>Built for Nigerian buyers who refuse to compromise.</div>
        </div>
      </div>
    </footer>
  );
}