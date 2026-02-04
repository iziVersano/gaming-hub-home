import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/hooks/I18nContext';

const About = () => {
  const { t } = useI18n();
  const canonicalUrl = typeof window !== 'undefined' ? `${window.location.origin}/about` : '/about';

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Helmet>
        <title>{t('about.title')}</title>
        <meta name="description" content={t('about.trusted')} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Consoltech",
            url: canonicalUrl.replace('/about', ''),
            description:
              "Global import, export, and distribution of consumer electronics and gaming since 2001.",
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
      <main id="main-content" className="container px-4 md:px-6 pt-24 pb-16 flex-1">
        <header className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">{t('about.title')}</h1>
        </header>
        <section className="max-w-3xl mx-auto space-y-3 text-base leading-6 text-muted-foreground">
          <div className="space-y-0">
            <p>{t('about.founded')}</p>
            <p>{t('about.trusted')}</p>
          </div>
          <ul className="list-disc pl-6 space-y-1">
            <li>{t('about.list.electronics')}</li>
            <li>{t('about.list.gaming')}</li>
            <li>{t('about.list.bikes')}</li>
            <li>{t('about.list.gadgets')}</li>
          </ul>
          <div className="space-y-0">
            <p>{t('about.experience')}</p>
            <p>{t('about.markets')}</p>
            <p>{t('about.focus')}</p>
          </div>
          <p>{t('about.deliver')}</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>{t('about.list.retailers')}</li>
            <li>{t('about.list.resellers')}</li>
            <li>{t('about.list.wholesale')}</li>
          </ul>
          <p>{t('about.vip')}</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>{t('about.list.partnerships')}</li>
            <li>{t('about.list.reliability')}</li>
            <li>{t('about.list.logistics')}</li>
          </ul>
          <p>{t('about.source')}</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>{t('about.list.europe')}</li>
            <li>{t('about.list.us')}</li>
            <li>{t('about.list.me')}</li>
            <li>{t('about.list.asia')}</li>
          </ul>
          <div className="space-y-0">
            <p>{t('about.supply')}</p>
            <p>{t('about.needs')}</p>
            <p>{t('about.expanding')}</p>
            <p>{t('about.welcome')}</p>
            <p>{t('about.cooperation')}</p>
          </div>
        </section>
        <section className="max-w-4xl mx-auto mt-12" aria-labelledby="connect-heading">
          <h2 id="connect-heading" className="text-2xl md:text-3xl font-semibold mb-4">
            {t('about.connect')}
          </h2>
          <p className="mb-6">{t('about.business')}</p>
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>{t('about.contactinfo')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>
                  <span className="font-medium">{t('about.address')}</span> 47 Moshe Sneh St., Tel Aviv 6930243, Israel
                </li>
                <li>
                  <span className="font-medium">{t('about.mobile')}</span> <a href="tel:+972522768607" className="underline">+972-52-2768607</a>
                </li>
                <li>
                  <span className="font-medium">{t('about.email')}</span> <a href="mailto:sales@gamestation.co.il" className="underline">sales@gamestation.co.il</a>
                </li>
                <li>
                  <span className="font-medium">{t('about.vat')}</span> 032398497
                </li>
              </ul>
              <p className="mt-6 text-muted-foreground">
                {t('about.thanks')}
                <br />{t('about.manager')}
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;