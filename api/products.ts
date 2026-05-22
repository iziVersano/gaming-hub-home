import { VercelRequest, VercelResponse } from '@vercel/node';
import { put, getDownloadUrl } from '@vercel/blob';

const PRODUCTS_BLOB_NAME = 'products.json';

interface ProductTranslation {
  locale: 'en' | 'he';
  title: string;
  description: string;
  category: string;
  badges: string[];
}

interface Product {
  id: string;
  sku: string;
  imageUrl: string;
  price: number;
  flags: string[];
  translations: ProductTranslation[];
}

const SEED_PRODUCTS: Product[] = [
  {
    id: 'ns2',
    sku: 'NS2-001',
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c3ca4b786?w=400',
    price: 299,
    flags: ['new'],
    translations: [
      {
        locale: 'en',
        title: 'Nintendo Switch 2',
        description: 'Next generation gaming console',
        category: 'Gaming Consoles',
        badges: ['Latest', 'Popular'],
      },
      {
        locale: 'he',
        title: 'Nintendo Switch 2',
        description: 'קונסולת משחקים לדור הבא',
        category: 'קונסולות משחקים',
        badges: ['חדש', 'פופולרי'],
      },
    ],
  },
  {
    id: 'ps5',
    sku: 'PS5-001',
    imageUrl: 'https://images.unsplash.com/photo-1606841837239-c5a1a8a07af7?w=400',
    price: 499,
    flags: [],
    translations: [
      {
        locale: 'en',
        title: 'PlayStation 5',
        description: 'Sony\'s flagship gaming console',
        category: 'Gaming Consoles',
        badges: ['Best Seller'],
      },
      {
        locale: 'he',
        title: 'PlayStation 5',
        description: 'קונסולת הדגל של סוני',
        category: 'קונסולות משחקים',
        badges: ['מבחר הקונים'],
      },
    ],
  },
  {
    id: 'xsx',
    sku: 'XSX-001',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
    price: 499,
    flags: [],
    translations: [
      {
        locale: 'en',
        title: 'Xbox Series X',
        description: 'Microsoft\'s next-gen console',
        category: 'Gaming Consoles',
        badges: ['Powerful'],
      },
      {
        locale: 'he',
        title: 'Xbox Series X',
        description: 'קונסולת הדור הבא של מיקרוסופט',
        category: 'קונסולות משחקים',
        badges: ['חזק'],
      },
    ],
  },
  {
    id: 'dji-mini',
    sku: 'DJI-MINI-001',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    price: 249,
    flags: [],
    translations: [
      {
        locale: 'en',
        title: 'DJI Mini Drone',
        description: 'Portable drone for enthusiasts',
        category: 'Drones',
        badges: ['Portable'],
      },
      {
        locale: 'he',
        title: 'DJI Mini Drone',
        description: 'דרון נייד לחובבים',
        category: 'דרונים',
        badges: ['נייד'],
      },
    ],
  },
  {
    id: 'ebike',
    sku: 'EBIKE-001',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    price: 1299,
    flags: [],
    translations: [
      {
        locale: 'en',
        title: 'Electric Bike',
        description: 'High-performance electric bike',
        category: 'E-Bikes',
        badges: ['Eco-Friendly'],
      },
      {
        locale: 'he',
        title: 'אופניים חשמליים',
        description: 'אופניים חשמליים בעלי ביצועים גבוהים',
        category: 'אופניים חשמליים',
        badges: ['ידידותי לסביבה'],
      },
    ],
  },
  {
    id: 'tv-4k',
    sku: 'TV-4K-001',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
    price: 799,
    flags: [],
    translations: [
      {
        locale: 'en',
        title: '55" 4K Smart TV',
        description: 'Ultra HD smart television',
        category: 'Televisions',
        badges: ['4K', 'Smart'],
      },
      {
        locale: 'he',
        title: 'טלוויזיה חכמה 4K 55"',
        description: 'טלוויזיה אולטרה HD חכמה',
        category: 'טלוויזיות',
        badges: ['4K', 'חכמה'],
      },
    ],
  },
  {
    id: 'accessories',
    sku: 'ACC-001',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    price: 49,
    flags: [],
    translations: [
      {
        locale: 'en',
        title: 'Gaming Accessories Bundle',
        description: 'Controller, headset, and cables',
        category: 'Accessories',
        badges: ['Bundle'],
      },
      {
        locale: 'he',
        title: 'חבילת אביזרי משחקים',
        description: 'בקר, אוזניות וכבלים',
        category: 'אביזרים',
        badges: ['חבילה'],
      },
    ],
  },
  {
    id: 'smart-home',
    sku: 'SH-001',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    price: 199,
    flags: [],
    translations: [
      {
        locale: 'en',
        title: 'Smart Home Hub',
        description: 'Central control for smart devices',
        category: 'Smart Home',
        badges: ['Connected'],
      },
      {
        locale: 'he',
        title: '허브הבית החכם',
        description: 'שליטה מרכזית במכשירים חכמים',
        category: 'בית חכם',
        badges: ['מחובר'],
      },
    ],
  },
];

async function getProducts(): Promise<Product[]> {
  try {
    const url = await getDownloadUrl(PRODUCTS_BLOB_NAME);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Not found');
    return (await response.json()) as Product[];
  } catch {
    await put(PRODUCTS_BLOB_NAME, JSON.stringify(SEED_PRODUCTS));
    return SEED_PRODUCTS;
  }
}

async function saveProducts(products: Product[]) {
  await put(PRODUCTS_BLOB_NAME, JSON.stringify(products));
}

export async function GET(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.consoltech.co.il');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const { id } = req.query;

  if (id) {
    const products = await getProducts();
    const product = products.find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(product);
  }

  const products = await getProducts();
  return res.status(200).json(products);
}

export async function POST(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.consoltech.co.il');

  // TODO: Add JWT auth verification here
  const products = await getProducts();
  const newProduct: Product = {
    id: `prod_${Date.now()}`,
    ...req.body,
  };
  products.push(newProduct);
  await saveProducts(products);
  return res.status(201).json(newProduct);
}

export async function PUT(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.consoltech.co.il');

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  const products = await getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products[index] = { ...products[index], ...req.body, id: products[index].id };
  await saveProducts(products);
  return res.status(200).json(products[index]);
}

export async function DELETE(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.consoltech.co.il');

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  let products = await getProducts();
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);

  if (products.length === initialLength) {
    return res.status(404).json({ error: 'Product not found' });
  }

  await saveProducts(products);
  return res.status(200).json({ success: true });
}
