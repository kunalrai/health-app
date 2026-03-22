'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 via-background to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-5xl font-bold text-text-primary mb-6">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-xl text-text-secondary">
              Have questions or ready to schedule an appointment? We&apos;re here to help.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-serif text-3xl font-bold text-text-primary mb-6">
                Get in Touch
              </h2>
              <p className="text-text-secondary mb-8">
                Whether you have questions about our services, need help scheduling an appointment, 
                or want to learn more about our team, we&apos;re here to assist you.
              </p>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Phone</h3>
                    <p className="text-text-secondary">Main: (555) 234-5678</p>
                    <p className="text-accent font-medium">Emergency: (555) 234-9999</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Email</h3>
                    <p className="text-text-secondary">appointments@hopeoncology.com</p>
                    <p className="text-text-secondary">info@hopeoncology.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Address</h3>
                    <p className="text-text-secondary">
                      123 Medical Center Drive<br />
                      Suite 400<br />
                      Healthville, CA 90210
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Office Hours</h3>
                    <p className="text-text-secondary">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-text-secondary">Saturday: 9:00 AM - 1:00 PM</p>
                    <p className="text-text-secondary">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className="bg-warning/10 rounded-card p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">Medical Emergency?</h3>
                    <p className="text-text-secondary text-sm">
                      If you&apos;re experiencing a medical emergency, please call 911 or go to your 
                      nearest emergency room. For urgent matters related to your treatment, call 
                      our emergency line at (555) 234-9999.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-background rounded-card p-8">
                <h2 className="font-serif text-2xl font-bold text-text-primary mb-6">
                  Send Us a Message
                </h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
                      <Send className="w-8 h-8 text-success" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-text-primary mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-text-secondary">
                      Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 text-primary font-medium hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 text-red-600 px-4 py-3 rounded-button text-sm">
                        {error}
                      </div>
                    )}

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-button border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-button border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-button border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-button border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      >
                        <option value="">Select a subject</option>
                        <option value="appointment">Schedule an Appointment</option>
                        <option value="treatment">Treatment Questions</option>
                        <option value="billing">Billing Inquiry</option>
                        <option value="records">Medical Records</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-button border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary-600 text-white py-4 rounded-button font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary to-secondary rounded-hero p-12 text-center text-white">
            <h2 className="font-serif text-3xl font-bold mb-4">
              Need Immediate Assistance?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Our patient coordinators are ready to help you schedule appointments, 
              answer questions, and guide you through your care journey.
            </p>
            <a
              href="tel:+15552345678"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-button font-semibold transition-all hover:shadow-lg"
            >
              <Phone className="w-5 h-5" />
              Call (555) 234-5678
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
