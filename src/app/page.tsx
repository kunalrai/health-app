import Link from 'next/link';
import {
  Shield, Award, Users, Heart, Clock, ChevronRight,
  Activity, Star, ArrowUpRight, Phone, CheckCircle2,
} from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';

const services = [
  {
    icon: <Shield className="w-6 h-6 text-primary" />,
    title: 'Breast Cancer',
    description: 'Comprehensive breast cancer care — from early detection and diagnosis through surgery, chemotherapy, targeted therapy, and survivorship.',
  },
  {
    icon: <Award className="w-6 h-6 text-primary" />,
    title: 'Lung Cancer',
    description: 'Expert management of all lung cancer types using the latest immunotherapy, targeted therapy, and chemotherapy protocols.',
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: 'Neuroendocrine Cancer',
    description: 'Specialized treatment for neuroendocrine tumors (NETs) including PRRT, somatostatin analogues, and systemic therapies.',
  },
  {
    icon: <Heart className="w-6 h-6 text-primary" />,
    title: 'Gastrointestinal Cancers',
    description: 'Advanced care for stomach, colorectal, and esophageal cancers using evidence-based systemic treatments and clinical trial access.',
  },
  {
    icon: <Clock className="w-6 h-6 text-primary" />,
    title: 'Gynaecological Cancers',
    description: 'Compassionate, expert treatment for ovarian and cervical cancers with personalised chemotherapy and targeted therapy plans.',
  },
  {
    icon: <Shield className="w-6 h-6 text-primary" />,
    title: 'Prostate Cancer',
    description: 'Evidence-based prostate cancer management including hormone therapy, chemotherapy, and emerging targeted treatments.',
  },
];

const stats = [
  { value: '20+',   label: 'Years Experience',    sub: 'India, UK & Australia' },
  { value: '3',     label: 'Clinic Locations',    sub: 'Delhi & Gurugram' },
  { value: 'FRACP', label: 'Australian Fellowship', sub: 'Medical Oncology' },
  { value: '9+',    label: 'Cancer Types Treated', sub: 'Comprehensive care' },
];

const testimonials = [
  {
    name: 'Rajesh Sharma',
    quote: 'Dr. Veenoo Agarwal guided us through my wife\'s breast cancer treatment with remarkable expertise and compassion. Her international training and personalised approach gave us hope and confidence at every step.',
    treatment: 'Breast Cancer Caregiver',
    years: '2 years',
    rating: 5,
  },
  {
    name: 'Anita Mehta',
    quote: 'After being diagnosed with lung cancer, I was terrified. Dr. Agarwal explained my options clearly, involved me in every decision, and her team made me feel supported throughout my entire journey.',
    treatment: 'Lung Cancer Survivor',
    years: '18 months',
    rating: 5,
  },
  {
    name: 'Suresh Patel',
    quote: 'Dr. Veenoo\'s experience across India, UK, and Australia really shows. She brings world-class oncology knowledge to her patients here. I am grateful for her care during my colorectal cancer treatment.',
    treatment: 'Colorectal Cancer Survivor',
    years: '1 year',
    rating: 5,
  },
];

