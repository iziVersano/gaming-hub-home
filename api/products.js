// Same catalog as FALLBACK_PRODUCTS / FALLBACK_PRODUCTS_HE in src/lib/api.ts; images live in public/images.
const SEED = [
  { id: 8, price: 499.99, imageUrl: '/images/m3w.png', translations: {
    en: { title: 'Meta Quest 3', description: 'Next-generation VR headset with breakthrough mixed reality, powerful performance, and an expanding library of immersive experiences.', category: 'New Arrivals' },
    he: { title: 'Meta Quest 3', description: 'משקפי VR מהדור הבא עם מציאות מעורבת פורצת דרך, ביצועים חזקים וספרייה מתרחבת של חוויות סוחפות.', category: 'חדשים במלאי' } } },
  { id: 9, price: 1799.99, imageUrl: '/images/asus-new.png', translations: {
    en: { title: 'ASUS ROG Gaming Laptop', description: 'Ultimate gaming performance with cutting-edge graphics, high-refresh display, and advanced cooling technology for serious gamers.', category: 'New Arrivals' },
    he: { title: 'מחשב גיימינג ASUS ROG', description: 'ביצועי גיימינג מושלמים עם גרפיקה מתקדמת, מסך בקצב רענון גבוה וטכנולוגיית קירור מתקדמת לגיימרים רציניים.', category: 'חדשים במלאי' } } },
  { id: 10, price: 449.99, imageUrl: '/images/nin2.jpeg', translations: {
    en: { title: 'Nintendo Switch 2', description: 'The next generation of Nintendo gaming. Experience enhanced graphics, faster performance, and an expanded game library.', category: 'New Arrivals' },
    he: { title: 'Nintendo Switch 2', description: 'הדור הבא של משחקי Nintendo. חוו גרפיקה משופרת, ביצועים מהירים יותר וספריית משחקים מורחבת.', category: 'חדשים במלאי' } } },
  { id: 11, price: 599.99, imageUrl: '/images/xbox-series-x-galaxy.png', translations: {
    en: { title: 'Xbox Series X – Galaxy Black 2TB', description: 'The most powerful Xbox ever with 2TB storage, Galaxy Black special edition finish, and next-gen gaming performance.', category: 'New Arrivals' },
    he: { title: 'Xbox Series X – Galaxy Black 2TB', description: 'ה-Xbox החזק ביותר אי פעם עם 2TB אחסון, מהדורת Galaxy Black מיוחדת וביצועי גיימינג מהדור הבא.', category: 'חדשים במלאי' } } },
  { id: 3, price: 1299.99, imageUrl: '/images/07ba8bc0-8d14-4d62-a534-659913ac5f99.png', translations: {
    en: { title: 'Professional Drones', description: 'High-performance drones for commercial photography, surveying, and recreational flying with advanced stabilization.', category: 'Drones' },
    he: { title: 'רחפנים מקצועיים', description: 'רחפנים בעלי ביצועים גבוהים לצילום מסחרי, סקרים וטיסה פנאית עם ייצוב מתקדם.', category: 'רחפנים' } } },
  { id: 4, price: 1899.99, imageUrl: '/images/a0bd3ab6-05d5-4312-b6ec-f0e256d7a63a.png', translations: {
    en: { title: 'Smart E-Bikes', description: 'Electric bikes with smart connectivity, long-range batteries, and advanced motor systems for urban mobility.', category: 'E-Bikes' },
    he: { title: 'אופניים חשמליים חכמים', description: 'אופניים חשמליים עם קישוריות חכמה, סוללות טווח ארוך ומערכות מנוע מתקדמות לניידות עירונית.', category: 'אופניים חשמליים' } } },
  { id: 5, price: 799.99, imageUrl: '/images/6df37998-af04-426e-b749-365ffeb66787.png', translations: {
    en: { title: '4K Smart TVs', description: 'Ultra-high definition smart TVs with AI upscaling, HDR support, and built-in streaming platforms.', category: 'TVs' },
    he: { title: 'טלוויזיות חכמות 4K', description: 'טלוויזיות חכמות באיכות Ultra HD עם שדרוג AI, תמיכת HDR ופלטפורמות סטרימינג מובנות.', category: 'טלוויזיות' } } },
  { id: 6, price: 149.99, imageUrl: '/images/bd80e124-a5e2-4d34-9c82-ebc0dbd6a697.png', translations: {
    en: { title: 'Gaming Accessories', description: 'Premium gaming peripherals including controllers, headsets, and racing wheels from top brands.', category: 'Gaming' },
    he: { title: 'אביזרי גיימינג', description: 'אביזרי גיימינג פרימיום כולל בקרים, אוזניות והגאים ממותגים מובילים.', category: 'גיימינג' } } },
  { id: 7, price: 299.99, imageUrl: '/images/6df37998-af04-426e-b749-365ffeb66787.png', translations: {
    en: { title: 'Smart Home Electronics', description: 'Connected home devices including smart speakers, security cameras, and automation systems.', category: 'Electronics' },
    he: { title: 'אלקטרוניקה לבית חכם', description: 'מכשירים מחוברים לבית כולל רמקולים חכמים, מצלמות אבטחה ומערכות אוטומציה.', category: 'אלקטרוניקה' } } },
];

// The frontend expects flat title/description/category in the requested language.
const localize = (p, lang) => {
  if (!p.translations) return p;
  const { translations, ...rest } = p;
  return { ...rest, ...(translations[lang] || translations.en) };
};

let products = [...SEED];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const lang = req.query.lang === 'he' ? 'he' : 'en';

  if (req.method === 'GET') {
    if (id) {
      const p = products.find(x => String(x.id) === String(id));
      return res.status(p ? 200 : 404).json(p ? localize(p, lang) : { error: 'Not found' });
    }
    return res.status(200).json(products.map(p => localize(p, lang)));
  }

  if (req.method === 'POST') {
    const newProduct = { id: `prod_${Date.now()}`, ...req.body };
    products.push(newProduct);
    return res.status(201).json(newProduct);
  }

  if (req.method === 'PUT' && id) {
    const i = products.findIndex(x => String(x.id) === String(id));
    if (i === -1) return res.status(404).json({ error: 'Not found' });
    products[i] = { ...products[i], ...req.body, id: products[i].id };
    return res.status(200).json(products[i]);
  }

  if (req.method === 'DELETE' && id) {
    const before = products.length;
    products = products.filter(x => String(x.id) !== String(id));
    if (products.length === before) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
