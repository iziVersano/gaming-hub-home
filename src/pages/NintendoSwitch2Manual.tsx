import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, AlertTriangle, Mail, Gamepad, CreditCard, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Manual step data
const steps = [
  {
    id: 'step-1',
    title: 'שלב 1: הפעלת ה-Nintendo Switch 2',
    images: [{ src: '/manual-images/nintendo-switch-2-power-button.jpg', alt: 'כפתור ההפעלה של Nintendo Switch 2', caption: 'אתרו ולחצו על כפתור ההפעלה' }],
    text: ['כדי להתחיל בהגדרת ה-Nintendo Switch 2 שלכם, אתרו את כפתור ההפעלה על הקונסולה. לחצו והחזיקו את הכפתור עד שהמערכת תיכנס לפעולה.', 'תדעו שההפעלה הושלמה כאשר מסך הבית יופיע על הצג.']
  },
  {
    id: 'step-2',
    title: 'שלב 2: חיבור בקרי ה-Joy-Con',
    images: [
      { src: '/manual-images/detaching-joy-con-controller.jpg', alt: 'חיבור בקר Joy-Con', caption: 'החליקו את בקר ה-Joy-Con למקומו' },
      { src: '/manual-images/instructions-for-detaching-joy-cons.jpg', alt: 'ניתוק בקרי Joy-Con', caption: 'לניתוק: לחצו על לחצן השחרור והחליקו החוצה' }
    ],
    text: ['קחו אחד מבקרי ה-Joy-Con שסופקו עם הקונסולה. יישרו אותו עם צד ה-Nintendo Switch 2 והחליקו אותו למקומו.', 'תשמעו קליק כאשר הבקר מחובר כראוי.', 'לניתוק, פשוט לחצו על לחצן השחרור הקטן בגב והחליקו החוצה.']
  },
  {
    id: 'step-3',
    title: 'שלב 3: בחירת שפה ואזור',
    images: [{ src: '/manual-images/hqdefault.jpg', alt: 'בחירת שפה ואזור - בחרו עברית ואזור ישראל מתפריט ההגדרות', caption: '' }],
    text: ['כעת, הגיע הזמן לבחור את השפה המועדפת עליכם. תוכלו לעשות זאת על ידי נגיעה במסך או שימוש בבקר על ידי לחיצה על כפתור A.', 'לאחר מכן, בחרו את האזור הנכון. לדוגמה, אם אתם בישראל, בחרו את האזור המתאים מהאפשרויות המוצגות.']
  },
  {
    id: 'step-4',
    title: 'שלב 4: עיון ואישור הסכם המשתמש',
    images: [{ src: '/manual-images/maxresdefault.jpg', alt: 'מסך הסכם משתמש - סמנו את תיבת האישור ולחצו המשך', caption: '' }],
    text: ['לפני שתמשיכו, תתבקשו לעיין בהסכם רישיון למשתמש קצה.', "לאחר שקראתם והסכמתם לתנאים, לחצו על 'המשך' כדי להתקדם."]
  },
  {
    id: 'step-5',
    title: 'שלב 5: התחברות לאינטרנט',
    images: [{ src: '/manual-images/wi-fi-connection-screen.jpg', alt: 'מסך חיבור Wi-Fi', caption: 'בחרו את רשת ה-Wi-Fi שלכם' }],
    text: ['כעת, חברו את ה-Nintendo Switch 2 לאינטרנט. בחרו את רשת ה-Wi-Fi שלכם מהרשימה והזינו את הסיסמה.', 'שלב זה מבטיח שיהיו לכם העדכונים האחרונים של המערכת מוכנים להתקנה.']
  },
  {
    id: 'step-6',
    title: 'שלב 6: עדכון מערכת',
    images: [{ src: '/manual-images/wi-fi-connection-screen.jpg', alt: 'מסך עדכון מערכת הפעלה', caption: 'אשרו את התקנת עדכוני המערכת' }],
    text: ['לאחר ההתחברות לאינטרנט, המערכת תבקש מכם להוריד ולהתקין עדכונים זמינים.', 'תהליך זה ישפר את ביצועי המערכת ואת האבטחה שלה. לחצו על הבא כדי להתחיל את העדכון.']
  },
  {
    id: 'step-7',
    title: 'שלב 7: הגדרת אזור זמן',
    images: [{ src: '/manual-images/timezone.png', alt: 'מסך בחירת אזור זמן', caption: '' }],
    text: ['בחרו את אזור הזמן המתאים למיקומכם.', 'לדוגמה: אם אתם בישראל, בחרו Tel Aviv, Jerusalem (UTC-03:00) ולחצו OK.']
  },
  {
    id: 'step-8',
    title: 'שלב 8: סגנונות משחק והגדרות',
    images: [{ src: '/manual-images/nintendo-switch-2-kickstand.jpg', alt: 'מעמד Nintendo Switch 2', caption: 'השתמשו במעמד המובנה למצב שולחני' }],
    text: ['ה-Nintendo Switch 2 שלכם מציע מגוון סגנונות משחק. למצב שולחני, השתמשו במעמד המובנה בגב המכשיר.', 'תוכלו גם להכניס כרטיס Micro SD לאחסון נוסף על ידי הרמת המעמד. זכרו להשתמש בכרטיסי Micro SD Express לתאימות מלאה.']
  },
  {
    id: 'step-9',
    title: 'שלב 9: ניתוק בקרי ה-Joy-Con',
    images: [{ src: '/manual-images/instructions-for-detaching-joy-cons.jpg', alt: 'ניתוק בקרי Joy-Con', caption: 'לחצו על לחצן השחרור והחליקו החוצה' }],
    text: ['המערכת עשויה לבקש מכם לנתק את בקרי ה-Joy-Con לצורך ההגדרה.', 'פשוט לחצו על לחצן השחרור בכל בקר והחליקו אותם החוצה בזהירות. תוכלו להתחיל עם הצד הימני או השמאלי.']
  },
  {
    id: 'step-10',
    title: 'שלב 10: חיבור לטלוויזיה (אופציונלי)',
    images: [
      { src: '/manual-images/bee-dock2-openback-photo.jpg', alt: 'פתיחת המכסה האחורי של תחנת העגינה', caption: '' },
      { src: '/manual-images/bee-dock2-cables-pluggedin-photo.jpg', alt: 'חיבור כבלים לתחנת העגינה', caption: '' },
      { src: '/manual-images/bee-tvmode-dockedpluggedin-photo.jpg', alt: 'Nintendo Switch 2 מחובר לטלוויזיה', caption: '' }
    ],
    text: [
      'פתחו את המכסה האחורי של תחנת העגינה של Nintendo Switch 2.',
      'חברו את כבל ה-USB Type-C של מתאם החשמל (דגם NGN-01) ליציאת החשמל בתחנת העגינה, ואת התקע לשקע בקיר. שימו לב: מתאם החשמל של Nintendo Switch הרגיל אינו תואם למצב טלוויזיה.',
      'חברו קצה אחד של כבל HDMI מהיר במיוחד (Ultra High Speed) ליציאת ה-HDMI בתחנת העגינה, והקצה השני ליציאת HDMI בטלוויזיה. חשוב: כבל ה-HDMI שמצורף ל-Nintendo Switch הרגיל אינו מתאים.',
      'סגרו את המכסה האחורי של תחנת העגינה.',
      'הסירו את בקרי ה-Joy-Con 2 מהקונסולה. אם הבקרים לא היו מחוברים קודם לכן, יש לבצע צימוד תחילה.',
      'מקמו את הקונסולה כך שהמסך פונה לאותו כיוון כמו הפאנל הקדמי של תחנת העגינה, והכניסו אותה לתחנה. כשהקונסולה מעוגנת, המסך יכבה.',
      'הדליקו את הטלוויזיה ובחרו את כניסת ה-HDMI הנכונה.'
    ]
  },
  {
    id: 'step-11',
    title: 'שלב 11: בחירת סגנון ההגדרה',
    images: [{ src: '/manual-images/joy-con-controller-setup-options.jpg', alt: 'אפשרויות הגדרת בקר Joy-Con', caption: 'בחרו כיצד להשתמש בבקרי ה-Joy-Con שלכם' }],
    text: ['בשלב זה, יש לכם אפשרות לבחור כיצד תרצו להשתמש בבקרי ה-Joy-Con.', 'חברו אותם בדרכים שונות באמצעות האביזרים שסופקו. תוכלו לשנות הגדרה זו בכל עת.']
  },
  {
    id: 'step-12',
    title: 'שלב 12: השלמת עדכון המערכת',
    images: [],
    text: ['לאחר השלמת עדכון המערכת, החליטו האם להתחיל העברת נתונים. אפשרות זו מיועדת למשתמשים שמעבירים נתונים מקונסולת Switch אחרת.', "אם אתם מעדיפים לא להעביר נתונים, בחרו 'אל תעביר' כדי להתחיל מחדש."]
  },
  {
    id: 'step-13',
    title: 'שלב 13: הוספת חשבון משתמש',
    images: [{ src: '/manual-images/add-user-account-screen.png', alt: 'מסך הוספת חשבון משתמש', caption: 'הוסיפו או התחברו לחשבון Nintendo שלכם' }],
    text: ['הגיע הזמן להוסיף משתמש ל-Nintendo Switch 2 שלכם. תוכלו להתחבר עם חשבון Nintendo קיים או ליצור חשבון חדש.', 'אם תבחרו באפשרות הראשונה, תקבלו קוד QR לסריקה עם הטלפון שלכם לצורך אימות.']
  },
  {
    id: 'step-14',
    title: 'שלב 14: הגדרת בקרת הורים (אופציונלי)',
    images: [{ src: '/manual-images/parental-controls-setup.jpg', alt: 'הגדרת בקרת הורים', caption: 'הגדירו בקרת הורים במידת הצורך' }],
    text: ['למשתמשים עם ילדים, מומלץ להפעיל בקרת הורים. הגדירו הגדרות אלו בהתאם להעדפותיכם.', 'תוכלו גם לדלג על שלב זה ולהגדיר זאת מאוחר יותר במידת הצורך.']
  },
  {
    id: 'step-15',
    title: 'שלב 15: סיום ההתקנה',
    images: [{ src: '/manual-images/nintendo-switch-2-home-button.jpg', alt: 'כפתור הבית של Nintendo Switch 2', caption: 'לחצו על כפתור הבית לגישה לתפריט' }],
    text: ['סיימתם את הגדרת ה-Nintendo Switch 2 שלכם!', 'לחצו על כפתור הבית הנמצא בצד ימין של הקונסולה לגישה לתפריט הראשי. משם תוכלו להוריד משחקים ותוכן נוסף או לחקור את התכונות של המערכת החדשה שלכם.']
  }
];

