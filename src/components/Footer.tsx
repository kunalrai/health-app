import Link from 'next/link';
import { Activity, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';

const quickLinks = [
  { label: 'About Us',     href: '/about' },
  { label: 'Services',     href: '/services' },
  { label: 'Appointments', href: '/appointments' },
  { label: 'Patient Portal', href: '/portal' },
  { label: 'Contact',      href: '/contact' },
];

const services = [
  'Chemotherapy', 'Radiation Therapy', 'Immunotherapy',
  'Targeted Therapy', 'Clinical Trials', 'Supportive Care',
];

export default function Footer() {
  return (
    <footer className="bg-[#0A1A25] text-white relative overflow-hidden">
      {/* Gradient accent top border */}
      <div className="h-[2px] w-full bg-gradient-to-r from-primary via-secondary to-transparent opacity-80" />

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-secondary/5 blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-14">

          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 mb-5 w-fit group">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                <Activity className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="leading-none">
                <span className="font-serif font-bold text-lg text-white tracking-tight">Hope</span>
                <span className="font-serif text-[11px] text-white/40 block -mt-0.5 tracking-widest uppercase">Oncology</span>
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Providing compassionate, cutting-edge cancer care with over 20 years of experience. Your healing journey starts here.
            </p>

            {/* Contact pills */}
            <div className="mt-6 flex flex-col gap-3">
              <a href="tel:+15552345678" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-primary" />
                (555) 234-5678
              </a>
              <a href="mailto:appointments@hopeoncology.com" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-primary" />
                appointments@hopeoncology.com
              </a>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Clock className="w-4 h-4 text-primary" />
                Mon–Fri 8am–6pm, Sat 9am–1pm
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-primary mb-5">Navigation</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="flex items-center gap-1 text-sm text-white/55 hover:text-white transition-colors group/link">
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 -translate-y-0.5 translate-x-0 group-hover/link:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-primary mb-5">Treatments</h3>
            <ul className="space-y-2.5">
              {services.map((item) => (
                <li key={item}>
                  <Link href="/services" className="text-sm text-white/55 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency card */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-primary mb-5">Emergency</h3>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-xs text-white/50 mb-1">24/7 Emergency Line</p>
              <a href="tel:+15552349999" className="font-mono text-lg font-semibold text-white hover:text-primary transition-colors">
                (555) 234-9999
              </a>
              <p className="text-xs text-white/40 mt-2 leading-relaxed">
                Available around the clock for urgent patient needs.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-7 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} Hope Oncology. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs">
            <Link href="/privacy" className="text-white/35 hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="text-white/35 hover:text-white/70 transition-colors">Terms of Service</Link>
            <Link href="/admin"   className="text-white/35 hover:text-white/70 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
