import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Mail, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const Accessibility = () => {
  const currentDate = new Date().toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>הצהרת נגישות | Consoltech</title>
        <meta name="description" content="מחויבות Consoltech לנגישות דיגיטלית. למידע על עמידה בתקן WCAG 2.1 Level AA ודרכי יצירת קשר לתמיכה בנגישות." />
      </Helmet>

      <Navigation />

      <main id="main-content" className="flex-1 pt-24 pb-16" dir="rtl" lang="he">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              הצהרת נגישות
            </h1>
            <p className="text-muted-foreground text-lg">
              המחויבות שלנו לנגישות דיגיטלית עבור כל המשתמשים
            </p>
          </header>

          <article className="prose prose-invert max-w-none space-y-8">
            {/* Commitment Section */}
            <section aria-labelledby="commitment-heading" className="p-6 rounded-2xl bg-card/30 border border-border/50">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h2 id="commitment-heading" className="text-2xl font-semibold text-foreground mb-4">המחויבות שלנו</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Consoltech מחויבת להבטחת נגישות דיגיטלית לאנשים עם מוגבלויות.
                    אנו פועלים באופן מתמיד לשיפור חוויית המשתמש עבור כולם ומיישמים את
                    תקני הנגישות הרלוונטיים כדי להבטיח גישה שוויונית לכל המשתמשים.
                  </p>
                </div>
              </div>
            </section>

            {/* Conformance Status */}
            <section aria-labelledby="conformance-heading" className="p-6 rounded-2xl bg-card/30 border border-border/50">
              <h2 id="conformance-heading" className="text-2xl font-semibold text-foreground mb-4">סטטוס עמידה בתקנים</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                הנחיות הנגישות לתוכן אינטרנט (WCAG) מגדירות דרישות למעצבים ומפתחים
                לשיפור הנגישות עבור אנשים עם מוגבלויות. התקן מגדיר שלוש רמות עמידה:
                רמה A, רמה AA ורמה AAA.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Consoltech</strong> עומדת באופן חלקי בתקן
                <strong className="text-primary"> WCAG 2.1 Level AA</strong>. עמידה חלקית משמעה
                שחלקים מסוימים מהתוכן אינם עומדים במלואם בתקן הנגישות.
              </p>
            </section>

            {/* Accessibility Features */}
            <section aria-labelledby="features-heading" className="p-6 rounded-2xl bg-card/30 border border-border/50">
              <h2 id="features-heading" className="text-2xl font-semibold text-foreground mb-4">תכונות נגישות</h2>
              <ul className="space-y-3 text-muted-foreground" role="list">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>תמיכה בניווט באמצעות מקלדת בכל האתר</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>קישור מעבר לתוכן הראשי עבור משתמשי קורא מסך</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>מבנה HTML סמנטי עם היררכיית כותרות נכונה</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>טקסט חלופי לתמונות בעלות משמעות</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>יחסי ניגודיות צבע מספקים (WCAG 2.1 AA)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>מחווני פוקוס נראים לאלמנטים אינטראקטיביים</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>תוויות טפסים והודעות שגיאה עבור טכנולוגיות מסייעות</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>עיצוב רספונסיבי למכשירים וגדלי מסך שונים</span>
                </li>
              </ul>
            </section>

            {/* Feedback Section */}
            <section aria-labelledby="feedback-heading" className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-border/50">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h2 id="feedback-heading" className="text-2xl font-semibold text-foreground mb-4">משוב ויצירת קשר</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    אנו מקבלים בברכה משוב על נגישות האתר של Consoltech. אם נתקלתם בחסמי
                    נגישות או שיש לכם הצעות לשיפור, אנא צרו איתנו קשר:
                  </p>
                  <a
                    href="mailto:sales@consoltech.shop"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded px-1"
                  >
                    <Mail className="h-5 w-5" aria-hidden="true" />
                    sales@consoltech.shop
                  </a>
                  <p className="text-muted-foreground mt-4 text-sm">
                    אנו שואפים להשיב למשוב בנושא נגישות תוך 5 ימי עסקים.
                  </p>
                </div>
              </div>
            </section>

            {/* Last Updated */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm pt-4">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span>עודכן לאחרונה: {currentDate}</span>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Accessibility;

