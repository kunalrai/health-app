import Link from 'next/link';
import { Shield, Award, Users, Heart, Clock, ChevronRight, CheckCircle } from 'lucide-react';

const services = [
  {
    id: 'chemotherapy',
    icon: <Shield className="w-10 h-10" />,
    title: 'Chemotherapy',
    description: 'Personalized chemotherapy protocols tailored to your specific cancer type.',
    details: [
      'Comprehensive cancer staging and treatment planning',
      'Access to latest chemotherapy agents and combinations',
      'Supportive care medications to manage side effects',
      'Flexible infusion center with comfortable seating',
      'Home infusion options for eligible patients',
    ],
    preparation: [
      'Wear comfortable, loose-fitting clothing',
      'Bring your insurance cards and photo ID',
      'Arrange for a support person to drive you home',
      'Bring entertainment options (books, headphones)',
      'Eat a light meal before your appointment',
    ],
  },
  {
    id: 'radiation',
    icon: <Award className="w-10 h-10" />,
    title: 'Radiation Therapy',
    description: 'State-of-the-art radiation targeting with minimal side effects.',
    details: [
      'Intensity-Modulated Radiation Therapy (IMRT)',
      'Image-Guided Radiation Therapy (IGRT)',
      'Stereotactic Radiosurgery (SRS)',
      'Stereotactic Body Radiotherapy (SBRT)',
      'Surface-Guided Radiation Therapy (SGRT)',
    ],
    preparation: [
      'Wear clothing without metal fasteners',
      'Avoid lotions or creams on treatment area',
      'Stay hydrated before your session',
      'Arrive 15 minutes early for imaging',
      'Discuss medications with your care team',
    ],
  },
  {
    id: 'immunotherapy',
    icon: <Users className="w-10 h-10" />,
    title: 'Immunotherapy',
    description: 'Harness your immune system to fight cancer.',
    details: [
      'Immune checkpoint inhibitors (PD-1, PD-L1, CTLA-4)',
      'CAR-T cell therapy',
      'Cancer vaccines',
      'Cytokine therapy',
      'Combination immunotherapy approaches',
    ],
    preparation: [
      'Complete all required pre-treatment testing',
      'Report any recent infections to your team',
      'Review current medications with your oncologist',
      'Plan for potential flu-like symptoms',
      'Stay well-hydrated before treatment',
    ],
  },
  {
    id: 'targeted',
    icon: <Heart className="w-10 h-10" />,
    title: 'Targeted Therapy',
    description: 'Genetic testing-guided treatments for precision medicine.',
    details: [
      'Molecular profiling of tumors',
      'HER2-targeted therapies',
      'EGFR inhibitors',
      'ALK and ROS1 inhibitors',
      'PARP inhibitors for BRCA mutations',
    ],
    preparation: [
      'Complete genomic testing as recommended',
      'Bring previous test results to appointments',
      'Discuss family history with your oncologist',
      'Understand potential drug interactions',
      'Follow dietary guidelines for your medication',
    ],
  },
  {
    id: 'clinical-trials',
    icon: <Clock className="w-10 h-10" />,
    title: 'Clinical Trials',
    description: 'Access to promising new treatments through research.',
    details: [
      'Phase I-III clinical trials',
      'Novel targeted therapy trials',
      'Immunotherapy combinations',
      'Quality of life studies',
      'Survivorship and support research',
    ],
    preparation: [
      'Review trial eligibility criteria carefully',
      'Understand the informed consent process',
      'Discuss risks and benefits with your oncologist',
      'Plan for additional monitoring appointments',
      'Know your rights as a trial participant',
    ],
  },
  {
    id: 'supportive',
    icon: <Shield className="w-10 h-10" />,
    title: 'Supportive Care',
    description: 'Comprehensive symptom management and quality of life support.',
    details: [
      'Pain management specialists',
      'Nutritional counseling',
      'Psychological support services',
      'Palliative care consultations',
      'Survivorship program',
    ],
    preparation: [
      'Complete symptom assessment forms honestly',
      'Bring a list of all current medications',
      'Involve family members in discussions',
      'Ask about integrative therapy options',
      'Discuss advance care planning when ready',
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 via-background to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-5xl font-bold text-text-primary mb-6">
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-xl text-text-secondary">
              Comprehensive cancer care services designed to treat your cancer while supporting your quality of life.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-serif text-3xl font-bold text-text-primary mb-6">
                Comprehensive Cancer Treatment
              </h2>
              <p className="text-text-secondary mb-6">
                At Hope Oncology, we offer a full spectrum of cancer treatment services. 
                Our multidisciplinary team works together to create personalized treatment 
                plans that address your specific cancer type, stage, and overall health.
              </p>
              <p className="text-text-secondary mb-6">
                We believe in treating the whole person, not just the disease. That&apos;s why our 
                services include not only advanced medical treatments but also comprehensive 
                supportive care to help you maintain your quality of life throughout treatment.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/appointments"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-button font-semibold"
                >
                  Schedule Consultation
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <a
                  href="tel:+15552345678"
                  className="inline-flex items-center gap-2 border-2 border-primary text-primary px-6 py-3 rounded-button font-semibold"
                >
                  Call (555) 234-5678
                </a>
              </div>
            </div>
            <div className="bg-background rounded-card p-8">
              <h3 className="font-serif text-xl font-semibold mb-4">Why Choose Hope Oncology?</h3>
              <ul className="space-y-3">
                {[
                  'Board-certified oncologists with decades of experience',
                  'Latest treatment protocols and clinical trials',
                  'Personalized treatment plans for every patient',
                  'Comprehensive supportive care services',
                  'Convenient location with ample parking',
                  'Most insurance plans accepted',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-20 ${index % 2 === 0 ? 'bg-background' : 'bg-white'}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white mb-6">
                  {service.icon}
                </div>
                <h2 className="font-serif text-3xl font-bold text-text-primary mb-4">
                  {service.title}
                </h2>
                <p className="text-lg text-text-secondary mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-text-secondary">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`bg-gradient-to-br from-primary/5 to-secondary/5 rounded-card p-8 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <h3 className="font-serif text-xl font-semibold text-text-primary mb-4">
                  Preparing for Your Appointment
                </h3>
                <p className="text-text-secondary mb-6">
                  Help ensure a smooth visit by following these preparation tips:
                </p>
                <ul className="space-y-4">
                  {service.preparation.map((prep, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold text-sm">{i + 1}</span>
                      </div>
                      <span className="text-text-secondary">{prep}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="py-24 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="font-serif text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Schedule a consultation to discuss which treatment options may be right for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/appointments"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-button font-semibold transition-all hover:shadow-lg"
            >
              Book Appointment
            </Link>
            <a
              href="mailto:appointments@hopeoncology.com"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-button font-semibold transition-all hover:bg-white hover:text-primary"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
