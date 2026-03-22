import { Award, GraduationCap, MapPin, Heart } from 'lucide-react';
import Link from 'next/link';

const credentials = [
  {
    name: 'MBBS',
    description: 'Christian Medical College, Ludhiana',
  },
  {
    name: 'FRACP',
    description: 'Fellowship — Medical Oncology, Australia',
  },
  {
    name: 'International Experience',
    description: '20+ years across India, UK & Australia',
  },
  {
    name: 'SHALBY Hospitals',
    description: 'Affiliated Consultant, Gurugram',
  },
];

const clinics = [
  {
    city: 'Gurugram',
    address: 'Plot 3001, Block V, DLF Phase 3, Nathupur, Sector 24, Gurugram, Haryana 122002',
  },
  {
    city: 'New Delhi',
    address: 'Block E, Manav Medicare Centre, E-11, South Extension I, New Delhi 110049',
  },
  {
    city: 'Hospital Affiliation',
    address: 'SHALBY International Hospitals, Golf Course Road, DLF Phase 5, Sector 53, Gurugram, Haryana 122011',
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 via-background to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-5xl font-bold text-text-primary mb-6">
              About <span className="gradient-text">Dr. Veenoo Agarwal</span>
            </h1>
            <p className="text-xl text-text-secondary">
              A distinguished Medical Oncologist with over two decades of experience across India,
              the United Kingdom, and Australia — empowering patients in their fight against cancer.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold text-text-primary mb-6">
                Biography
              </h2>
              <div className="space-y-4 text-text-secondary">
                <p>
                  Dr. Veenoo Agarwal is a Consultant Medical Oncologist with over 20 years of
                  patient care experience spanning India, the United Kingdom, and Australia. She
                  completed her MBBS at the Christian Medical College, Ludhiana, and subsequently
                  obtained her Fellowship of the Royal Australasian College of Physicians (FRACP)
                  with a specialisation in Medical Oncology in Australia.
                </p>
                <p>
                  Her international training has equipped her with a broad, evidence-based approach
                  to cancer care — bringing world-class oncology knowledge and the latest treatment
                  protocols to her patients in India. She consults at clinics in Gurugram and
                  South Extension, New Delhi, and is affiliated with SHALBY International Hospitals.
                </p>
                <p>
                  Dr. Agarwal is passionate about guiding patients and their families through every
                  step of the cancer journey with expert care, compassion, and clear communication —
                  ensuring they feel informed and empowered throughout their treatment.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-primary to-secondary rounded-hero flex items-center justify-center">
                <div className="text-center text-white">
                  <Heart className="w-20 h-20 mx-auto mb-4 opacity-80" />
                  <p className="text-xl font-semibold">Empowering Lives</p>
                  <p className="text-white/70 mt-1">in the Fight Against Cancer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl font-bold text-text-primary mb-4">
              Qualifications &amp; Credentials
            </h2>
            <p className="text-xl text-text-secondary">
              International training and decades of clinical experience underpin every patient interaction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {credentials.map((cert, index) => (
              <div
                key={index}
                className="bg-white rounded-card p-6 text-center animate-fade-in-up"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
                  <Award className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-semibold text-text-primary mb-1">{cert.name}</h3>
                <p className="text-sm text-text-secondary">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl font-bold text-text-primary mb-4">
              Clinic Locations
            </h2>
            <p className="text-xl text-text-secondary">
              Conveniently located across the Delhi-NCR region.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {clinics.map((clinic, index) => (
              <div
                key={index}
                className="bg-background rounded-card p-8 flex gap-5 animate-fade-in-up"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-text-primary mb-2">
                    {clinic.city}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{clinic.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="font-serif text-4xl font-bold mb-6">
            Schedule a Consultation
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Ready to meet Dr. Agarwal? Book a consultation to discuss your diagnosis and treatment options.
          </p>
          <Link
            href="/appointments"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-button font-semibold transition-all hover:shadow-lg"
          >
            Book Appointment
          </Link>
        </div>
      </section>
    </>
  );
}