const trustBadges = [
  { icon: <Award className="w-4 h-4" />,        label: 'FRACP (Medical Oncology, Australia)' },
  { icon: <CheckCircle2 className="w-4 h-4" />,  label: 'MBBS — Christian Medical College' },
  { icon: <Shield className="w-4 h-4" />,        label: 'SHALBY International Hospitals' },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden mesh-bg pt-20">
        {/* Ambient blobs */}
        <div className="blob w-[520px] h-[520px] bg-primary    top-[-80px]   left-[-120px]"  style={{ animationDelay: '0s' }} />
        <div className="blob w-[400px] h-[400px] bg-secondary  bottom-[-60px] right-[-80px]" style={{ animationDelay: '3s' }} />
        <div className="blob w-[280px] h-[280px] bg-accent     bottom-[20%]   left-[5%]"     style={{ animationDelay: '1.5s', opacity: 0.08 }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left copy */}
            <div className="animate-fade-in-up">
              {/* Eyebrow badge */}
              <span className="badge badge-primary mb-6">
                <Activity className="w-3.5 h-3.5" />
                20+ Years of Expert Oncology Care
              </span>

              <h1 className="font-serif text-5xl lg:text-[3.75rem] font-bold text-text-primary leading-[1.1] tracking-tight mb-5">
                Empowering Lives in{' '}
                <span className="gradient-text">the Fight</span>
                <br className="hidden sm:block" />
                {' '}Against Cancer
              </h1>

              <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-lg">
                Dr. Veenoo Agarwal — Consultant Medical Oncologist — brings world-class
                expertise from India, the UK, and Australia to guide you through every
                step with expert care and compassion.
              </p>

              {/* CTA row */}
              <div className="flex flex-wrap gap-3 mb-10">
                <Link href="/appointments" className="btn btn-primary">
                  Book Consultation
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/services" className="btn btn-ghost">
                  Explore Services
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 pt-8 border-t border-gray-200/70">
                {trustBadges.map((b) => (
                  <div key={b.label} className="flex items-center gap-2 bg-white/80 border border-gray-100 rounded-full px-3 py-1.5 text-xs font-medium text-text-secondary shadow-sm">
                    <span className="text-primary">{b.icon}</span>
                    {b.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Doctor card */}
            <div className="relative animate-fade-in-up lg:flex lg:justify-end" style={{ animationDelay: '0.15s' }}>
              {/* Rotating ring */}
              <div className="absolute inset-[-24px] rounded-[40px] border-2 border-dashed border-primary/15 animate-spin-slow pointer-events-none hidden lg:block" />

              <div className="relative glass rounded-[28px] p-8 max-w-sm mx-auto lg:mx-0 shadow-[0_8px_48px_rgba(13,115,119,0.14)]">
                {/* Avatar */}
                <div className="flex items-start gap-5 mb-7">
                  <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center flex-shrink-0 shadow-[0_4px_16px_rgba(13,115,119,0.3)]">
                    <span className="text-3xl font-serif font-bold text-white">VA</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-text-primary leading-tight">
                      Dr. Veenoo Agarwal
                    </h3>
                    <p className="text-sm text-text-secondary mt-0.5">MBBS, FRACP</p>
                    <span className="badge badge-primary mt-2 text-[11px] px-2.5 py-1">
                      Consultant Medical Oncologist
                    </span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="bg-background rounded-2xl p-4 mb-5">
                  <p className="text-xs font-bold tracking-widest uppercase text-primary mb-3">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {['Breast Cancer', 'Lung Cancer', 'Neuroendocrine Cancer'].map((s) => (
                      <span key={s} className="text-xs bg-white border border-gray-100 text-text-secondary rounded-full px-2.5 py-1 font-medium shadow-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-primary/5 rounded-xl p-3 text-center">
                    <p className="font-serif text-2xl font-bold gradient-text">20+</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">Years Experience</p>
                  </div>
                  <div className="bg-primary/5 rounded-xl p-3 text-center">
                    <p className="font-serif text-2xl font-bold gradient-text">3</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">Clinic Locations</p>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/appointments"
                  className="mt-5 flex items-center justify-center gap-2 w-full btn btn-primary rounded-xl py-3 text-sm"
                >
                  Schedule Consultation <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bento ───────────────────────────────────────────── */}
      <section className="py-16 bg-white border-y border-gray-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="card-modern p-6 text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <p className="font-serif text-4xl font-bold gradient-text mb-1">{stat.value}</p>
                <p className="text-sm font-semibold text-text-primary">{stat.label}</p>
                <p className="text-xs text-text-secondary mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────────── */}
      <section className="py-24 gradient-bg-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="section-label mb-3">What We Treat</p>
            <div className="divider mx-auto mb-5" />
            <h2 className="font-serif text-4xl font-bold text-text-primary mb-4">
              Comprehensive Cancer Care
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Expert oncology services across a wide spectrum of cancer types —
              delivered with compassion, precision, and the latest medical advances.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <ServiceCard {...service} index={i} />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/services" className="btn btn-ghost">
              View All Services <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="section-label mb-3">Patient Stories</p>
            <div className="divider mx-auto mb-5" />
            <h2 className="font-serif text-4xl font-bold text-text-primary mb-4">
              Voices of Hope
            </h2>
            <p className="text-text-secondary">
              Real stories from patients who have walked this journey with Dr. Veenoo Agarwal.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="card-modern p-7 flex flex-col animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>

                {/* Quote mark */}
                <span className="font-serif text-5xl leading-none text-primary/20 mb-1 select-none">&ldquo;</span>

                <p className="text-text-secondary text-sm leading-relaxed flex-1 mb-6 -mt-2">
                  {t.quote}
                </p>

                <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-text-primary">{t.name}</p>
                    <p className="text-xs text-primary font-medium">{t.treatment} · {t.years}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg" />
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <span className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Heart className="w-3.5 h-3.5" /> Personalised Care for Every Patient
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-5 leading-tight">
            Ready to Begin Your<br />Healing Journey?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Schedule a consultation with Dr. Veenoo Agarwal and take the first step
            toward expert, compassionate cancer care.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/appointments"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-7 py-3.5 rounded-[10px] hover:shadow-lg transition-all hover:-translate-y-0.5 text-sm"
            >
              Schedule Consultation <ChevronRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+919667769023"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-[10px] hover:bg-white/20 transition-all text-sm"
            >
              <Phone className="w-4 h-4" /> +91-9667769023
            </a>
          </div>
        </div>
      </section>

      {/* ── Bottom features ───────────────────────────────────────── */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Clock className="w-5 h-5 text-primary" />,  title: 'Two Clinic Locations',  desc: 'Gurugram (DLF Phase 3) & South Extension, Delhi' },
              { icon: <Heart className="w-5 h-5 text-primary" />,  title: 'WhatsApp Consultations', desc: 'Reach Dr. Agarwal via WhatsApp for quick queries' },
              { icon: <Shield className="w-5 h-5 text-primary" />, title: 'Hospital Affiliation',   desc: 'SHALBY International Hospitals, Golf Course Road' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-background border border-gray-100 hover:border-primary/20 hover:shadow-card transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-text-secondary">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
