import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ProductSlider from '@/components/ProductSlider';
import PartnerBrands from '@/components/PartnerBrands';
import Footer from '@/components/Footer';
import TrustBadges from '@/components/TrustBadges';
import VideoCarousel from '@/components/VideoCarousel';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Gamepad2, Headphones, Shield, BadgeDollarSign, UserPlus, Search, Check, Monitor, Plane, Bike, Cpu, Lightbulb, PhoneCall, FileText, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '@/hooks/I18nContext';
import { isFeatureEnabled } from '@/lib/featureFlags';

const Index = () => {
  const { t } = useI18n();

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
      {/* Desktop: normal fixed nav */}
      <div className="hidden md:block">
        <Navigation />
      </div>

      <main id="main-content" className="flex-1">

      {/* Mobile hero background wrapper — single bg image behind nav + hero */}
      <div className="relative md:contents">
        {/* Mobile-only background image — starts below the text block */}
        <div className="absolute inset-0 md:hidden z-0 overflow-hidden" style={{ backgroundColor: '#210144' }}>
          <img
            src="/images/bckmobil.png"
            alt=""
            aria-hidden="true"
            style={{ position: 'absolute', top: '230px', left: 0, width: '100%', height: 'auto' }}
          />
          {/* Tall gradient fade: covers the full seam between bg color and image */}
          <div style={{ position: 'absolute', top: '200px', left: 0, width: '100%', height: '150px', background: 'linear-gradient(to bottom, #210144 0%, #210144 30%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />
        </div>

        {/* Mobile transparent nav — inside wrapper so bg shows through */}
        <div className="md:hidden relative z-10">
          <Navigation transparent />
        </div>

        <div className="relative z-10">
          <Hero />
        </div>
      </div>

      {/* Mobile-only trust badges — outside hero background wrapper so consoles image is fully visible */}
      <div className="md:hidden relative z-10 mt-4">
        <TrustBadges />
      </div>

      {/* Mobile-only video carousel */}
      <div className="md:hidden relative z-10 mt-2">
        {isFeatureEnabled('HERO_VIDEO_MODE') && <VideoCarousel />}
      </div>

      <ProductSlider />
      <PartnerBrands />
      
      {/* Why Choose Us Section — desktop only (mobile uses TrustBadges) */}
      <section className="hidden md:block pt-2 md:pt-6 pb-6 md:pb-20">
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
              <div key={feature.title} className="product-card text-center group bg-slate-800 border-slate-700">
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

      {/* Category Showcase Section */}
      <section className="py-10 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-4xl md:text-5xl text-section-heading mb-4">
              {t('index.categories.title')}
            </h2>
            <p className="text-xl text-muted-foreground text-desc-bold max-w-3xl mx-auto">
              {t('index.categories.description')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: Gamepad2, key: 'gaming', color: 'from-violet-600 to-purple-700' },
              { icon: Monitor,  key: 'displays', color: 'from-blue-600 to-cyan-600' },
              { icon: Plane,    key: 'drones', color: 'from-sky-500 to-blue-600' },
              { icon: Bike,     key: 'ebikes', color: 'from-emerald-500 to-green-600' },
              { icon: Cpu,      key: 'electronics', color: 'from-orange-500 to-amber-500' },
              { icon: Lightbulb, key: 'gadgets', color: 'from-pink-500 to-rose-600' },
            ].map(({ icon: Icon, key, color }) => (
              <Link key={key} to="/products" className="product-card group p-5 md:p-7 flex flex-col gap-4 hover:scale-[1.02] transition-transform bg-slate-800 border-slate-700">
                <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
                  <Icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl text-sub-bold mb-1">{t(`index.categories.${key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground">{t(`index.categories.${key}.description`)}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity mt-auto" />
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/products">
              <Button className="btn-hero">
                <Search className="h-5 w-5" />
                <span>{t('index.categories.cta')}</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How to Partner Section */}
      <section className="py-10 md:py-20 bg-gradient-to-b from-slate-900 to-slate-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-14">
            <h2 className="text-4xl md:text-5xl text-section-heading mb-4">
              {t('index.howToPartner.title')}
            </h2>
            <p className="text-xl text-muted-foreground text-desc-bold max-w-2xl mx-auto">
              {t('index.howToPartner.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
            {/* connector line — desktop only */}
            <div className="hidden md:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-primary/40 via-accent/60 to-primary/40" />

            {[
              { icon: PhoneCall, stepKey: 'step1' },
              { icon: FileText,  stepKey: 'step2' },
              { icon: Package,   stepKey: 'step3' },
            ].map(({ icon: Icon, stepKey }, idx) => (
              <div key={stepKey} className="product-card p-6 md:p-8 text-center bg-slate-800 border-slate-700 relative z-10">
                <div className="text-5xl font-bold gradient-text opacity-20 absolute top-4 right-5 select-none">
                  {t(`index.howToPartner.${stepKey}.number`)}
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl text-sub-bold mb-3">{t(`index.howToPartner.${stepKey}.title`)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t(`index.howToPartner.${stepKey}.description`)}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/contact">
              <Button className="btn-hero">
                <UserPlus className="h-5 w-5" />
                <span>{t('index.howToPartner.cta')}</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Global Stats Section */}
      <section className="py-10 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-14">
            <h2 className="text-4xl md:text-5xl text-section-heading mb-4">
              {t('index.globalStats.title')}
            </h2>
            <p className="text-xl text-muted-foreground text-desc-bold max-w-2xl mx-auto">
              {t('index.globalStats.description')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[
              { valueKey: 'stat1', labelKey: 'stat1', color: 'from-violet-500 to-purple-600' },
              { valueKey: 'stat2', labelKey: 'stat2', color: 'from-blue-500 to-cyan-500' },
              { valueKey: 'stat3', labelKey: 'stat3', color: 'from-emerald-500 to-green-500' },
              { valueKey: 'stat4', labelKey: 'stat4', color: 'from-orange-500 to-amber-500' },
              { valueKey: 'stat5', labelKey: 'stat5', color: 'from-pink-500 to-rose-500' },
              { valueKey: 'stat6', labelKey: 'stat6', color: 'from-sky-500 to-blue-500' },
            ].map(({ valueKey, labelKey, color }) => (
              <div key={valueKey} className="product-card p-5 md:p-6 text-center bg-slate-800 border-slate-700">
                <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}>
                  {t(`index.globalStats.${valueKey}.value`)}
                </div>
                <div className="text-sm text-muted-foreground">{t(`index.globalStats.${labelKey}.label`)}</div>
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

export default Index;
