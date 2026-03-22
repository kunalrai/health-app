import Link from 'next/link';
import {
  Activity, ArrowUpRight, CheckCircle2, ChevronRight,
  Heart, Phone, Shield, Star, Stethoscope, Microscope,
  Wind, Circle, Layers, Waves, FlaskConical, Dna, User,
} from 'lucide-react';

const services = [
  {
    id: 'breast-cancer',
    icon: <Heart className="w-6 h-6 text-primary" />,
    iconLarge: <Heart className="w-10 h-10" />,
    color: 'from-rose-400/20 to-primary/10',
    accentColor: 'bg-rose-50 border-rose-100',
    title: 'Breast Cancer',
    tagline: 'Most common cancer in women — highly treatable when caught early',
    description:
      'Comprehensive breast cancer care — from early detection and diagnosis through surgery support, chemotherapy, targeted therapy, hormonal therapy, and survivorship planning.',
    details: [
      'Complete staging and tumour molecular profiling (ER, PR, HER2)',
      'Neoadjuvant and adjuvant chemotherapy protocols',
      'HER2-targeted therapy (trastuzumab, pertuzumab)',
      'Hormonal therapy (aromatase inhibitors, tamoxifen)',
      'PARP inhibitors for BRCA-mutated breast cancer',
      'Survivorship care and long-term follow-up planning',
    ],
    symptoms: ['Lump in breast or underarm', 'Change in breast shape or size', 'Nipple discharge or inversion', 'Skin dimpling or redness'],
  },
  {
    id: 'neuroendocrine-cancer',
    icon: <Dna className="w-6 h-6 text-primary" />,
    iconLarge: <Dna className="w-10 h-10" />,
    color: 'from-violet-400/20 to-secondary/10',
    accentColor: 'bg-violet-50 border-violet-100',
    title: 'Neuroendocrine Cancer',
    tagline: 'Rare tumours requiring highly specialised management',
    description:
      'Specialist treatment for neuroendocrine tumours (NETs) of the pancreas, lung, and GI tract — including PRRT, somatostatin analogues, and targeted systemic therapies.',
    details: [
      'Peptide Receptor Radionuclide Therapy (PRRT)',
      'Somatostatin analogues (octreotide, lanreotide)',
      'Everolimus and sunitinib for advanced NETs',
      'Chemotherapy for high-grade neuroendocrine carcinoma',
      'Multidisciplinary tumour board review',
      'Theranostic molecular imaging-guided approach',
    ],
    symptoms: ['Flushing and diarrhoea', 'Unexplained weight loss', 'Abdominal pain', 'Fatigue and weakness'],
  },
  {
    id: 'lung-cancer',
    icon: <Wind className="w-6 h-6 text-primary" />,
    iconLarge: <Wind className="w-10 h-10" />,
    color: 'from-sky-400/20 to-secondary/10',
    accentColor: 'bg-sky-50 border-sky-100',
    title: 'Lung Cancer',
    tagline: 'Leading cause of cancer deaths — precision medicine is transforming outcomes',
    description:
      'Expert management of non-small cell and small cell lung cancers using the latest immunotherapy, targeted therapy, and chemotherapy protocols tailored to your molecular profile.',
    details: [
      'Comprehensive molecular profiling (EGFR, ALK, ROS1, PD-L1)',
      'EGFR/ALK/ROS1 targeted tyrosine kinase inhibitors',
      'Immune checkpoint inhibitors (pembrolizumab, nivolumab)',
      'Platinum-based chemotherapy combinations',
      'Combination chemo-immunotherapy regimens',
      'Maintenance therapy and surveillance planning',
    ],
    symptoms: ['Persistent cough or haemoptysis', 'Shortness of breath', 'Chest pain', 'Hoarseness or wheezing'],
  },
  {
    id: 'cervical-cancer',
    icon: <Circle className="w-6 h-6 text-primary" />,
    iconLarge: <Circle className="w-10 h-10" />,
    color: 'from-pink-400/20 to-primary/10',
    accentColor: 'bg-pink-50 border-pink-100',
    title: 'Cervical Cancer',
    tagline: 'Largely preventable — treatable at all stages with the right care',
    description:
      'Compassionate, evidence-based treatment for cervical cancer. Dr. Agarwal coordinates systemic chemotherapy alongside radiation oncology for optimal outcomes.',
    details: [
      'Concurrent chemoradiation with cisplatin',
      'Bevacizumab-based combination therapy for advanced disease',
      'Immunotherapy (pembrolizumab) for PD-L1 positive tumours',
      'Palliative systemic therapy for recurrent disease',
      'Coordination with gynaecologic oncology and radiation teams',
      'Fertility preservation discussion before treatment',
    ],
    symptoms: ['Abnormal vaginal bleeding', 'Pelvic pain', 'Pain during intercourse', 'Unusual vaginal discharge'],
  },
  {
    id: 'stomach-cancer',
    icon: <Layers className="w-6 h-6 text-primary" />,
    iconLarge: <Layers className="w-10 h-10" />,
    color: 'from-amber-400/20 to-primary/10',
    accentColor: 'bg-amber-50 border-amber-100',
    title: 'Stomach Cancer',
    tagline: 'Early detection is key to improving survival outcomes',
    description:
      'Advanced care for gastric cancer using peri-operative chemotherapy, HER2-targeted therapy, and immunotherapy regimens based on the latest global evidence.',
    details: [
      'Peri-operative FLOT chemotherapy for resectable disease',
      'HER2-targeted therapy (trastuzumab) for HER2+ tumours',
      'VEGFR2 inhibitor (ramucirumab) for advanced gastric cancer',
      'Immune checkpoint inhibitors (nivolumab, pembrolizumab)',
      'Nutritional and supportive care coordination',
      'Genetic testing for hereditary diffuse gastric cancer',
    ],
    symptoms: ['Persistent indigestion or heartburn', 'Nausea and vomiting', 'Unexplained weight loss', 'Blood in stools or black stools'],
  },
  {
    id: 'colorectal-cancer',
    icon: <Waves className="w-6 h-6 text-primary" />,
    iconLarge: <Waves className="w-10 h-10" />,
    color: 'from-teal-400/20 to-secondary/10',
    accentColor: 'bg-teal-50 border-teal-100',
    title: 'Colorectal Cancer',
    tagline: 'Highly treatable with early screening and modern systemic therapy',
    description:
      'Comprehensive management of colon and rectal cancers — including adjuvant chemotherapy, targeted biologics, and immunotherapy for MSI-high tumours.',
    details: [
      'FOLFOX / FOLFIRI / CAPOX chemotherapy regimens',
      'Anti-VEGF therapy (bevacizumab) and anti-EGFR agents',
      'MSI/MMR testing and immunotherapy (pembrolizumab) for dMMR tumours',
      'Adjuvant chemotherapy after curative surgery',
      'Liver metastasis treatment strategies',
      'Lynch syndrome genetic counselling and testing',
    ],
    symptoms: ['Change in bowel habits', 'Blood in stool', 'Abdominal cramping or pain', 'Unexplained anaemia or fatigue'],
  },
  {
    id: 'esophagal-cancer',
    icon: <Activity className="w-6 h-6 text-primary" />,
    iconLarge: <Activity className="w-10 h-10" />,
    color: 'from-orange-400/20 to-primary/10',
    accentColor: 'bg-orange-50 border-orange-100',
    title: 'Esophagal Cancer',
    tagline: 'Multidisciplinary approach for best possible outcomes',
    description:
      'Expert systemic therapy for oesophageal and gastro-oesophageal junction cancers, coordinating with surgical and radiation oncology teams for optimal management.',
    details: [
      'Neoadjuvant chemoradiation (CROSS protocol) for resectable disease',
      'Perioperative FLOT chemotherapy for GEJ adenocarcinoma',
      'HER2-targeted therapy and VEGFR2 inhibition',
      'Immunotherapy combinations for advanced disease',
      'Supportive care: nutritional support and dysphagia management',
      'Palliative stenting coordination with gastroenterology',
    ],
    symptoms: ['Difficulty swallowing (dysphagia)', 'Chest pain or pressure', 'Unintentional weight loss', 'Chronic cough or hoarseness'],
  },
  {
    id: 'ovarian-cancer',
    icon: <FlaskConical className="w-6 h-6 text-primary" />,
    iconLarge: <FlaskConical className="w-10 h-10" />,
    color: 'from-fuchsia-400/20 to-primary/10',
    accentColor: 'bg-fuchsia-50 border-fuchsia-100',
    title: 'Ovarian Cancer',
    tagline: 'Advanced genomic-guided therapy improving long-term outcomes',
    description:
      'Personalised systemic treatment for ovarian cancer — including platinum-based chemotherapy, bevacizumab, and PARP inhibitors tailored to BRCA and HRD status.',
    details: [
      'Carboplatin and paclitaxel first-line chemotherapy',
      'PARP inhibitors (olaparib, niraparib) for maintenance therapy',
      'BRCA1/2 and homologous recombination deficiency (HRD) testing',
      'Bevacizumab combination for advanced/recurrent disease',
      'Second-line chemotherapy for platinum-sensitive recurrence',
      'Genetic counselling for BRCA carriers and family members',
    ],
    symptoms: ['Bloating or abdominal swelling', 'Pelvic or abdominal pain', 'Difficulty eating or feeling full quickly', 'Urinary urgency or frequency'],
  },
  {
    id: 'prostate-cancer',
    icon: <User className="w-6 h-6 text-primary" />,
    iconLarge: <User className="w-10 h-10" />,
    color: 'from-blue-400/20 to-secondary/10',
    accentColor: 'bg-blue-50 border-blue-100',
    title: 'Prostate Cancer',
    tagline: 'Hormone therapy, chemotherapy and novel agents — personalised to your disease',
    description:
      'Evidence-based medical oncology care for prostate cancer — from hormone-sensitive to castration-resistant disease — using the latest androgen receptor-targeting agents.',
    details: [
      'Androgen deprivation therapy (ADT) with LHRH agonists/antagonists',
      'Novel androgen receptor-axis-targeted agents (enzalutamide, abiraterone)',
      'Docetaxel chemotherapy for castration-resistant prostate cancer',
      'PARP inhibitors (olaparib) for BRCA-mutated CRPC',
      'Lutetium-PSMA therapy referral and coordination',
      'Bone health management and bisphosphonate therapy',
    ],
    symptoms: ['Frequent or difficult urination', 'Blood in urine or semen', 'Bone pain (advanced disease)', 'Erectile dysfunction'],
  },
];

