'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, Activity } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Home',         href: '/' },
  { name: 'About',        href: '/about' },
  { name: 'Services',     href: '/services' },
  { name: 'Appointments', href: '/appointments' },
  { name: 'Contact',      href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [isMobileMenuOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100/80 shadow-[0_1px_12px_rgba(13,115,119,0.08)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-[0_2px_8px_rgba(13,115,119,0.3)] group-hover:shadow-[0_4px_14px_rgba(13,115,119,0.4)] transition-shadow">
              <Activity className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="leading-none">
              <span className="font-serif font-bold text-lg text-primary tracking-tight">Dr. Veenoo</span>
              <span className="font-serif text-[11px] text-text-secondary block -mt-0.5 tracking-widest uppercase">Oncologist</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-primary bg-primary/8'
                      : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {item.name}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+15552345678"
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5" />
              +91-9667769023
            </a>
            <Link
              href="/portal"
              className="btn btn-primary text-sm px-5 py-2.5 rounded-[10px]"
            >
              Patient Portal
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen
              ? <X className="w-5 h-5 text-text-primary" />
              : <Menu className="w-5 h-5 text-text-primary" />
            }
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-5 animate-fade-in">
            <div className="glass rounded-2xl border border-white/60 p-4 flex flex-col gap-1">
              {navigation.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active ? 'text-primary bg-primary/8' : 'text-text-secondary hover:text-primary hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="border-t border-gray-100 my-2" />
              <a href="tel:+919667769023" className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary">
                <Phone className="w-4 h-4" /> +91-9667769023
              </a>
              <Link
                href="/portal"
                className="btn btn-primary justify-center text-sm mt-1 py-3 rounded-xl"
                onClick={() => setIsMobileOpen(false)}
              >
                Patient Portal
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
