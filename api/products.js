import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

const SEED = [
  { id: 'ns2', sku: 'NS2-001', price: 299, imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c3ca4b786?w=400', flags: ['new'], translations: [{ locale: 'en', title: 'Nintendo Switch 2', description: 'Next generation gaming console', category: 'Gaming Consoles', badges: ['Latest', 'Popular'] }, { locale: 'he', title: 'Nintendo Switch 2', description: 'קונסולת משחקים לדור הבא', category: 'קונסולות משחקים', badges: ['חדש', 'פופולרי'] }] },
];

function getProducts() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(SEED, null, 2));
    return SEED;
  }
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE));
}

function saveProducts(products) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

export default (req, res) => {
  const { id } = req.query;
  const products = getProducts();

  if (req.method === 'GET') {
    if (id) {
      const p = products.find(x => x.id === id);
      return res.json(p || { error: 'Not found' });
    }
    return res.json(products);
  }

  if (req.method === 'POST') {
    products.push({ id: `prod_${Date.now()}`, ...req.body });
    saveProducts(products);
    return res.status(201).json(products[products.length - 1]);
  }

  if (req.method === 'PUT' && id) {
    const i = products.findIndex(x => x.id === id);
    if (i === -1) return res.status(404).json({ error: 'Not found' });
    products[i] = { ...products[i], ...req.body, id };
    saveProducts(products);
    return res.json(products[i]);
  }

  if (req.method === 'DELETE' && id) {
    const filtered = products.filter(x => x.id !== id);
    if (filtered.length === products.length) return res.status(404).json({ error: 'Not found' });
    saveProducts(filtered);
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