// Table of contents data
const tocItems = steps.map((step, index) => ({
  id: step.id,
  title: step.title,
  number: index + 1
}));

// Additional sections for table of contents
const additionalTocItems = [
  { id: 'post-setup', title: '🎮 המשך שימוש – טעינת משחקים והכנסת כרטיס' },
  { id: 'game-loaded', title: '✅ אימות טעינת המשחק' },
  { id: 'parental-controls', title: '🔒 בקרת הורים' },
  { id: 'safety-warnings', title: '⚠️ אזהרות בטיחות' },
  { id: 'importer-service', title: '🛠️ פרטי שירות – CONSOLTECH' },
];

// Reusable CTA Banner Component
const WarrantyCTABanner = () => (
  <section className="max-w-3xl mx-auto py-4 px-6 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-border/50">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-1">רכשתם <span dir="ltr">Nintendo Switch 2</span>?</h2>
        <p className="text-muted-foreground text-sm">הפעילו את האחריות שלכם עכשיו</p>
      </div>
      <Link to="/warranty" className="flex-shrink-0">
        <Button className="btn-hero px-4 py-2 text-sm">
          <span>רישום אחריות</span>
          <ArrowRight className="h-4 w-4 rotate-180" />
        </Button>
      </Link>
    </div>
  </section>
);

