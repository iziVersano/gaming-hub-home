import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Flame, Send, Trophy, Star, Globe, X, Loader2, ScrollText, Zap, MapPin } from 'lucide-react';
import { getPlaces, type Place } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const LIT_KEY = 'kotel_lit_wishes';

interface Wish {
  id: number;
  name: string;
  city: string;
  wish: string;
  category: string;
  forWhom?: string;
  placeName?: string;
  candles: number;
  points: number;
  createdAt: string;
}

interface PlaceResult {
  wish: Wish;
  pointsAwarded: number;
  isChallenge: boolean;
  streak: number;
  streakBonus: boolean;
}

const CITIES = ['ישראל', 'New York', 'Paris', 'Buenos Aires', 'London', 'Moscow'];

const MITZVOT = [
  { key: 'chesed',   he: 'חסד',           en: 'Loving Kindness',     emoji: '❤️',  color: '#f87171', bg: '#fef2f2' },
  { key: 'tzedakah', he: 'צדקה',          en: 'Charity',             emoji: '💛',  color: '#f59e0b', bg: '#fffbeb' },
  { key: 'bikur',    he: 'ביקור חולים',   en: 'Visiting Sick',       emoji: '💚',  color: '#34d399', bg: '#f0fdf4' },
  { key: 'orchim',   he: 'הכנסת אורחים', en: 'Welcoming Guests',    emoji: '🕊️', color: '#60a5fa', bg: '#eff6ff' },
  { key: 'avelim',   he: 'ניחום אבלים',  en: 'Comforting Mourners', emoji: '💜',  color: '#a78bfa', bg: '#f5f3ff' },
  { key: 'horim',    he: 'כיבוד הורים',  en: 'Honoring Parents',    emoji: '🌸',  color: '#f472b6', bg: '#fdf4ff' },
  { key: 'olam',     he: 'תיקון עולם',   en: 'Repairing the World', emoji: '🌱',  color: '#2dd4bf', bg: '#f0fdfa' },
  { key: 'gmilut',   he: 'גמילות חסדים', en: 'Acts of Kindness',    emoji: '🌟',  color: '#fb923c', bg: '#fff7ed' },
] as const;

type MitzvahKey = typeof MITZVOT[number]['key'];

