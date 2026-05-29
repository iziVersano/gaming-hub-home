const SEED = [
  { id: 'ns2', sku: 'NS2-001', price: 299, imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c3ca4b786?w=400', flags: ['new'], translations: [{ locale: 'en', title: 'Nintendo Switch 2', description: 'Next generation gaming console', category: 'Gaming Consoles', badges: ['Latest', 'Popular'] }, { locale: 'he', title: 'Nintendo Switch 2', description: 'קונסולת משחקים לדור הבא', category: 'קונסולות משחקים', badges: ['חדש', 'פופולרי'] }] },
  { id: 'ps5', sku: 'PS5-001', price: 499, imageUrl: 'https://images.unsplash.com/photo-1606841837239-c5a1a8a07af7?w=400', flags: [], translations: [{ locale: 'en', title: 'PlayStation 5', description: 'Sony\'s flagship gaming console', category: 'Gaming Consoles', badges: ['Best Seller'] }, { locale: 'he', title: 'PlayStation 5', description: 'קונסולת הדגל של סוני', category: 'קונסולות משחקים', badges: ['מבחר הקונים'] }] },
  { id: 'xsx', sku: 'XSX-001', price: 499, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', flags: [], translations: [{ locale: 'en', title: 'Xbox Series X', description: 'Microsoft\'s next-gen console', category: 'Gaming Consoles', badges: ['Powerful'] }, { locale: 'he', title: 'Xbox Series X', description: 'קונסולת הדור הבא של מיקרוסופט', category: 'קונסולות משחקים', badges: ['חזק'] }] },
  { id: 'dji-mini', sku: 'DJI-MINI-001', price: 249, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', flags: [], translations: [{ locale: 'en', title: 'DJI Mini Drone', description: 'Portable drone for enthusiasts', category: 'Drones', badges: ['Portable'] }, { locale: 'he', title: 'DJI Mini Drone', description: 'דרון נייד לחובבים', category: 'דרונים', badges: ['נייד'] }] },
  { id: 'ebike', sku: 'EBIKE-001', price: 1299, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', flags: [], translations: [{ locale: 'en', title: 'Electric Bike', description: 'High-performance electric bike', category: 'E-Bikes', badges: ['Eco-Friendly'] }, { locale: 'he', title: 'אופניים חשמליים', description: 'אופניים חשמליים בעלי ביצועים גבוהים', category: 'אופניים חשמליים', badges: ['ידידותי לסביבה'] }] },
  { id: 'tv-4k', sku: 'TV-4K-001', price: 799, imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400', flags: [], translations: [{ locale: 'en', title: '55" 4K Smart TV', description: 'Ultra HD smart television', category: 'Televisions', badges: ['4K', 'Smart'] }, { locale: 'he', title: 'טלוויזיה חכמה 4K 55"', description: 'טלוויזיה אולטרה HD חכמה', category: 'טלוויזיות', badges: ['4K', 'חכמה'] }] },
  { id: 'accessories', sku: 'ACC-001', price: 49, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', flags: [], translations: [{ locale: 'en', title: 'Gaming Accessories Bundle', description: 'Controller, headset, and cables', category: 'Accessories', badges: ['Bundle'] }, { locale: 'he', title: 'חבילת אביזרי משחקים', description: 'בקר, אוזניות וכבלים', category: 'אביזרים', badges: ['חבילה'] }] },
  { id: 'smart-home', sku: 'SH-001', price: 199, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', flags: [], translations: [{ locale: 'en', title: 'Smart Home Hub', description: 'Central control for smart devices', category: 'Smart Home', badges: ['Connected'] }, { locale: 'he', title: 'Hub הבית החכם', description: 'שליטה מרכזית במכשירים חכמים', category: 'בית חכם', badges: ['מחובר'] }] },
];

let products = [...SEED];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  if (req.method === 'GET') {
    if (id) {
      const p = products.find(x => x.id === id);
      return res.status(p ? 200 : 404).json(p || { error: 'Not found' });
    }
    return res.status(200).json(products);
  }

  if (req.method === 'POST') {
    const newProduct = { id: `prod_${Date.now()}`, ...req.body };
    products.push(newProduct);
    return res.status(201).json(newProduct);
  }

  if (req.method === 'PUT' && id) {
    const i = products.findIndex(x => x.id === id);
    if (i === -1) return res.status(404).json({ error: 'Not found' });
    products[i] = { ...products[i], ...req.body, id };
    return res.status(200).json(products[i]);
  }

  if (req.method === 'DELETE' && id) {
    const before = products.length;
    products = products.filter(x => x.id !== id);
    if (products.length === before) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