const NintendoSwitch2Manual = () => {
  const canonicalUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/nintendo-switch-2`
    : '/nintendo-switch-2';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>מדריך התקנה Nintendo Switch 2 | Consoltech</title>
        <meta name="description" content="מדריך התקנה מלא ל-Nintendo Switch 2 בעברית. הוראות שלב אחר שלב להפעלה ראשונית, חיבור בקרים, הגדרת רשת ועוד." />
        <link rel="canonical" href={canonicalUrl} />
        <html lang="he" />
      </Helmet>

      {/* Navigation stays LTR */}
      <Navigation />

      {/* Main content is RTL Hebrew */}
      <main id="main-content" dir="rtl" className="container px-4 md:px-6 pt-24 pb-16 flex-1">
        {/* CTA Banner - Top */}
        <div className="mb-10">
          <WarrantyCTABanner />
        </div>

        {/* Header */}
        <header className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">Nintendo Switch 2</span>
          </h1>
          <p className="text-xl text-muted-foreground">מדריך התקנה (שלב אחר שלב)</p>
        </header>

        {/* Table of Contents */}
        <nav className="max-w-3xl mx-auto mb-12 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
          <h2 className="text-xl font-bold mb-4 text-primary">תוכן עניינים</h2>
          <ol className="space-y-2 pr-4">
            {tocItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
          <div className="mt-6 pt-4 border-t border-border/50">
            <h3 className="text-lg font-semibold mb-3 text-primary">מידע נוסף</h3>
            <ul className="space-y-2 pr-4">
              <li>
                <a
                  href="https://support.nintendo.co.il/category/nintendo-switch-2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold text-base hover:text-primary/80 transition-colors inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  🔗 תמיכה רשמית – Nintendo Switch 2
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
              {additionalTocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Steps */}
        <div className="max-w-3xl mx-auto space-y-12">
          {steps.map((step) => (
            <section 
              key={step.id} 
              id={step.id} 
              className="scroll-mt-24 p-6 rounded-2xl bg-card/30 border border-border/50"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-foreground pr-4 border-r-4 border-primary">
                {step.title}
              </h2>
              
              <div className="space-y-6">
                {step.images.map((img, idx) => (
                  <figure key={idx} className="text-center">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="mx-auto rounded-xl shadow-lg max-w-full h-auto border border-border"
                      loading="lazy"
                    />
                    {img.caption && (
                      <figcaption className="mt-3 text-sm text-muted-foreground italic">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
                
                <div className="p-4 rounded-xl bg-muted/30 space-y-3">
                  {step.text.map((paragraph, idx) => (
                    <p key={idx} className="text-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Post-Setup Instructions Section */}
        <section id="post-setup" className="max-w-3xl mx-auto mt-16 scroll-mt-24 p-6 rounded-2xl bg-card/30 border border-border/50">
          <div className="flex items-center gap-3 mb-6 pr-4 border-r-4 border-accent">
            <Gamepad className="h-7 w-7 text-accent" />
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              המשך שימוש – טעינת משחקים והכנסת כרטיס
            </h2>
          </div>

          {/* How to load a game */}
          <div className="mb-8 p-4 rounded-xl bg-muted/30">
            <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
              <span>🎮</span> איך לטעון משחק
            </h3>
            <ul className="space-y-3 text-foreground">
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span><strong>הפעלת משחק מהתפריט הראשי:</strong> בחרו את סמל המשחק מהמסך הראשי ולחצו על כפתור A.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span><strong>לאחר הכנסת כרטיס משחק:</strong> המשחק יופיע אוטומטית בתפריט הראשי. בחרו בו להתחלת המשחק.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span><strong>הבדל בין משחק דיגיטלי לפיזי:</strong> משחק דיגיטלי נשמר בזיכרון הקונסולה וזמין תמיד. משחק פיזי דורש הכנסת כרטיס בכל שימוש.</span>
              </li>
            </ul>
          </div>

          {/* How to insert game card */}
          <div className="p-4 rounded-xl bg-muted/30">
            <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <span>איך להכניס כרטיס משחק נכון</span>
            </h3>

            <figure className="text-center mb-6">
              <img
                src="/manual-images/nintendo-switch-2-game-console.jpg"
                alt="הכנסת כרטיס משחק לקונסולת Nintendo Switch 2 בכיוון הנכון"
                className="mx-auto rounded-xl shadow-lg max-w-full h-auto border border-border"
                loading="lazy"
              />
              <figcaption className="mt-3 text-sm text-muted-foreground italic">
                כיוון נכון להכנסת כרטיס משחק
              </figcaption>
            </figure>

            <ul className="space-y-3 text-foreground mb-6">
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span><strong>איך להחזיק את הכרטיס:</strong> החזיקו את הכרטיס בעדינות בין האצבעות, עם התווית כלפי מעלה.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span><strong>כיוון נכון להכנסה:</strong> ודאו שצד המגעים החשמליים פונה כלפי המסך, והחלק המעוגל פונה כלפי מטה.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span><strong>לא להפעיל כוח:</strong> הכניסו את הכרטיס בעדינות עד שתשמעו קליק קל. אל תדחפו בכוח!</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span><strong>מה עלול להיפגע:</strong> הכנסה לא נכונה עלולה לגרום נזק לחריץ הכרטיס, למגעים החשמליים, או לכרטיס המשחק עצמו.</span>
              </li>
            </ul>

            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
              <p className="text-destructive font-medium flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>הכנסה לא נכונה של כרטיס המשחק עלולה לגרום נזק לחריץ הכרטיס בקונסולה.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Game Loaded Successfully Section */}
        <section id="game-loaded" className="max-w-3xl mx-auto mt-12 scroll-mt-24 p-6 rounded-2xl bg-card/30 border border-border/50">
          <div className="flex items-center gap-3 mb-6 pr-4 border-r-4 border-green-500">
            <span className="text-2xl">✅</span>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              אימות טעינת המשחק
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 space-y-4">
            <p className="text-foreground leading-relaxed">
              לאחר הכנסת כרטיס המשחק בהצלחה, כך תוודאו שהמשחק נטען כראוי:
            </p>

            <ul className="space-y-3 text-foreground">
              <li className="flex gap-2">
                <span className="text-green-500 font-bold">1.</span>
                <span><strong>עברו למסך הבית:</strong> לחצו על כפתור הבית בבקר ה-Joy-Con הימני.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500 font-bold">2.</span>
                <span><strong>חפשו את אייקון המשחק:</strong> בצד שמאל של המסך הראשי יופיע אייקון המשחק שהכנסתם.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500 font-bold">3.</span>
                <span><strong>אישור טעינה:</strong> אם האייקון מופיע – המשחק נטען בהצלחה ומוכן להפעלה!</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500 font-bold">4.</span>
                <span><strong>התחלת המשחק:</strong> בחרו באייקון המשחק ולחצו על כפתור A להתחלה.</span>
              </li>
            </ul>

            <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-sm text-muted-foreground">
                💡 <strong>טיפ:</strong> אם האייקון לא מופיע, נסו להוציא ולהכניס מחדש את כרטיס המשחק. ודאו שהכיוון נכון.
              </p>
            </div>
          </div>
        </section>

        {/* Parental Controls Section */}
        <section id="parental-controls" className="max-w-3xl mx-auto mt-12 scroll-mt-24 p-6 rounded-2xl bg-card/30 border border-border/50">
          <div className="flex items-center gap-3 mb-6 pr-4 border-r-4 border-primary">
            <Shield className="h-7 w-7 text-primary" />
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              🔒 בקרת הורים
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 space-y-4">
            <p className="text-foreground leading-relaxed">
              <strong>בקרת הורים מיועדת להגנה על ילדים</strong> ומאפשרת לכם לשלוט בחוויית המשחק שלהם.
            </p>

            <ul className="space-y-3 text-foreground">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>הגבלת זמן משחק:</strong> קבעו מגבלות זמן יומיות למשחק. כשהזמן נגמר, תופיע התראה על המסך.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>חסימת תכנים לפי גיל:</strong> הגבילו גישה למשחקים ותכנים לפי דירוג גיל מתאים.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>שליטה מרחוק דרך אפליקציה:</strong> השתמשו באפליקציית Nintendo Switch Parental Controls בטלפון שלכם לניהול ומעקב מרחוק.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>הגבלת תקשורת:</strong> שלטו ביכולת הילדים לתקשר עם שחקנים אחרים באינטרנט.</span>
              </li>
            </ul>

            <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-sm text-muted-foreground">
                💡 <strong>טיפ:</strong> ניתן להגדיר בקרת הורים בכל עת דרך הגדרות המערכת או באמצעות האפליקציה הייעודית.
              </p>
            </div>
          </div>
        </section>

        {/* Safety Warnings Section */}
        <section id="safety-warnings" className="max-w-3xl mx-auto mt-12 scroll-mt-24 p-6 rounded-2xl bg-card/30 border border-destructive/50">
          <div className="flex items-center gap-3 mb-6 pr-4 border-r-4 border-destructive">
            <AlertTriangle className="h-7 w-7 text-destructive" />
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              ⚠️ אזהרות בטיחות
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-destructive/5 space-y-4">
            <p className="text-foreground leading-relaxed font-medium">
              לשמירה על בטיחותכם ועל תקינות המכשיר, אנא הקפידו על ההנחיות הבאות:
            </p>

            <ul className="space-y-3 text-foreground">
              <li className="flex gap-2">
                <span className="text-destructive font-bold">⚠️</span>
                <span><strong>לא להכניס כרטיס משחק בכוח:</strong> אם הכרטיס לא נכנס בקלות, בדקו את הכיוון. הכנסה בכוח עלולה לגרום נזק לחריץ ולכרטיס.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive font-bold">⚠️</span>
                <span><strong>לא לחבר/לנתק Joy-Con באלימות:</strong> החליקו את הבקרים בעדינות. משיכה או דחיפה בכוח עלולים לשבור את מנגנון הנעילה.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive font-bold">⚠️</span>
                <span><strong>לא לחסום פתחי אוורור:</strong> ודאו שפתחי האוורור בקונסולה פתוחים ולא חסומים. חסימתם עלולה לגרום להתחממות יתר ונזק למערכת.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive font-bold">⚠️</span>
                <span><strong>שימוש במטען מקורי בלבד:</strong> השתמשו רק במטען ובאביזרים מקוריים של Nintendo. שימוש במטענים לא מאושרים עלול לגרום נזק או סכנת שריפה.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive font-bold">⚠️</span>
                <span><strong>לא לחשוף לחום או מים:</strong> הרחיקו את הקונסולה ממקורות חום ישירים ומנוזלים. טמפרטורה גבוהה או רטיבות עלולים לגרום נזק בלתי הפיך.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive font-bold">⚠️</span>
                <span><strong>להרחיק מהישג ידם של ילדים קטנים:</strong> חלקים קטנים כמו כרטיסי משחק עלולים להוות סכנת חנק לילדים מתחת לגיל 3.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Importer Service Details Section */}
        <section id="importer-service" className="max-w-3xl mx-auto mt-12 scroll-mt-24 p-6 rounded-2xl bg-card/30 border border-border/50">
          <div className="flex items-center gap-3 mb-6 pr-4 border-r-4 border-accent">
            <Mail className="h-7 w-7 text-accent" />
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              🛠️ פרטי שירות – CONSOLTECH
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-foreground leading-relaxed mb-6">
              לשירות, תמיכה טכנית ומימוש אחריות
            </p>

            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-lg bg-card/50 border border-border/50 w-full max-w-md text-center">
                <p className="text-sm text-muted-foreground mb-1">שירות לקוחות</p>
                <a href="mailto:sales@consoltech.shop" className="font-medium text-accent hover:underline text-lg">
                  sales@consoltech.shop
                </a>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/30">
              <p className="text-foreground mb-2">
                📋 <strong>רישום אחריות:</strong> לצורך מימוש האחריות, יש לרשום את המוצר באתר שלנו.
              </p>
              <Link to="/warranty" className="text-accent hover:underline font-medium">
                לחצו כאן לטופס רישום אחריות ←
              </Link>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-sm text-muted-foreground">
                ✉️ <strong>לשירות מהיר יותר:</strong> הכינו מראש את מספר הסידורי של המוצר ואת פרטי הרכישה.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner - Bottom */}
        <div className="mt-12">
          <WarrantyCTABanner />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NintendoSwitch2Manual;