const DEED_CATALOG: Record<MitzvahKey, Record<string, string[]>> = {
  chesed: {
    'ישראל': [
      'עזור לעולה חדש להסתגל לחיים בארץ',
      'הצע עזרה לשכן קשיש בעבודות הבית',
      'הכן ארוחה למשפחה שאחד מחבריה חולה',
      'עזור לחייל שנמצא רחוק מהבית',
      'התנדב במרכז קליטה עולים',
    ],
    'New York': [
      "Help a new immigrant navigate the city's services",
      'Shovel snow for an elderly neighbor who needs it',
      'Leave a home-cooked meal for a new mother in your building',
      'Offer to carry groceries for someone struggling on the stairs',
      'Sit with a lonely neighbor and truly listen',
    ],
    'Paris': [
      'Aide un voisin âgé à porter ses courses',
      "Propose ton aide à un nouvel arrivant dans l'immeuble",
      'Prépare un repas pour une famille dans le besoin',
      "Accompagne quelqu'un chez le médecin",
      "Offre du temps à quelqu'un qui est seul",
    ],
    'Buenos Aires': [
      'Ayuda a un vecino anciano con sus compras',
      'Ofrece comida casera a una familia que lo necesita',
      'Acompaña a alguien al médico si no puede ir solo',
      'Escucha a alguien que necesita ser escuchado',
      'Ayuda a un inmigrante nuevo a orientarse en la ciudad',
    ],
    'London': [
      'Help an elderly neighbour carry heavy shopping bags',
      'Offer to drive someone to a medical appointment',
      'Cook a meal for a new mother or neighbour in need',
      "Check in on a neighbour you haven't seen recently",
      'Volunteer an hour of practical help for someone who needs it',
    ],
    'Moscow': [
      'Помоги пожилому соседу с тяжёлыми сумками',
      'Предложи помощь новому иммигранту в документах',
      'Приготовь еду для семьи, которой нужна помощь',
      'Побудь рядом с одиноким человеком',
      'Помоги кому-то разобраться с технологиями',
    ],
  },
  tzedakah: {
    'ישראל': [
      'תרום ל"לקט ישראל" — 18 שקלים לסל מזון',
      'תרום בגדים שאינך משתמש בהם לעמותה',
      'תרום ל"יד שרה" — ציוד רפואי לנזקקים',
      'הפרש 10% מהוצאותיך השבועיות לצדקה',
      'תרום דם — הצדקה הגדולה ביותר',
    ],
    'New York': [
      'Donate $18 (chai) to UJA-Federation this week',
      'Give non-perishable food to City Harvest food bank',
      'Donate gently used clothing to a local synagogue drive',
      'Volunteer one hour at a Lower East Side soup kitchen',
      'Give $1 to every person who asks today',
    ],
    'Paris': [
      'Donne 18€ au FSJU (Fonds Social Juif Unifié)',
      "Apporte des vêtements en bon état à une association locale",
      'Fais un don à la Fondation pour la Mémoire de la Shoah',
      'Donne de la nourriture non périssable à une banque alimentaire',
      "Consacre une heure de bénévolat à une association caritative",
    ],
    'Buenos Aires': [
      'Dona alimentos no perecederos a la Fundación Tzedaká',
      'Da ropa usada a AMIA para redistribución social',
      'Ofrece una hora de voluntariado en una organización judía',
      'Compra y dona un kit de alimentos para una familia',
      'Reserva 18 pesos para una donación esta semana',
    ],
    'London': [
      'Donate £18 (chai) to Jewish Care this week',
      'Give unused clothing to a local Jewish charity shop',
      'Donate to World Jewish Relief this Shabbat',
      'Give a bag of non-perishable food to a food bank',
      'Volunteer one hour with a Jewish welfare organisation',
    ],
    'Moscow': [
      'Пожертвуй деньги Еврейской общине Москвы',
      'Отдай ненужную одежду в благотворительный фонд',
      'Купи продукты и отдай нуждающейся семье',
      'Пожертвуй книги или учебные материалы',
      'Отдай часть своего дохода на цдаку на этой неделе',
    ],
  },
  bikur: {
    'ישראל': [
      'בקר חבר או שכן שמחלים בבית',
      'הצטרף לארגון "ביקור חולים" בבית חולים קרוב',
      'הבא פרחים ופרי לאדם שיצא ממחלה',
      'שלח הודעת תמיכה אמיתית למי שבקושי בריאותי',
      'הכן מרק ביתי למי שכרגע חולה',
    ],
    'New York': [
      'Visit a patient through Bikur Cholim of Greater New York',
      'Bring homemade soup to a friend recovering from surgery',
      'Call someone you know is in hospital right now',
      'Bring a book or magazine to someone stuck at home sick',
      'Volunteer an afternoon at a local hospital visiting program',
    ],
    'Paris': [
      'Rends visite à un membre de la communauté hospitalisé',
      "Apporte une soupe maison à quelqu'un qui récupère",
      "Appelle quelqu'un que tu sais en mauvaise santé",
      "Accompagne quelqu'un à un rendez-vous médical",
      "Propose ton aide à une famille dont un proche est malade",
    ],
    'Buenos Aires': [
      'Visita a un enfermo de la comunidad judía',
      'Lleva comida casera a alguien que se está recuperando',
      'Llama a alguien que sabes que está hospitalizado',
      'Ofrece llevar a alguien a un turno médico',
      'Haz una visita a un anciano de la comunidad',
    ],
    'London': [
      'Visit a patient through the Jewish Visiting Service',
      'Bring homemade soup to a friend recovering from illness',
      'Call someone you know who has been unwell lately',
      'Take someone to a medical appointment they dread going alone',
      'Volunteer at a Jewish care home visiting residents',
    ],
    'Moscow': [
      'Навести больного члена еврейской общины',
      'Принеси домашний суп соседу, который болеет',
      'Позвони тому, кто недавно был в больнице',
      'Отвези кого-то на приём к врачу',
      'Предложи помощь семье, у которой кто-то болеет',
    ],
  },
  orchim: {
    'ישראל': [
      'הזמן חייל לארוחת שבת בביתך',
      'קבל אורח שנמצא לבד לחג',
      'הזמן סטודנט זר שאין לו משפחה בארץ לסעודה',
      'פתח ביתך לסעודת שבת גדולה עם שכנים',
      'קבל שכן חדש לשכונה בביקור קבלת פנים',
    ],
    'New York': [
      'Invite a college student far from family for Shabbat dinner',
      'Host a new family in the neighbourhood for a Friday night meal',
      "Welcome a convert to Judaism at your synagogue's Shabbat",
      "Invite someone who'd otherwise eat Shabbat alone",
      'Open your Passover seder to someone with no family nearby',
    ],
    'Paris': [
      'Invite un étudiant loin de sa famille pour le Shabbat',
      'Accueille une famille récemment arrivée dans la communauté',
      'Ouvre ta table de Shabbat à quelqu\'un qui serait seul',
      "Invite un converti au judaïsme à célébrer avec toi",
      'Accueille des inconnus à ton Séder de Pessah',
    ],
    'Buenos Aires': [
      'Invita a un estudiante lejos de su familia a cenar Shabat',
      'Abre tu mesa de Rosh Hashana a alguien solo en la ciudad',
      'Dale la bienvenida a una familia nueva en la comunidad',
      'Comparte tu Seder de Pesaj con alguien sin familia cerca',
      'Invita a un convertido al judaísmo a tu casa',
    ],
    'London': [
      'Invite a student who is far from home for Shabbat dinner',
      'Welcome a new family to your synagogue community',
      'Host someone alone at Yom Tov in your home',
      'Open your Seder to someone without a family to celebrate with',
      'Invite a lonely elder from your community for Shabbat lunch',
    ],
    'Moscow': [
      'Пригласи студента, далёкого от семьи, на субботний ужин',
      'Прими новую семью в еврейской общине тепло',
      'Открой свой дом для гостей на праздник',
      'Пригласи одинокого человека на сейдер Пасхи',
      'Познакомься с новым членом синагоги и пригласи его',
    ],
  },
  avelim: {
    'ישראל': [
      'בקר משפחה שנמצאת בשבעה',
      'שלח מכתב נחמה אמיתי למי שאיבד יקיר',
      'הבא אוכל לבית אבל — לא לשאול, פשוט להביא',
      'התקשר למישהו ביום היארצייט שלו',
      'שב לצד אדם שכול ופשוט הקשב',
    ],
    'New York': [
      'Visit a shiva house in your community this week',
      'Bring a prepared meal to a family sitting shiva',
      'Send a handwritten condolence card to a grieving family',
      "Call a friend on their parent's yahrzeit to acknowledge the day",
      'Sit with a mourner and just listen — without trying to fix',
    ],
    'Paris': [
      'Rends visite à une famille endeuillée chez elle',
      'Apporte un repas préparé à une famille en deuil',
      'Envoie une carte de condoléances écrite à la main',
      "Appelle quelqu'un le jour du Yahrzeit de son proche",
      "Reste assis en silence avec quelqu'un qui souffre",
    ],
    'Buenos Aires': [
      'Visita a una familia en duelo en su hogar',
      'Lleva comida preparada a una casa de shivá',
      'Manda una carta escrita a mano de condolencias',
      'Llama a un amigo el día del aniversario de una pérdida',
      'Acompaña a alguien en silencio cuando está de luto',
    ],
    'London': [
      'Visit a shiva house in your community',
      'Bring a home-cooked meal to a family in mourning',
      'Write a heartfelt handwritten condolence card',
      'Attend a shiva minyan so the family can say Kaddish',
      "Call a friend on the anniversary of their loved one's passing",
    ],
    'Moscow': [
      'Навести семью в трауре дома',
      'Принеси готовую еду семье на шиве',
      'Напиши настоящее письмо соболезнования от руки',
      'Позвони другу в годовщину потери близкого',
      'Организуй миньян для шивы, если нужен',
    ],
  },
  horim: {
    'ישראל': [
      'התקשר להוריך — רק כדי לשמוע איך הם',
      'בקר הורים שגרים לבד, ללא סיבה מיוחדת',
      'עזור להורה מבוגר עם ענייני בנק, רפואה, או טכנולוגיה',
      'הזמן את ההורים לסעודת שבת אצלך',
      'אמור להורים שאתה אוהב אותם — עכשיו, לא מחר',
    ],
    'New York': [
      'Call your parents today — not for a reason, just to talk',
      'Take your parents out for dinner this week',
      'Help your elderly parents with their smartphone or computer',
      'Send your mother flowers for no occasion at all',
      "Visit grandparents who haven't seen you in too long",
    ],
    'Paris': [
      "Appelle tes parents aujourd'hui juste pour prendre de leurs nouvelles",
      'Emmène tes parents au restaurant cette semaine',
      'Aide tes parents âgés avec leur téléphone ou ordinateur',
      'Envoie des fleurs à ta mère sans raison particulière',
      "Rends visite à tes grands-parents que tu n'as pas vus depuis longtemps",
    ],
    'Buenos Aires': [
      'Llama a tus padres hoy solo para escucharlos',
      'Invita a tus padres a cenar en casa esta semana',
      'Ayuda a tus padres mayores con tecnología o trámites',
      'Manda flores a tu madre sin ninguna razón especial',
      'Visita a los abuelos que no ves hace demasiado tiempo',
    ],
    'London': [
      'Call your parents today — just to chat, not to ask for anything',
      'Take your parents out for a meal this weekend',
      'Help your elderly parents with technology or admin',
      "Send your mum flowers with a note saying why you love her",
      "Visit grandparents who haven't seen you for a while",
    ],
    'Moscow': [
      'Позвони родителям сегодня просто так',
      'Своди родителей в ресторан на этой неделе',
      'Помоги пожилым родителям разобраться с технологиями',
      'Пошли маме цветы без всякого повода',
      'Навести бабушку и дедушку, которых давно не видел',
    ],
  },
  olam: {
    'ישראל': [
      'הצטרף לניקוי חוף ים או פארק קהילתי',
      'התנדב בארגון זכויות אדם ישראלי',
      'השתתף בגינה קהילתית בשכונתך',
      'דווח על פגם בתשתית שגורם לסכנה',
      'תרום לארגון הסביבה הישראלי "אדם טבע ודין"',
    ],
    'New York': [
      'Join a Central Park or Prospect Park cleanup',
      'Volunteer with a Jewish social justice organization',
      'Serve a shift at a Lower East Side soup kitchen',
      "Advocate for human rights through T'ruah: The Rabbinic Call",
      'Plant a tree through the NYC Parks tree-planting program',
    ],
    'Paris': [
      'Rejoins un nettoyage des berges de la Seine',
      'Bénévole pour une ONG de justice sociale juive',
      "Participe à une action écologique dans ton arrondissement",
      "Soutiens une pétition pour les droits de l'homme",
      'Plante des arbres avec une association environnementale',
    ],
    'Buenos Aires': [
      'Únete a una limpieza de playas o parques en tu ciudad',
      'Haz voluntariado en una ONG de justicia social judía',
      'Participa en un jardín comunitario del barrio',
      'Apoya una campaña de derechos humanos en Argentina',
      'Promueve el reciclaje en tu comunidad',
    ],
    'London': [
      'Join a Thames or canal cleanup with the Canal & River Trust',
      'Volunteer with World Jewish Relief or Tzelem',
      'Help at a food redistribution project in your neighbourhood',
      'Advocate for climate justice through a Jewish environmental group',
      'Participate in a community garden or tree-planting initiative',
    ],
    'Moscow': [
      'Присоединись к уборке парка или набережной',
      'Стань волонтёром в еврейской социальной организации',
      'Участвуй в озеленении своего района',
      'Поддержи правозащитную инициативу',
      'Помоги наладить переработку отходов в своём доме',
    ],
  },
  gmilut: {
    'ישראל': [
      'הלווה כסף לחבר שצריך — ללא ריבית',
      'עזור לחבר לעבור דירה ללא תמורה',
      'הקדש זמן להקשיב לאדם שצריך לדבר',
      'ליווה מישהו לרופא שמפחד ללכת לבד',
      'עשה טובה אנונימית שהמקבל לא יידע ממי',
    ],
    'New York': [
      'Help a friend move apartments with no expectation of return',
      'Lend money interest-free to someone who needs it',
      'Sit with someone who needs to be heard — phone off, full attention',
      "Anonymously pay for a stranger's coffee or meal",
      'Give up your seat, your parking spot, or your place in line for someone',
    ],
    'Paris': [
      "Aide un ami à déménager sans attendre de retour",
      "Prête de l'argent à quelqu'un dans le besoin sans intérêts",
      "Écoute vraiment quelqu'un qui a besoin de parler",
      "Paye anonymement le café ou le repas de quelqu'un",
      "Cède ta place à quelqu'un qui en a plus besoin",
    ],
    'Buenos Aires': [
      'Ayuda a un amigo a mudarse sin esperar nada a cambio',
      'Presta dinero a alguien que lo necesita sin cobrar intereses',
      'Escucha a alguien que necesita hablar sin interrumpir',
      'Paga el café o la comida de alguien anónimamente',
      'Cede tu lugar a alguien en una fila o transporte',
    ],
    'London': [
      'Help a friend move home with nothing asked in return',
      'Lend money interest-free to someone who needs it',
      'Listen fully to someone who needs to talk — no distractions',
      "Anonymously pay for a stranger's coffee or meal",
      'Give up your seat, your turn, or your parking spot for someone else',
    ],
    'Moscow': [
      'Помоги другу переехать, не ожидая ничего взамен',
      'Одолжи деньги тому, кому нужно, без процентов',
      'Выслушай человека, которому нужно выговориться',
      'Анонимно оплати кофе или обед незнакомцу',
      'Уступи своё место в очереди или транспорте',
    ],
  },
};

