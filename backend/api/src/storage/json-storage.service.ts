import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface ProductTranslation {
  locale: string;
  title: string;
  description: string;
  category: string;
  badges?: string;
}

export interface ProductEntity {
  id: number;
  sku?: string;
  imageUrl: string;
  price: number;
  flags?: string;
  translations: ProductTranslation[];
}

export interface WarrantySubmissionEntity {
  id: number;
  rowKey: string;
  customerName: string;
  email: string;
  product: string;
  serialNumber: string;
  invoiceUrl?: string;
  invoiceFileName?: string;
  createdAt: string;
}

@Injectable()
export class JsonStorageService {
  private productsPath: string;
  private warrantyPath: string;
  private dataDir: string;

  constructor() {
    this.dataDir = join(process.cwd(), 'data');
    this.productsPath = join(this.dataDir, 'products.json');
    this.warrantyPath = join(this.dataDir, 'warranty.json');

    // Ensure data directory exists
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }

    // Initialize files if they don't exist
    if (!existsSync(this.productsPath)) {
      this.seedProducts();
    }
    if (!existsSync(this.warrantyPath)) {
      writeFileSync(this.warrantyPath, JSON.stringify([], null, 2));
    }
  }

  // Products
  async getProducts(): Promise<ProductEntity[]> {
    const data = readFileSync(this.productsPath, 'utf-8');
    return JSON.parse(data);
  }

  async getProductById(id: number): Promise<ProductEntity | null> {
    const products = await this.getProducts();
    return products.find((p) => p.id === id) || null;
  }

  async createProduct(product: ProductEntity): Promise<ProductEntity> {
    const products = await this.getProducts();
    const maxId = products.length > 0 ? Math.max(...products.map((p) => p.id)) : 0;
    product.id = maxId + 1;
    products.push(product);
    writeFileSync(this.productsPath, JSON.stringify(products, null, 2));
    return product;
  }

  async updateProduct(id: number, updates: Partial<ProductEntity>): Promise<ProductEntity | null> {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates, id };
    writeFileSync(this.productsPath, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;
    writeFileSync(this.productsPath, JSON.stringify(filtered, null, 2));
    return true;
  }

  // Warranty
  async getWarrantyRecords(): Promise<WarrantySubmissionEntity[]> {
    const data = readFileSync(this.warrantyPath, 'utf-8');
    return JSON.parse(data);
  }

  async saveWarrantyRecord(record: Omit<WarrantySubmissionEntity, 'id' | 'rowKey' | 'createdAt'>): Promise<WarrantySubmissionEntity> {
    const records = await this.getWarrantyRecords();
    const maxId = records.length > 0 ? Math.max(...records.map((r) => r.id)) : 0;
    const entity: WarrantySubmissionEntity = {
      id: maxId + 1,
      rowKey: `warranty-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      ...record,
    };
    records.push(entity);
    writeFileSync(this.warrantyPath, JSON.stringify(records, null, 2));
    return entity;
  }

  async deleteWarrantyRecord(identifier: string): Promise<boolean> {
    const records = await this.getWarrantyRecords();
    const filtered = records.filter(
      (r) => r.rowKey !== identifier && r.serialNumber !== identifier && r.id.toString() !== identifier,
    );
    if (filtered.length === records.length) return false;
    writeFileSync(this.warrantyPath, JSON.stringify(filtered, null, 2));
    return true;
  }

  private seedProducts(): void {
    const seededProducts: ProductEntity[] = [
      {
        id: 1,
        sku: 'NS2-2024',
        imageUrl: '/images/nintendo-switch-2-product.jpg',
        price: 449.99,
        flags: 'featured,new',
        translations: [
          {
            locale: 'en',
            title: 'Nintendo Switch 2',
            description:
              'The next generation of Nintendo gaming. Experience enhanced graphics, faster performance, and an expanded game library. Features a larger display, improved Joy-Con controllers, and backward compatibility.',
            category: 'New Arrivals',
            badges: 'Featured,Hot',
          },
          {
            locale: 'he',
            title: 'נינטנדו סוויץ\' 2',
            description:
              'הדור הבא של משחקי נינטנדו. חוו גרפיקה משופרת, ביצועים מהירים יותר וספריית משחקים מורחבת. כולל מסך גדול יותר, בקרי Joy-Con משופרים ותאימות לאחור.',
            category: 'מוצרים חדשים',
            badges: 'מומלץ,לוהט',
          },
        ],
      },
      {
        id: 2,
        sku: 'PS5-STD',
        imageUrl: '/images/bd80e124-a5e2-4d34-9c82-ebc0dbd6a697.png',
        price: 499.99,
        flags: 'featured,new',
        translations: [
          {
            locale: 'en',
            title: 'PlayStation 5',
            description: 'Next-generation gaming console with ultra-fast SSD and ray tracing technology. Experience lightning-fast loading and stunning graphics.',
            category: 'New Arrivals',
            badges: 'Featured',
          },
          {
            locale: 'he',
            title: 'פלייסטיישן 5',
            description: 'קונסולת משחקים מהדור הבא עם SSD במהירות אולטרה וטכנולוגיית Ray Tracing. חוו טעינה במהירות הבזק וגרפיקה מדהימה.',
            category: 'מוצרים חדשים',
            badges: 'מומלץ',
          },
        ],
      },
      {
        id: 3,
        sku: 'XSX-2024',
        imageUrl: '/images/78a95f48-606e-44b6-950e-af0555a3f04f.png',
        price: 449.99,
        flags: 'new',
        translations: [
          {
            locale: 'en',
            title: 'Xbox Series X',
            description: 'The most powerful Xbox ever with 12 teraflops of GPU performance and Smart Delivery technology.',
            category: 'New Arrivals',
          },
          {
            locale: 'he',
            title: 'אקסבוקס סדרה X',
            description: 'ה-Xbox החזק ביותר אי פעם עם 12 teraflops של ביצועי GPU וטכנולוגיית Smart Delivery.',
            category: 'מוצרים חדשים',
          },
        ],
      },
      {
        id: 4,
        sku: 'DRN-PRO',
        imageUrl: '/images/07ba8bc0-8d14-4d62-a534-659913ac5f99.png',
        price: 1299.99,
        translations: [
          {
            locale: 'en',
            title: 'Professional Drones',
            description: 'High-performance drones for commercial photography, surveying, and recreational flying with advanced stabilization.',
            category: 'Drones',
          },
          {
            locale: 'he',
            title: 'רחפנים מקצועיים',
            description: 'רחפנים בעלי ביצועים גבוהים לצילום מסחרי, סקרים וטיסות פנאי עם ייצוב מתקדם.',
            category: 'רחפנים',
          },
        ],
      },
      {
        id: 5,
        sku: 'EBIKE-SMART',
        imageUrl: '/images/a0bd3ab6-05d5-4312-b6ec-f0e256d7a63a.png',
        price: 1899.99,
        translations: [
          {
            locale: 'en',
            title: 'Smart E-Bikes',
            description: 'Electric bikes with smart connectivity, long-range batteries, and advanced motor systems for urban mobility.',
            category: 'E-Bikes',
          },
          {
            locale: 'he',
            title: 'אופניים חשמליים חכמים',
            description: 'אופניים חשמליים עם קישוריות חכמה, סוללות לטווח ארוך ומערכות מנוע מתקדמות לניידות עירונית.',
            category: 'אופניים חשמליים',
          },
        ],
      },
      {
        id: 6,
        sku: 'TV-4K-55',
        imageUrl: '/images/6df37998-af04-426e-b749-365ffeb66787.png',
        price: 799.99,
        translations: [
          {
            locale: 'en',
            title: '4K Smart TVs',
            description: 'Ultra-high definition smart TVs with AI upscaling, HDR support, and built-in streaming platforms.',
            category: 'TVs',
          },
          {
            locale: 'he',
            title: 'טלוויזיות חכמות 4K',
            description: 'טלוויזיות חכמות ברזולוציה גבוהה במיוחד עם שדרוג AI, תמיכת HDR ופלטפורמות סטרימינג מובנות.',
            category: 'טלוויזיות',
          },
        ],
      },
      {
        id: 7,
        sku: 'GAME-ACC',
        imageUrl: '/images/bd80e124-a5e2-4d34-9c82-ebc0dbd6a697.png',
        price: 149.99,
        translations: [
          {
            locale: 'en',
            title: 'Gaming Accessories',
            description: 'Premium gaming peripherals including controllers, headsets, and racing wheels from top brands.',
            category: 'Gaming',
          },
          {
            locale: 'he',
            title: 'אביזרי גיימינג',
            description: 'ציוד היקפי משחקים פרימיום כולל בקרים, אוזניות והגאי מרוץ מהמותגים המובילים.',
            category: 'משחקים',
          },
        ],
      },
      {
        id: 8,
        sku: 'SMART-HOME',
        imageUrl: '/images/6df37998-af04-426e-b749-365ffeb66787.png',
        price: 299.99,
        translations: [
          {
            locale: 'en',
            title: 'Smart Home Electronics',
            description: 'Connected home devices including smart speakers, security cameras, and automation systems.',
            category: 'Electronics',
          },
          {
            locale: 'he',
            title: 'אלקטרוניקה לבית חכם',
            description: 'מכשירים מחוברים לבית כולל רמקולים חכמים, מצלמות אבטחה ומערכות אוטומציה.',
            category: 'אלקטרוניקה',
          },
        ],
      },
    ];

    writeFileSync(this.productsPath, JSON.stringify(seededProducts, null, 2));
  }
}