const whyChoose = [
  { icon: <Stethoscope className="w-5 h-5 text-primary" />, text: '20+ years clinical experience across India, UK & Australia' },
  { icon: <Microscope className="w-5 h-5 text-primary" />, text: 'Molecular profiling & precision medicine approach' },
  { icon: <Shield className="w-5 h-5 text-primary" />, text: 'FRACP (Medical Oncology) — Australian Fellowship' },
  { icon: <Star className="w-5 h-5 text-primary" />, text: 'Published researcher in peer-reviewed oncology journals' },
  { icon: <Heart className="w-5 h-5 text-primary" />, text: 'Compassionate, individualised care for every patient' },
  { icon: <CheckCircle2 className="w-5 h-5 text-primary" />, text: 'Multidisciplinary tumour board approach' },
];

export default function ServicesPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden mesh-bg">
        {/* Ambient blobs */}
        <div className="blob w-[480px] h-[480px] bg-primary top-[-100px] left-[-140px]" style={{ animationDelay: '0s' }} />
        <div className="blob w-[360px] h-[360px] bg-secondary bottom-[-60px] right-[-80px]" style={{ animationDelay: '2.5s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <span className="badge badge-primary mb-5">
              <Activity className="w-3.5 h-3.5" />
              Comprehensive Cancer Care
            </span>
            <div className="divider mx-auto mb-6" />
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-text-primary leading-[1.1] tracking-tight mb-5">
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto mb-8">
              Expert oncology care across nine cancer specialties — delivered with
              international-standard precision, compassion, and the latest evidence-based treatments.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/appointments" className="btn btn-primary">
                Book Consultation <ChevronRight className="w-4 h-4" />
              </Link>
              <a href="tel:+919667769023" className="btn btn-ghost">
                <Phone className="w-4 h-4" /> +91-9667769023
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick-nav cards ──────────────────────────────────────── */}
      <section className="py-16 bg-white border-y border-gray-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
            {services.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-background border border-gray-100 hover:border-primary/25 hover:bg-primary/5 transition-all duration-200 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  {s.icon}
                </div>
                <span className="text-[11px] font-semibold text-text-secondary group-hover:text-primary leading-tight transition-colors">
                  {s.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Overview split ───────────────────────────────────────── */}
      <section className="py-24 gradient-bg-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left copy */}
            <div className="animate-fade-in-up">
              <p className="section-label mb-3">Why Dr. Veenoo Agarwal</p>
              <div className="divider mb-6" />
              <h2 className="font-serif text-4xl font-bold text-text-primary mb-5 leading-tight">
                World-Class Oncology,{' '}
                <span className="gradient-text">Close to Home</span>
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Dr. Veenoo Agarwal brings over 20 years of experience spanning India, the United
                Kingdom, and Australia — combining international training with deep empathy for
                patients facing some of life&apos;s most difficult moments.
              </p>
              <p className="text-text-secondary leading-relaxed mb-8">
                Every treatment plan is built around <strong className="font-semibold text-text-primary">molecular profiling</strong>, the
                latest clinical evidence, and your individual goals — ensuring you receive
                precision care, not a one-size-fits-all approach.
              </p>
              <Link href="/about" className="btn btn-primary">
                Meet Dr. Agarwal <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right — why-choose list */}
            <div className="card-modern p-8 animate-fade-in-up" style={{ animationDelay: '0.12s' }}>
              <h3 className="font-serif text-xl font-semibold text-text-primary mb-6">
                Why Patients Choose Us
              </h3>
              <ul className="space-y-4">
                {whyChoose.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-text-secondary text-sm leading-relaxed pt-1.5">{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-gray-100 flex gap-6">
                <div className="text-center">
                  <p className="font-serif text-3xl font-bold gradient-text">20+</p>
                  <p className="text-xs text-text-secondary mt-0.5">Years Experience</p>
                </div>
                <div className="text-center">
                  <p className="font-serif text-3xl font-bold gradient-text">9+</p>
                  <p className="text-xs text-text-secondary mt-0.5">Cancer Types</p>
                </div>
                <div className="text-center">
                  <p className="font-serif text-3xl font-bold gradient-text">3</p>
                  <p className="text-xs text-text-secondary mt-0.5">Clinic Locations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service cards grid ───────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 animate-fade-in-up">
            <p className="section-label mb-3">Specialties</p>
            <div className="divider mx-auto mb-5" />
            <h2 className="font-serif text-4xl font-bold text-text-primary mb-4">
              Cancers We Treat
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Browse all nine cancer specialties handled by Dr. Veenoo Agarwal.
              Each section below details the specific treatments and therapies available.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group card-modern p-7 block relative overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {/* Hover top border */}
                <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-[20px]" />
                {/* Hover bg */}
                <span className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-secondary/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[20px]" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:from-primary/15 group-hover:to-secondary/15 transition-all duration-300">
                    {s.icon}
                  </div>
                  {/* Title */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-serif text-[1.0625rem] font-semibold text-text-primary leading-snug">{s.title}</h3>
                    <ArrowUpRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-primary font-medium mb-3">{s.tagline}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{s.description}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                    See treatment details <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Individual service detail sections ───────────────────── */}
      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-20 scroll-mt-24 ${index % 2 === 0 ? 'bg-background' : 'bg-white'}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-14 items-start">

              {/* Left: description + treatment list */}
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                {/* Icon + title */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-[0_4px_16px_rgba(13,115,119,0.25)] flex-shrink-0">
                    {service.iconLarge}
                  </div>
                  <div>
                    <p className="section-label mb-1">Cancer Specialty</p>
                    <h2 className="font-serif text-3xl font-bold text-text-primary leading-tight">
                      {service.title}
                    </h2>
                  </div>
                </div>

                <p className="text-base text-text-secondary leading-relaxed mb-2">
                  <em className="text-primary font-medium not-italic">{service.tagline}.</em>
                </p>
                <p className="text-base text-text-secondary leading-relaxed mb-7">
                  {service.description}
                </p>

                {/* Treatment details */}
                <h3 className="font-serif text-lg font-semibold text-text-primary mb-4">
                  Treatment Approaches
                </h3>
                <ul className="space-y-3 mb-8">
                  {service.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-text-secondary text-sm leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/appointments"
                  className="btn btn-primary text-sm"
                >
                  Book a Consultation <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Right: symptoms + CTA card */}
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                {/* Symptoms */}
                <div className="card-modern p-7 mb-5">
                  <h3 className="font-serif text-lg font-semibold text-text-primary mb-4">
                    Common Symptoms to Watch For
                  </h3>
                  <ul className="space-y-3">
                    {service.symptoms.map((symptom, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0" />
                        <span className="text-text-secondary text-sm">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-text-secondary mt-5 pt-4 border-t border-gray-100">
                    If you are experiencing any of these symptoms, consult Dr. Veenoo Agarwal promptly.
                    Early detection significantly improves outcomes.
                  </p>
                </div>

                {/* Mini CTA card */}
                <div className="relative overflow-hidden rounded-[20px] p-6 gradient-bg text-white">
                  {/* Decorative circles */}
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
                  <div className="relative z-10">
                    <span className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3 py-1 text-xs font-medium mb-3">
                      <Heart className="w-3 h-3" /> Personalised Care
                    </span>
                    <h4 className="font-serif text-xl font-bold mb-2 leading-snug">
                      Not Sure Where to Start?
                    </h4>
                    <p className="text-white/80 text-sm mb-4 leading-relaxed">
                      Book a consultation and Dr. Agarwal will evaluate your case, answer your
                      questions, and guide you through your options.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href="/appointments"
                        className="inline-flex items-center gap-1.5 bg-white text-primary text-xs font-semibold px-4 py-2.5 rounded-[8px] hover:shadow-lg transition-all hover:-translate-y-0.5"
                      >
                        Schedule Now <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                      <a
                        href="tel:+919667769023"
                        className="inline-flex items-center gap-1.5 bg-white/10 border border-white/30 text-white text-xs font-semibold px-4 py-2.5 rounded-[8px] hover:bg-white/20 transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg" />
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <span className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Heart className="w-3.5 h-3.5" /> Compassionate, Evidence-Based Oncology
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-5 leading-tight">
            Ready to Begin Your<br />Healing Journey?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Schedule a consultation with Dr. Veenoo Agarwal and receive a personalised
            treatment plan built around your diagnosis and goals.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/appointments"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-7 py-3.5 rounded-[10px] hover:shadow-xl transition-all hover:-translate-y-0.5 text-sm"
            >
              Book Consultation <ChevronRight className="w-4 h-4" />
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
    </>
  );
}