// Sun=gmilut Mon=tzedakah Tue=bikur Wed=orchim Thu=olam Fri=horim Sat=chesed
const DAILY_THEME_KEYS: MitzvahKey[] = ['gmilut', 'tzedakah', 'bikur', 'orchim', 'olam', 'horim', 'chesed'];
const todayMitzvahKey = DAILY_THEME_KEYS[new Date().getDay()];
const todayMitzvah = MITZVOT.find(m => m.key === todayMitzvahKey)!;

function getLitSet(): Set<number> {
  try {
    const raw = sessionStorage.getItem(LIT_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}
function addLit(id: number) {
  const s = getLitSet(); s.add(id);
  sessionStorage.setItem(LIT_KEY, JSON.stringify([...s]));
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
}
function getMitzvahByCategory(cat: string) {
  return MITZVOT.find(m => m.he === cat) ?? MITZVOT[0];
}

// --- PointsCard ---
function PointsCard({ name, points, streak }: { name: string; points: number; streak: number }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #1a1208 0%, #2a1f0e 50%, #1a1208 100%)',
        border: '1px solid rgba(212,175,55,0.35)',
        minHeight: 140,
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-7xl opacity-[0.05] select-none pointer-events-none" aria-hidden="true">✡️</div>

      <div className="relative z-10 p-4 flex flex-col justify-between" style={{ minHeight: 140 }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: '#d4af37' }}>Universal Good</p>
            <p className="text-[9px] text-slate-500 tracking-widest">Kotel Points Card</p>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ background: streak >= 3 ? 'rgba(251,191,36,0.2)' : 'rgba(212,175,55,0.1)', color: streak >= 3 ? '#fbbf24' : '#d4af37', border: `1px solid ${streak >= 3 ? 'rgba(251,191,36,0.4)' : 'rgba(212,175,55,0.2)'}` }}>
              <Zap className="h-2.5 w-2.5" aria-hidden="true" />
              {streak} day streak{streak >= 3 ? ' +bonus' : ''}
            </div>
          )}
        </div>

        <div>
          <p className="text-white text-base font-bold truncate" dir="rtl">{name || 'שמך כאן'}</p>
          <p className="text-slate-500 text-[10px]">{name ? 'UG Member' : 'Enter your name to track points'}</p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-slate-500 mb-0.5">נקודות UG</p>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4" style={{ color: '#d4af37' }} fill="#d4af37" aria-hidden="true" />
              <span className="text-2xl font-black text-white">{points}</span>
            </div>
          </div>
          <div className="text-right text-[9px] text-slate-600 space-y-0.5">
            <p>📜 note placed = +1</p>
            <p>🕯️ candle received = +1</p>
            <p style={{ color: todayMitzvah.color }}>★ challenge = +2</p>
            <p style={{ color: '#fbbf24' }}>⚡ 3-day streak = +1</p>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />
    </div>
  );
}

