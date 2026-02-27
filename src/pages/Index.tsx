import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ProductSlider from '@/components/ProductSlider';
import PartnerBrands from '@/components/PartnerBrands';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Gamepad2, Headphones, Shield, BadgeDollarSign, UserPlus, Search, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '@/hooks/I18nContext';

const Index = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const features = [
    {
      icon: Gamepad2,
      title: t('index.features.globalDistribution.title'),
      description: t('index.features.globalDistribution.description')
    },
    {
      icon: Headphones,
      title: t('index.features.qualityAssurance.title'),
      description: t('index.features.qualityAssurance.description')
    },
    {
      icon: Shield,
      title: t('index.features.latestTechnology.title'),
      description: t('index.features.latestTechnology.description')
    },
    {
      icon: BadgeDollarSign,
      title: t('index.features.trustedPartnerships.title'),
      description: t('index.features.trustedPartnerships.description')
    }
  ];

  const canonicalUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Consoltech",
            url: canonicalUrl,
            description: "Global import, export, and distribution of consumer electronics and gaming since 2001.",
            email: "sales@gamestation.co.il",
            telephone: "+972-52-2768607",
            address: {
              "@type": "PostalAddress",
              streetAddress: "47 Moshe Sneh St.",
              addressLocality: "Tel Aviv",
              postalCode: "6930243",
              addressCountry: "IL",
            },
            areaServed: ["Europe", "United States", "Middle East", "Asia"],
            sameAs: ["https://www.handelot.com"],
          })}
        </script>
      </Helmet>
      <Navigation />

      {/* Product Search Bar - desktop only (mobile search is in Navigation) */}
      <div className="hidden md:block fixed md:top-16 w-full z-40 nav-glass border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <form onSubmit={handleSearch} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('products.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-card/80 rounded-lg border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset focus:border-transparent transition-all"
              />
            </div>
            <Button type="submit" className="btn-hero shrink-0">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">{t('index.cta.browseCatalog')}</span>
            </Button>
          </form>
        </div>
      </div>

      <main id="main-content" className="flex-1">
      <Hero />
      <ProductSlider />
      <PartnerBrands />
      
      {/* Why Choose Us Section */}
      <section className="pt-2 md:pt-6 pb-6 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-4xl md:text-5xl text-section-heading mb-4">
              {t('index.whyChoose.title')}
            </h2>
            <p className="text-xl text-muted-foreground text-desc-bold max-w-3xl mx-auto">
              {t('index.whyChoose.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="product-card text-center group">
                <div className="w-20 h-20 md:w-16 md:h-16 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-10 w-10 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-xl text-sub-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-desc-bold">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl text-section-heading mb-6">
            {t('index.cta.title')}
          </h2>
          <p className="text-xl text-muted-foreground text-desc-bold mb-6 md:mb-8">
            {t('index.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="btn-hero">
                <UserPlus className="h-5 w-5" />
                <span>{t('index.cta.startPartnership')}</span>
              </Button>
            </Link>
            <Link to="/products">
              <Button className="btn-neon">
                <Search className="h-5 w-5" />
                <span>{t('index.cta.browseCatalog')}</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Consoltech Section */}
      <section id="about-home" className="block w-full py-6 px-4 sm:px-6 mt-4 md:mt-12 mb-4 md:mb-8">
        <div className="max-w-7xl mx-auto">
          {/* About Card */}
          <div className="product-card p-8 mb-8">
            <div className="flex flex-col gap-6 md:grid md:grid-cols-12 md:gap-8">
              {/* Left Column */}
              <div className="md:col-span-7 space-y-6">
                <h2 className="text-4xl md:text-5xl text-section-heading">
                  {t('index.aboutSection.title')}
                </h2>
                <p className="text-lg text-muted-foreground text-desc-bold leading-relaxed">
                  {t('index.aboutSection.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/about">
                    <Button className="btn-hero">
                      <ArrowRight className="h-5 w-5" />
                      <span>{t('index.aboutSection.learnMore')}</span>
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" className="border-border hover:bg-accent/10">
                      <span>{t('index.aboutSection.contactUs')}</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column */}
              <div className="md:col-span-5 space-y-6">
                {/* Check-list bullets */}
                <div className="space-y-3">
                  {[
                    t('index.aboutSection.checklist.electronics'),
                    t('index.aboutSection.checklist.gaming'),
                    t('index.aboutSection.checklist.ebikes'),
                    t('index.aboutSection.checklist.gadgets'),
                    t('index.aboutSection.checklist.vip')
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Stats strip */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">20+</div>
                    <div className="text-sm text-muted-foreground">{t('index.aboutSection.stats.years')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">4</div>
                    <div className="text-sm text-muted-foreground">{t('index.aboutSection.stats.regions')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">{t('index.aboutSection.stats.fastValue')}</div>
                    <div className="text-sm text-muted-foreground">{t('index.aboutSection.stats.logistics')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* More about us Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="more-about-us" className="product-card px-6">
              <AccordionTrigger className="text-xl font-semibold py-6">
                {t('index.moreAbout.title')}
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-8">
                  {/* What we do */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-accent">{t('index.moreAbout.whatWeDo.title')}</h3>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>{t('index.moreAbout.whatWeDo.electronics')}</li>
                      <li>{t('index.moreAbout.whatWeDo.gaming')}</li>
                      <li>{t('index.moreAbout.whatWeDo.ebikes')}</li>
                      <li>{t('index.moreAbout.whatWeDo.gadgets')}</li>
                    </ul>
                  </div>

                  {/* Who we serve */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-accent">{t('index.moreAbout.whoWeServe.title')}</h3>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>{t('index.moreAbout.whoWeServe.retailers')}</li>
                      <li>{t('index.moreAbout.whoWeServe.resellers')}</li>
                      <li>{t('index.moreAbout.whoWeServe.wholesale')}</li>
                    </ul>
                  </div>

                  {/* Where we operate */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-accent">{t('index.moreAbout.whereWeOperate.title')}</h3>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>{t('index.moreAbout.whereWeOperate.europe')}</li>
                      <li>{t('index.moreAbout.whereWeOperate.us')}</li>
                      <li>{t('index.moreAbout.whereWeOperate.middleEast')}</li>
                      <li>{t('index.moreAbout.whereWeOperate.asia')}</li>
                    </ul>
                  </div>

                  {/* How we work */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-accent">{t('index.moreAbout.howWeWork.title')}</h3>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>{t('index.moreAbout.howWeWork.vip')}</li>
                      <li>{t('index.moreAbout.howWeWork.partnerships')}</li>
                      <li>{t('index.moreAbout.howWeWork.reliability')}</li>
                      <li>{t('index.moreAbout.howWeWork.logistics')}</li>
                      <li>{t('index.moreAbout.howWeWork.cooperation')}</li>
                    </ul>
                  </div>

                  {/* Contact & HQ */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-accent">{t('index.moreAbout.contact.title')}</h3>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li><strong>{t('index.moreAbout.contact.addressLabel')}</strong> 47 Moshe Sneh St., Tel Aviv 6930243, Israel</li>
                      <li><strong>{t('index.moreAbout.contact.mobileLabel')}</strong> +972-52-2768607</li>
                      <li><strong>{t('index.moreAbout.contact.emailLabel')}</strong> sales@gamestation.co.il</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
};

export default Index;
