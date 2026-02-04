import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock, Send, Loader2, LucideIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useI18n } from '@/hooks/I18nContext';

// WhatsApp Icon Component - Official glyph from Simple Icons
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    aria-hidden="true" 
    focusable="false"
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.451 3.488"/>
  </svg>
);

const FORM_ENDPOINT = "https://formspree.io/f/xyzpvaeg";

const Contact = () => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  // Prefill form from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subject = params.get("subject");
    const message = params.get("message");

    if (subject || message) {
      setFormData(prev => ({
        ...prev,
        ...(subject && { subject }),
        ...(message && { message })
      }));
    }
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Basic validation
    if (!data.name || !data.email || !/^\S+@\S+\.\S+$/.test(data.email as string) || !data.message) {
      toast({ variant: "destructive", title: t('contact.errors.incompleteFields') });
      return;
    }

    // Honeypot check
    const hpValue = data._gotcha as string;
    if (hpValue) {
      // Silently ignore spam
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn?.setAttribute("disabled", "true");
    setIsSubmitting(true);

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { 
          "Accept": "application/json", 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(data)
      });

      // MIME/type guard to prevent parsing errors
      const ct = res.headers.get("Content-Type") || "";
      if (!res.ok || !ct.includes("application/json")) {
        throw new Error("Invalid response");
      }

      const json = await res.json();
      if (json.ok === true || json.success === true) {
        toast({ title: t('contact.success.title'), description: t('contact.success.description') });
        form.reset();
        setFormData({ name: '', email: '', company: '', subject: '', message: '' });
      } else {
        throw new Error(json.error || t('contact.errors.submissionFailed'));
      }
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: t('contact.errors.networkError'), description: t('contact.errors.tryAgain') });
    } finally {
      btn?.removeAttribute("disabled");
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const contactInfo = [
    {
      icon: Mail,
      title: t('contact.info.emailUs'),
      details: ['info@consoltech.shop', 'sales@consoltech.shop'],
      description: t('contact.info.emailDescription')
    },
    {
      icon: Phone,
      title: t('contact.info.callUs'),
      details: ['+972-52-2768607'],
      description: t('contact.info.callDescription')
    },
    {
      icon: WhatsAppIcon,
      title: t('contact.info.whatsApp'),
      details: [t('contact.info.whatsAppInstant')],
      description: t('contact.info.whatsAppDescription')
    },
    {
      icon: MapPin,
      title: t('contact.info.visitUs'),
      details: ['47 Moshe Sneh St., Tel Aviv 6930243, Israel'],
      description: t('contact.info.visitDescription')
    },
    {
      icon: Clock,
      title: t('contact.info.businessHours'),
      details: [t('contact.info.businessHoursWeekdays'), t('contact.info.businessHoursWeekend')],
      description: t('contact.info.hoursDescription')
    }
  ];

  const offices = [
    {
      city: 'Tel Aviv',
      country: 'Israel',
      address: '47 Moshe Sneh St., Tel Aviv 6930243',
      phone: '+972-52-2768607',
      email: 'sales@gamestation.co.il'
    }
  ];

  const isSingleOffice = offices.length === 1;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="container px-4 md:px-6 pt-24 pb-16 flex-1">
        <header className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">{t('contact.title')}</h1>
        </header>
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
          {/* Honeypot field */}
          <input type="text" name="_gotcha" style={{display:'none'}} tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('contact.name')}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-input rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={t('contact.placeholders.name')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('contact.email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-input rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={t('contact.placeholders.email')}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">{t('contact.company')}</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-input rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={t('contact.placeholders.company')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('contact.subject')}</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-input rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">{t('contact.placeholders.selectSubject')}</option>
              <option value="partnership">{t('contact.subjects.partnership')}</option>
              <option value="products">{t('contact.subjects.products')}</option>
              <option value="distribution">{t('contact.subjects.distribution')}</option>
              <option value="support">{t('contact.subjects.support')}</option>
              <option value="other">{t('contact.subjects.other')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('contact.message')}</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 bg-input rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder={t('contact.placeholders.message')}
            />
          </div>

          <Button type="submit" className="btn-hero w-full" disabled={isSubmitting} aria-disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{t('contact.sending')}</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>{t('contact.send')}</span>
              </>
            )}
          </Button>
        </form>

        {/* Contact Information */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">{t('contact.info.title')}</h2>
          <div className="grid grid-cols-1 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="product-card p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center">
                    {info.title === 'WhatsApp' ? (
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] flex items-center justify-center">
                        <WhatsAppIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                        {React.createElement(info.icon as any, { className: "h-6 w-6 text-white" })}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                     <div className="space-y-1">
                       {info.details.map((detail, idx) => {
                         if (info.title === t('contact.info.callUs')) {
                           return (
                             <a
                               key={idx}
                               href="tel:+972522768607"
                               className="text-accent font-medium underline"
                               aria-label="Call us on mobile at +972-52-2768607"
                             >
                               {detail} (Mobile)
                             </a>
                           );
                         }
                          if (info.title === t('contact.info.whatsApp')) {
                           return (
                              <a
                                key={idx}
                                href="https://wa.me/972522768607?text=Hi%20Consoltech,%20I%27d%20like%20to%20inquire%20about%20your%20products."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent font-medium underline"
                                aria-label="WhatsApp"
                                title="WhatsApp"
                              >
                                {detail}
                              </a>
                           );
                         }
                         if (info.title === t('contact.info.visitUs')) {
                           const mapsQuery = encodeURIComponent(detail);
                           return (
                             <a
                               key={idx}
                               href={`https://www.google.com/maps?q=${mapsQuery}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-accent font-medium underline"
                             >
                               {detail}
                             </a>
                           );
                         }
                         return (
                           <p key={idx} className="text-accent font-medium">{detail}</p>
                         );
                       })}
                     </div>
                     <p className="text-muted-foreground text-sm mt-2">{info.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Offices */}
        <section className="pt-8 pb-8 md:pt-12 md:pb-10 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t('contact.offices.title')}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t('contact.offices.subtitle')}
              </p>
            </div>

            <div className={`grid gap-8 grid-cols-1 ${isSingleOffice ? 'md:grid-cols-1 md:max-w-md md:mx-auto' : 'md:grid-cols-3'}`}>
              {offices.map((office, index) => (
                <div key={index} className="product-card text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{office.city}</h3>
                  <p className="text-accent font-medium mb-4">{office.country}</p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <a
                        href={`https://www.google.com/maps?q=${encodeURIComponent(`${office.address}, ${office.country}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline"
                      >
                        {office.address}
                      </a>
                      <a
                        href={`tel:${office.phone.replace(/[^+\d]/g, '')}`}
                        className="text-foreground font-medium underline"
                      >
                        {office.phone}
                      </a>
                      <p className="text-accent">{office.email}</p>
                    </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pt-6 md:pt-8 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t('contact.faq.title')}
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: t('contact.faq.items.0.question'),
                  answer: t('contact.faq.items.0.answer')
                },
                {
                  question: t('contact.faq.items.1.question'),
                  answer: t('contact.faq.items.1.answer')
                },
                {
                  question: t('contact.faq.items.2.question'),
                  answer: t('contact.faq.items.2.answer')
                },
                {
                  question: t('contact.faq.items.3.question'),
                  answer: t('contact.faq.items.3.answer')
                }
              ].map((faq, index) => (
                <div key={index} className="product-card">
                  <h3 className="text-lg font-semibold mb-3 text-accent">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;