// --- MitzvaLeaf ---
function MitzvaLeaf({ mitzvah, isActive, isToday, onClick }: {
  mitzvah: typeof MITZVOT[number];
  isActive: boolean;
  isToday: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      aria-pressed={isActive}
      aria-label={`${mitzvah.he} — ${mitzvah.en}`}
      className="relative flex flex-col items-center justify-center py-3 px-1 text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      style={{
        borderRadius: '50% 15% 50% 15% / 15% 50% 15% 50%',
        background: isActive
          ? `linear-gradient(135deg, ${mitzvah.color}ee, ${mitzvah.color}99)`
          : mitzvah.bg,
        border: isActive
          ? `2px solid ${mitzvah.color}`
          : isToday
            ? `2px dashed ${mitzvah.color}88`
            : `2px solid transparent`,
        boxShadow: isActive ? `0 4px 18px ${mitzvah.color}55` : 'none',
        minHeight: 78,
      }}
    >
      {isToday && (
        <span className="absolute top-1 right-1 text-[8px] font-black"
          style={{ color: isActive ? '#fff' : mitzvah.color }}>
          ★+2
        </span>
      )}
      <span className="text-lg leading-none mb-0.5">{mitzvah.emoji}</span>
      <span className="text-[10px] font-black leading-tight"
        style={{ color: isActive ? '#fff' : mitzvah.color }}
        dir="rtl">
        {mitzvah.he}
      </span>
      <span className="text-[8px] mt-0.5 leading-tight text-center"
        style={{ color: isActive ? 'rgba(255,255,255,0.75)' : mitzvah.color + 'bb' }}>
        {mitzvah.en}
      </span>
    </motion.button>
  );
}

// --- DeedSuggestions ---
function DeedSuggestions({ mitzvahKey, city, onSelect }: {
  mitzvahKey: MitzvahKey;
  city: string;
  onSelect: (deed: string) => void;
}) {
  const deeds = DEED_CATALOG[mitzvahKey]?.[city] ?? DEED_CATALOG[mitzvahKey]?.['New York'] ?? [];
  const mitzvah = MITZVOT.find(m => m.key === mitzvahKey)!;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="pt-2">
        <p className="text-[10px] font-semibold text-stone-500 mb-1.5" dir="rtl">
          רעיונות למעשה — {city}:
        </p>
        <div className="space-y-1">
          {deeds.map((deed, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => onSelect(deed)}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="w-full text-right px-3 py-2 rounded-lg text-xs text-stone-700 hover:text-stone-900 transition-all hover:shadow-sm"
              style={{
                background: 'rgba(255,255,255,0.75)',
                border: `1px solid ${mitzvah.color}33`,
              }}
              dir="auto"
            >
              <span style={{ color: mitzvah.color }} aria-hidden="true">→ </span>
              {deed}
            </motion.button>
          ))}
          <button
            type="button"
            onClick={() => onSelect('')}
            className="w-full text-center px-3 py-1.5 rounded-lg text-[10px] text-stone-400 hover:text-stone-600 transition-all"
            style={{ background: 'rgba(255,255,255,0.4)', border: '1px dashed #d6d3d1' }}
          >
            ✏️ כתוב בקשה משלך
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// --- NoteStone ---
function NoteStone({ wish, lit, onLight }: { wish: Wish; lit: boolean; onLight: () => void }) {
  const [open, setOpen] = useState(false);
  const mitzvah = getMitzvahByCategory(wish.category);
  const isToday = wish.category === todayMitzvah.he;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative cursor-pointer select-none rounded-sm overflow-hidden"
        style={{
          background: isToday
            ? 'linear-gradient(135deg, rgba(212,175,55,0.22), rgba(180,140,30,0.12))'
            : 'linear-gradient(135deg, #3d3530, #2e2520)',
          border: isToday ? '1px solid rgba(212,175,55,0.45)' : '1px solid rgba(255,255,255,0.05)',
          minHeight: 72,
          padding: '8px 10px',
        }}
        onClick={() => setOpen(true)}
      >
        {isToday && <div className="absolute top-1 right-1 text-[8px] font-bold" style={{ color: '#d4af37' }}>★</div>}
        <div className="text-base mb-1">{mitzvah.emoji}</div>
        <p className="text-[10px] font-semibold text-white/80 truncate">{wish.name}</p>
        <p className="text-[9px] text-white/35">{wish.city}</p>
        {wish.placeName && (
          <p className="text-[8px] mt-0.5 truncate" style={{ color: mitzvah.color + 'cc' }}>
            🏛 {wish.placeName}
          </p>
        )}
        <div className="flex items-center justify-between mt-1">
          {wish.candles > 0 && (
            <div className="flex items-center gap-0.5">
              <Flame className="h-2.5 w-2.5 text-amber-400" fill="currentColor" />
              <span className="text-[9px] text-amber-400">{wish.candles}</span>
            </div>
          )}
          {wish.points > 0 && (
            <div className="flex items-center gap-0.5 ml-auto">
              <Star className="h-2 w-2" style={{ color: '#d4af37' }} fill="#d4af37" />
              <span className="text-[8px]" style={{ color: '#d4af37' }}>{wish.points}</span>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 w-3 h-3" style={{ background: 'rgba(255,255,255,0.03)', clipPath: 'polygon(0 0,0 100%,100% 100%)' }} />
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
            <motion.div
              className="relative z-10 max-w-sm w-full rounded-2xl p-6 shadow-2xl"
              style={{ background: 'linear-gradient(135deg,#fef9e7,#fdf3cd)', border: '1px solid rgba(212,175,55,0.5)' }}
              initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }}
              onClick={e => e.stopPropagation()}
              dir="rtl"
            >
              <button className="absolute top-3 left-3 text-stone-400 hover:text-stone-600" onClick={() => setOpen(false)} aria-label="סגור">
                <X className="h-4 w-4" />
              </button>

              <div className="text-center mb-4">
                <div className="text-3xl mb-1">{mitzvah.emoji}</div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: mitzvah.color + '22', color: mitzvah.color }}>
                  {mitzvah.he}
                </span>
                <span className="mr-2 text-[10px] text-stone-400"> — {mitzvah.en}</span>
                {isToday && <span className="block text-[10px] font-bold text-amber-600 mt-1">★ אתגר היום</span>}
              </div>

              <p className="text-stone-800 text-sm leading-relaxed text-center mb-3 font-medium" style={{ fontFamily: 'serif' }}>
                "{wish.wish}"
              </p>

              {wish.forWhom && (
                <p className="text-center text-xs text-stone-500 mb-3">עבור: <span className="font-semibold">{wish.forWhom}</span></p>
              )}
              {wish.placeName && (
                <p className="text-center text-xs mb-3" style={{ color: mitzvah.color }}>
                  🏛️ <span className="font-semibold">{wish.placeName}</span>
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-stone-400 mb-4">
                <span>{wish.name} · {wish.city}</span>
                <span>{formatDate(wish.createdAt)}</span>
              </div>

              <div className="flex items-center justify-center gap-4 mb-4 text-xs">
                <span className="flex items-center gap-1 text-amber-600">
                  <Flame className="h-3 w-3" fill="currentColor" /> {wish.candles} נרות
                </span>
                <span className="flex items-center gap-1" style={{ color: '#d4af37' }}>
                  <Star className="h-3 w-3" fill="currentColor" /> {wish.points} נקודות
                </span>
              </div>

              <button
                onClick={() => { onLight(); setOpen(false); }}
                disabled={lit}
                className="w-full rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={lit
                  ? { background: 'rgba(251,191,36,0.15)', color: '#d97706', cursor: 'default' }
                  : { background: 'linear-gradient(135deg,#b8860b,#d4af37)', color: '#000' }
                }
              >
                <Flame className="h-4 w-4" fill={lit ? 'currentColor' : 'none'} />
                {lit ? '🕯️ הדלקת נר' : 'הדלק נר 🕯️ (+1 נקודה לכותב)'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const rankColor = (i: number) => i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : undefined;

export default function KotelWall() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [litIds, setLitIds] = useState<Set<number>>(new Set());
  const [myStreak, setMyStreak] = useState(0);

  const [name, setName] = useState('');
  const [city, setCity] = useState(CITIES[0]);
  const [wish, setWish] = useState('');
  const [selectedLeaf, setSelectedLeaf] = useState<MitzvahKey | null>(null);
  const [category, setCategory] = useState(MITZVOT[0].he);
  const [forWhom, setForWhom] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const { toast } = useToast();

  const fetchWishes = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/wishes`);
      if (!res.ok) throw new Error();
      setWishes(await res.json());
      setError(null);
    } catch {
      setError('לא ניתן לטעון את הכותל כרגע.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishes();
    setLitIds(getLitSet());
  }, [fetchWishes]);

  useEffect(() => {
    if (!name.trim()) { setMyStreak(0); return; }
    fetch(`${API_BASE}/wishes/streak?name=${encodeURIComponent(name.trim())}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setMyStreak(d.streak ?? 0))
      .catch(() => {});
  }, [name]);

  const handleLeafSelect = (key: MitzvahKey) => {
    if (selectedLeaf === key) {
      setSelectedLeaf(null);
      setPlaces([]);
      setSelectedPlace(null);
    } else {
      setSelectedLeaf(key);
      const m = MITZVOT.find(m => m.key === key)!;
      setCategory(m.he);
      setSelectedPlace(null);
      getPlaces(city, key).then(setPlaces).catch(() => setPlaces([]));
    }
  };

  useEffect(() => {
    if (!selectedLeaf) return;
    setSelectedPlace(null);
    getPlaces(city, selectedLeaf).then(setPlaces).catch(() => setPlaces([]));
  }, [city, selectedLeaf]);

  const togglePlace = (place: Place) => {
    setSelectedPlace(prev => prev?.id === place.id ? null : place);
  };

  const handleDeedSelect = (deed: string) => {
    setWish(deed);
    if (deed) {
      const el = document.getElementById('wish-textarea');
      el?.focus();
    }
  };

  const myPoints = wishes.filter(w => w.name === name.trim()).reduce((sum, w) => sum + (w.points ?? 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !wish.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/wishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), city, wish: wish.trim(), category, forWhom: forWhom.trim() || undefined, placeName: selectedPlace?.name || undefined }),
      });
      if (!res.ok) throw new Error();
      const result: PlaceResult = await res.json();
      setWishes(prev => [result.wish, ...prev]);
      setMyStreak(result.streak);
      setWish('');
      setForWhom('');
      setSelectedLeaf(null);
      setSelectedPlace(null);
      setPlaces([]);
      setShowForm(false);

      const breakdown: string[] = ['📜 note placed +1'];
      if (result.isChallenge) breakdown.push(`★ challenge bonus +2`);
      if (result.streakBonus) breakdown.push(`⚡ streak bonus +1`);

      toast({
        title: `🕊️ +${result.pointsAwarded} נקודות!`,
        description: breakdown.join('  ·  '),
      });
    } catch {
      toast({ title: 'שגיאה', description: 'לא ניתן לשלוח כרגע.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLight = async (id: number) => {
    if (litIds.has(id)) return;
    try {
      const res = await fetch(`${API_BASE}/wishes/${id}/light`, { method: 'POST' });
      if (!res.ok) throw new Error();
      const updated: Wish = await res.json();
      setWishes(prev => prev.map(w => w.id === id ? updated : w));
      addLit(id);
      setLitIds(getLitSet());
      toast({ title: '🕯️ נר הודלק!', description: 'הכותב קיבל +1 נקודה.' });
    } catch {
      toast({ title: 'שגיאה', description: 'לא ניתן להדליק נר כרגע.', variant: 'destructive' });
    }
  };

  const leaderboard = Object.values(
    wishes.reduce<Record<string, { name: string; city: string; points: number; candles: number }>>((acc, w) => {
      if (!acc[w.name]) acc[w.name] = { name: w.name, city: w.city, points: 0, candles: 0 };
      acc[w.name].points += w.points ?? 0;
      acc[w.name].candles += w.candles;
      return acc;
    }, {})
  ).sort((a, b) => b.points - a.points).slice(0, 5);

  const totalCandles = wishes.reduce((s, w) => s + w.candles, 0);
  const totalPoints = wishes.reduce((s, w) => s + (w.points ?? 0), 0);

  const isChallenge = category === todayMitzvah.he;
  const willGetStreakBonus = myStreak >= 2;
  const previewPoints = 1 + (isChallenge ? 2 : 0) + (willGetStreakBonus ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0e0b08' }}>
      <Navigation />
      <Helmet>
        <title>הכותל הדיגיטלי | ConsolTech</title>
        <meta name="description" content="הדביק פתק בכותל הדיגיטלי — בחר מצווה, שתף בקשה, הדלק נר לאחרים, צבר נקודות UG" />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-24 pb-10 px-4 text-center overflow-hidden" aria-labelledby="kotel-heading">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg,#0a1628 0%,#1a0e05 60%,#0e0b08 100%)' }} />
        <div className="absolute top-8 right-16 w-10 h-10 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle at 35% 35%,#fff9e6,#e8d88a)', boxShadow: '0 0 30px rgba(232,216,138,0.35)' }} aria-hidden="true" />
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none" aria-hidden="true"
            style={{ width: 2, height: 2, background: '#fff', opacity: 0.3 + (i % 3) * 0.2, top: `${8 + (i * 17) % 40}%`, left: `${5 + (i * 23) % 90}%` }} />
        ))}

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-5xl mb-3" aria-hidden="true">🕊️</div>
          <h1 id="kotel-heading" className="text-3xl md:text-5xl font-black mb-2" style={{ color: '#f5e6c8', fontFamily: 'serif' }}>
            הכותל הדיגיטלי
          </h1>
          <p className="text-amber-200/60 text-base mb-1">The Digital Kotel — Jerusalem</p>
          <p className="text-amber-100/35 text-xs max-w-sm mx-auto">בחר מצווה, התחייב למעשה טוב, הדבק פתק, צבר נקודות UG</p>

          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-bold"
            style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)', color: '#d4af37' }}>
            <span>{todayMitzvah.emoji}</span>
            <span>אתגר היום: {todayMitzvah.he}</span>
            <span className="text-[10px] opacity-60">+2 נקודות</span>
          </div>

          <div className="flex items-center justify-center gap-6 mt-5 text-xs text-amber-200/45">
            <span><ScrollText className="h-3 w-3 inline mr-1" />{wishes.length} פתקים</span>
            <span><Flame className="h-3 w-3 inline mr-1" />{totalCandles} נרות</span>
            <span><Star className="h-3 w-3 inline mr-1" />{totalPoints} נקודות</span>
          </div>
        </div>
      </section>

      {/* Place note button */}
      <div className="flex justify-center pb-6 px-4">
        <Button onClick={() => setShowForm(v => !v)}
          className="rounded-full px-8 py-3 text-base font-bold shadow-lg"
          style={{ background: 'linear-gradient(135deg,#b8860b,#d4af37)', color: '#1a0e05' }}>
          {showForm ? 'סגור' : '📜 הדבק פתק בכותל'}
        </Button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-4 pb-6">
            <div className="max-w-lg mx-auto rounded-2xl p-6"
              style={{ background: 'linear-gradient(135deg,#fef9e7,#fdf3cd)', border: '1px solid rgba(212,175,55,0.4)' }}>
              <h2 className="text-base font-bold text-stone-800 mb-4 text-center" style={{ fontFamily: 'serif' }}>📜 כתוב את פתקך</h2>
              <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">

                {/* Name + City */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-600 mb-1 block">שמך</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="הכנס שם" maxLength={50} required
                      className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-600 mb-1 block">עיר</label>
                    <select value={city} onChange={e => setCity(e.target.value)}
                      className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400">
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Mitzvah leaf picker */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-stone-600">🌳 עץ המצוות — בחר מצווה</p>
                    {selectedLeaf && (
                      <button type="button" onClick={() => setSelectedLeaf(null)}
                        className="text-[10px] text-stone-400 hover:text-stone-600 transition-colors">
                        נקה בחירה ×
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {MITZVOT.map(m => (
                      <MitzvaLeaf
                        key={m.key}
                        mitzvah={m}
                        isActive={selectedLeaf === m.key}
                        isToday={m.key === todayMitzvahKey}
                        onClick={() => handleLeafSelect(m.key as MitzvahKey)}
                      />
                    ))}
                  </div>

                  {/* Deed suggestions */}
                  <AnimatePresence>
                    {selectedLeaf && (
                      <DeedSuggestions
                        mitzvahKey={selectedLeaf}
                        city={city}
                        onSelect={handleDeedSelect}
                      />
                    )}
                  </AnimatePresence>

                  {/* Official places */}
                  <AnimatePresence>
                    {selectedLeaf && places.length > 0 && (() => {
                      const m = MITZVOT.find(x => x.key === selectedLeaf)!;
                      return (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden pt-3"
                        >
                          <p className="text-[10px] font-semibold text-stone-500 mb-1.5 flex items-center gap-1" dir="rtl">
                            <MapPin className="h-3 w-3" /> מקומות רשמיים — {city}:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {places.map(p => (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => togglePlace(p)}
                                className="rounded-full px-3 py-1 text-xs font-medium transition-all"
                                style={selectedPlace?.id === p.id
                                  ? { background: m.color + '22', color: m.color, border: `1px solid ${m.color}` }
                                  : { background: 'rgba(255,255,255,0.6)', color: '#78716c', border: '1px solid #e7e5e4' }
                                }
                              >
                                🏛️ {p.name}
                              </button>
                            ))}
                          </div>
                          {selectedPlace && (
                            <p className="text-[10px] text-stone-400 mt-1.5" dir="rtl">
                              הפתק שלך יתויג עם <span className="font-semibold text-stone-600">{selectedPlace.name}</span>
                            </p>
                          )}
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>
                </div>

                {/* Wish textarea */}
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1 block">
                    {selectedLeaf ? 'התחייבותך / בקשתך' : 'בקשתך / תפילתך'}
                  </label>
                  <textarea
                    id="wish-textarea"
                    value={wish}
                    onChange={e => setWish(e.target.value)}
                    placeholder={selectedLeaf ? 'נבחר מעשה, או כתוב בקשה משלך...' : 'כתוב את בקשתך כאן...'}
                    maxLength={280}
                    rows={3}
                    required
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    dir="auto"
                  />
                  <p className="text-xs text-stone-400 text-left mt-0.5">{wish.length}/280</p>
                </div>

                {/* For whom */}
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1 block">עבור מי? (אופציונלי)</label>
                  <input type="text" value={forWhom} onChange={e => setForWhom(e.target.value)} placeholder="עבור המשפחה שלי, עבור ישראל..." maxLength={80}
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>

                {/* Points preview */}
                <div className="rounded-lg p-3 text-xs space-y-1" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <p className="font-semibold text-stone-600 mb-1">נקודות שתקבל:</p>
                  <p className="text-stone-500">📜 הנחת פתק <span className="font-bold text-stone-700">+1</span></p>
                  {isChallenge && (
                    <p style={{ color: todayMitzvah.color }}>
                      ★ אתגר היום ({todayMitzvah.he}) <span className="font-bold">+2</span>
                    </p>
                  )}
                  {willGetStreakBonus && (
                    <p className="text-amber-600">⚡ streak יום {myStreak + 1} <span className="font-bold">+1</span></p>
                  )}
                  {myStreak === 1 && (
                    <p className="text-stone-400">⚡ streak יום 2 — עוד יום אחד לבונוס</p>
                  )}
                  <p className="font-bold text-stone-700 pt-1 border-t border-stone-200">
                    סה״כ: +{previewPoints} נקודות
                  </p>
                </div>

                <Button type="submit" disabled={submitting || !name.trim() || !wish.trim()}
                  className="w-full font-bold rounded-xl" style={{ background: 'linear-gradient(135deg,#b8860b,#d4af37)', color: '#1a0e05' }}>
                  {submitting ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Send className="h-4 w-4 ml-2" />}
                  הדבק את הפתק בכותל 🕊️
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content" className="flex-1 px-4 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Wall */}
          <div className="lg:col-span-3 space-y-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500/50">הכרטיס שלי</p>
              <PointsCard name={name} points={myPoints} streak={myStreak} />
            </div>

            <div className="rounded-2xl overflow-hidden p-4" style={{ background: 'linear-gradient(180deg,#2a1f15 0%,#1e1510 100%)', border: '1px solid rgba(212,175,55,0.08)' }}>
              <p className="text-center text-[10px] text-amber-200/25 mb-3 tracking-wider">לחץ על אבן לקרוא את הפתק</p>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <p className="text-amber-200/50 text-sm">{error}</p>
                  <button onClick={fetchWishes} className="mt-3 text-xs text-amber-500 underline">נסה שוב</button>
                </div>
              ) : wishes.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-4xl mb-3">📜</div>
                  <p className="text-amber-200/50 text-sm">הכותל מחכה לפתק הראשון שלך</p>
                </div>
              ) : (
                <motion.div layout className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))' }}>
                  {wishes.map(w => (
                    <NoteStone key={w.id} wish={w} lit={litIds.has(w.id)} onLight={() => handleLight(w.id)} />
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Leaderboard */}
            <div className="rounded-2xl p-4" style={{ background: '#1a1208', border: '1px solid rgba(212,175,55,0.12)' }}>
              <h2 className="text-sm font-bold flex items-center gap-2 mb-3" style={{ color: '#d4af37' }}>
                <Trophy className="h-4 w-4" />
                לוח מובילים
              </h2>
              {leaderboard.length === 0
                ? <p className="text-xs text-amber-200/30 text-center py-4">אין עדיין נקודות</p>
                : <ol className="space-y-2" dir="rtl">
                  {leaderboard.map((u, i) => (
                    <li key={u.name} className="flex items-center gap-2">
                      <span className="text-xs font-black w-4 text-center" style={{ color: rankColor(i) }}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-amber-100/80 truncate">{u.name}</p>
                        <p className="text-[9px] text-amber-200/35">{u.city}</p>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <div className="flex items-center gap-0.5 text-[10px] font-bold" style={{ color: '#d4af37' }}>
                          <Star className="h-2.5 w-2.5" fill="currentColor" /> {u.points}
                        </div>
                        <div className="flex items-center gap-0.5 text-[9px] text-amber-400/60">
                          <Flame className="h-2 w-2" fill="currentColor" /> {u.candles}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              }
            </div>

            {/* Today's challenge */}
            <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)' }}>
              <div className="text-2xl mb-1">{todayMitzvah.emoji}</div>
              <p className="text-[10px] font-bold text-amber-400 mb-0.5">אתגר היום</p>
              <p className="text-lg font-black" style={{ color: '#f5e6c8' }}>{todayMitzvah.he}</p>
              <p className="text-[10px] text-amber-200/35">{todayMitzvah.en}</p>
              <p className="text-[10px] text-amber-300/55 mt-2">כתוב פתק בנושא זה וקבל <span className="font-bold">+2 נקודות</span></p>
            </div>

            {/* Points legend */}
            <div className="rounded-2xl p-4" style={{ background: '#1a1208', border: '1px solid rgba(212,175,55,0.12)' }}>
              <h2 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#d4af37' }}>איך מרוויחים נקודות</h2>
              <div className="space-y-2 text-[10px] text-amber-200/55">
                <div className="flex justify-between"><span>📜 הנחת פתק</span><span className="font-bold text-amber-300">+1</span></div>
                <div className="flex justify-between"><span>🕯️ מישהו הדליק נר</span><span className="font-bold text-amber-300">+1</span></div>
                <div className="flex justify-between"><span style={{ color: todayMitzvah.color }}>★ אתגר היום</span><span className="font-bold text-amber-300">+2</span></div>
                <div className="flex justify-between"><span className="text-yellow-400/70">⚡ streak של 3 ימים</span><span className="font-bold text-amber-300">+1</span></div>
              </div>
            </div>

            {/* Mitzvot reference */}
            <div className="rounded-2xl p-4" style={{ background: '#1a1208', border: '1px solid rgba(212,175,55,0.12)' }}>
              <h2 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#d4af37' }}>🌳 עץ המצוות</h2>
              <div className="space-y-1.5">
                {MITZVOT.map(m => (
                  <div key={m.key} className="flex items-center gap-2 text-[10px]">
                    <span>{m.emoji}</span>
                    <span style={{ color: m.color }} className="font-semibold">{m.he}</span>
                    <span className="text-amber-200/30 text-[9px]">{m.en}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cities */}
            <div className="rounded-2xl p-4" style={{ background: '#1a1208', border: '1px solid rgba(212,175,55,0.12)' }}>
              <h2 className="text-sm font-bold flex items-center gap-2 mb-3" style={{ color: '#d4af37' }}>
                <Globe className="h-4 w-4" /> קהילה עולמית
              </h2>
              <div className="space-y-1.5">
                {CITIES.map(c => {
                  const count = wishes.filter(w => w.city === c).length;
                  return (
                    <div key={c} className="flex items-center justify-between text-[10px]">
                      <span className="text-amber-200/50">{c}</span>
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 rounded-full bg-amber-500/25" style={{ width: Math.max(4, count * 7) }} />
                        <span className="text-amber-200/35 w-4 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
