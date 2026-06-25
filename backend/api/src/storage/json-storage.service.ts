import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ─── Shared interfaces ────────────────────────────────────────────────────────

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
  phone?: string;
  product: string;
  serialNumber: string;
  purchaseDate?: string;
  storeName?: string;
  invoiceUrl?: string;
  invoiceFileName?: string;
  createdAt: string;
}

export interface GoodDeedEntity {
  id: number;
  name: string;
  city: string;
  deed: string;
  category: string;
  proofUrl?: string;
  points: number;
  vouches: number;
  createdAt: string;
}

export interface WishEntity {
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

export interface StreakRecord {
  name: string;
  lastDate: string;
  streak: number;
}

export type PlaceType = 'chabad' | 'hospital' | 'synagogue' | 'charity' | 'school' | 'community_center' | 'other';

export interface PlaceEntity {
  id: number;
  name: string;
  type: PlaceType;
  city: string;
  address?: string;
  website?: string;
  phone?: string;
  mitzvot: string[];
  description?: string;
  approved: boolean;
  createdAt: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class JsonStorageService {
  private sb?: SupabaseClient;
  private dataDir!: string;
  private productsPath!: string;
  private warrantyPath!: string;
  private goodDeedsPath!: string;
  private wishesPath!: string;
  private streaksPath!: string;
  private placesPath!: string;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;

    if (url && key) {
      this.sb = createClient(url, key, { auth: { persistSession: false } });
    } else {
      // Local-dev fallback: JSON files
      this.dataDir = join(process.cwd(), 'data');
      this.productsPath = join(this.dataDir, 'products.json');
      this.warrantyPath = join(this.dataDir, 'warranty.json');
      this.goodDeedsPath = join(this.dataDir, 'gooddeeds.json');
      this.wishesPath = join(this.dataDir, 'wishes.json');
      this.streaksPath = join(this.dataDir, 'streaks.json');
      this.placesPath = join(this.dataDir, 'places.json');
      this.initJsonFiles();
    }
  }

  private get useDb() { return !!this.sb; }

  // ── JSON file init ──────────────────────────────────────────────────────────

  private initJsonFiles() {
    if (!existsSync(this.dataDir)) mkdirSync(this.dataDir, { recursive: true });
    if (!existsSync(this.productsPath)) this.seedProductsJson();
    if (!existsSync(this.warrantyPath)) writeFileSync(this.warrantyPath, '[]');
    if (!existsSync(this.goodDeedsPath)) writeFileSync(this.goodDeedsPath, '[]');
    if (!existsSync(this.wishesPath)) writeFileSync(this.wishesPath, '[]');
    if (!existsSync(this.streaksPath)) writeFileSync(this.streaksPath, '[]');
    if (!existsSync(this.placesPath)) writeFileSync(this.placesPath, JSON.stringify(this.seedPlacesData(), null, 2));
  }

  private readJson<T>(path: string): T[] {
    return JSON.parse(readFileSync(path, 'utf-8'));
  }
  private writeJson<T>(path: string, data: T[]) {
    writeFileSync(path, JSON.stringify(data, null, 2));
  }

  // ── Row mappers ─────────────────────────────────────────────────────────────

  private toProduct(r: any): ProductEntity {
    return { id: r.id, sku: r.sku, imageUrl: r.image_url, price: r.price, flags: r.flags, translations: r.translations ?? [] };
  }
  private toWarranty(r: any): WarrantySubmissionEntity {
    return { id: r.id, rowKey: r.row_key, customerName: r.customer_name, email: r.email, phone: r.phone, product: r.product, serialNumber: r.serial_number, purchaseDate: r.purchase_date, storeName: r.store_name, invoiceUrl: r.invoice_url, invoiceFileName: r.invoice_file_name, createdAt: r.created_at };
  }
  private toGoodDeed(r: any): GoodDeedEntity {
    return { id: r.id, name: r.name, city: r.city, deed: r.deed, category: r.category, proofUrl: r.proof_url, points: r.points, vouches: r.vouches, createdAt: r.created_at };
  }
  private toWish(r: any): WishEntity {
    return { id: r.id, name: r.name, city: r.city, wish: r.wish, category: r.category, forWhom: r.for_whom, placeName: r.place_name, candles: r.candles, points: r.points, createdAt: r.created_at };
  }
  private toStreak(r: any): StreakRecord {
    return { name: r.name, lastDate: r.last_date, streak: r.streak };
  }
  private toPlace(r: any): PlaceEntity {
    return { id: r.id, name: r.name, type: r.type, city: r.city, address: r.address, website: r.website, phone: r.phone, mitzvot: r.mitzvot ?? [], description: r.description, approved: r.approved, createdAt: r.created_at };
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // Products
  // ══════════════════════════════════════════════════════════════════════════════

  async getProducts(): Promise<ProductEntity[]> {
    if (this.useDb) {
      const { data } = await this.sb!.from('products').select('*').order('id');
      return (data ?? []).map(this.toProduct);
    }
    return this.readJson<ProductEntity>(this.productsPath);
  }

  async getProductById(id: number): Promise<ProductEntity | null> {
    if (this.useDb) {
      const { data } = await this.sb!.from('products').select('*').eq('id', id).maybeSingle();
      return data ? this.toProduct(data) : null;
    }
    const products = await this.getProducts();
    return products.find(p => p.id === id) ?? null;
  }

  async createProduct(product: ProductEntity): Promise<ProductEntity> {
    if (this.useDb) {
      const { data } = await this.sb!.from('products').insert([{
        sku: product.sku, image_url: product.imageUrl, price: product.price, flags: product.flags, translations: product.translations,
      }]).select().single();
      return this.toProduct(data);
    }
    const products = await this.getProducts();
    const maxId = products.length ? Math.max(...products.map(p => p.id)) : 0;
    product.id = maxId + 1;
    products.push(product);
    this.writeJson(this.productsPath, products);
    return product;
  }

  async updateProduct(id: number, updates: Partial<ProductEntity>): Promise<ProductEntity | null> {
    if (this.useDb) {
      const patch: any = {};
      if (updates.sku !== undefined) patch.sku = updates.sku;
      if (updates.imageUrl !== undefined) patch.image_url = updates.imageUrl;
      if (updates.price !== undefined) patch.price = updates.price;
      if (updates.flags !== undefined) patch.flags = updates.flags;
      if (updates.translations !== undefined) patch.translations = updates.translations;
      const { data } = await this.sb!.from('products').update(patch).eq('id', id).select().maybeSingle();
      return data ? this.toProduct(data) : null;
    }
    const products = await this.getProducts();
    const i = products.findIndex(p => p.id === id);
    if (i === -1) return null;
    products[i] = { ...products[i], ...updates, id };
    this.writeJson(this.productsPath, products);
    return products[i];
  }

  async deleteProduct(id: number): Promise<boolean> {
    if (this.useDb) {
      const { error } = await this.sb!.from('products').delete().eq('id', id);
      return !error;
    }
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;
    this.writeJson(this.productsPath, filtered);
    return true;
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // Warranty
  // ══════════════════════════════════════════════════════════════════════════════

  async getWarrantyRecords(): Promise<WarrantySubmissionEntity[]> {
    if (this.useDb) {
      const { data } = await this.sb!.from('warranty_submissions').select('*').order('created_at', { ascending: false });
      return (data ?? []).map(this.toWarranty);
    }
    return this.readJson<WarrantySubmissionEntity>(this.warrantyPath);
  }

  async saveWarrantyRecord(record: Omit<WarrantySubmissionEntity, 'id' | 'rowKey' | 'createdAt'>): Promise<WarrantySubmissionEntity> {
    const rowKey = `warranty-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    if (this.useDb) {
      const { data } = await this.sb!.from('warranty_submissions').insert([{
        row_key: rowKey, customer_name: record.customerName, email: record.email, phone: record.phone ?? null,
        product: record.product, serial_number: record.serialNumber, purchase_date: record.purchaseDate ?? null,
        store_name: record.storeName ?? null, invoice_url: record.invoiceUrl, invoice_file_name: record.invoiceFileName,
      }]).select().single();
      return this.toWarranty(data);
    }
    const records = await this.getWarrantyRecords();
    const maxId = records.length ? Math.max(...records.map(r => r.id)) : 0;
    const entity: WarrantySubmissionEntity = { id: maxId + 1, rowKey, createdAt: new Date().toISOString(), ...record };
    records.push(entity);
    this.writeJson(this.warrantyPath, records);
    return entity;
  }

  async deleteWarrantyRecord(identifier: string): Promise<boolean> {
    if (this.useDb) {
      const { error } = await this.sb!.from('warranty_submissions')
        .delete().or(`row_key.eq.${identifier},serial_number.eq.${identifier},id.eq.${identifier}`);
      return !error;
    }
    const records = await this.getWarrantyRecords();
    const filtered = records.filter(r => r.rowKey !== identifier && r.serialNumber !== identifier && r.id.toString() !== identifier);
    if (filtered.length === records.length) return false;
    this.writeJson(this.warrantyPath, filtered);
    return true;
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // Good Deeds
  // ══════════════════════════════════════════════════════════════════════════════

  async getGoodDeeds(): Promise<GoodDeedEntity[]> {
    if (this.useDb) {
      const { data } = await this.sb!.from('good_deeds').select('*').order('created_at', { ascending: false });
      return (data ?? []).map(this.toGoodDeed);
    }
    return this.readJson<GoodDeedEntity>(this.goodDeedsPath);
  }

  async saveGoodDeed(deed: Omit<GoodDeedEntity, 'id' | 'points' | 'vouches' | 'createdAt'>): Promise<GoodDeedEntity> {
    if (this.useDb) {
      const { data } = await this.sb!.from('good_deeds').insert([{
        name: deed.name, city: deed.city, deed: deed.deed, category: deed.category, proof_url: deed.proofUrl,
      }]).select().single();
      return this.toGoodDeed(data);
    }
    const deeds = await this.getGoodDeeds();
    const maxId = deeds.length ? Math.max(...deeds.map(d => d.id)) : 0;
    const entity: GoodDeedEntity = { id: maxId + 1, points: 1, vouches: 0, createdAt: new Date().toISOString(), ...deed };
    deeds.unshift(entity);
    this.writeJson(this.goodDeedsPath, deeds);
    return entity;
  }

  async vouchGoodDeed(id: number): Promise<GoodDeedEntity | null> {
    if (this.useDb) {
      const { data: current } = await this.sb!.from('good_deeds').select('vouches').eq('id', id).maybeSingle();
      if (!current) return null;
      const { data } = await this.sb!.from('good_deeds').update({ vouches: current.vouches + 1 }).eq('id', id).select().single();
      return this.toGoodDeed(data);
    }
    const deeds = await this.getGoodDeeds();
    const i = deeds.findIndex(d => d.id === id);
    if (i === -1) return null;
    deeds[i].vouches += 1;
    this.writeJson(this.goodDeedsPath, deeds);
    return deeds[i];
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // Wishes (Kotel Wall)
  // ══════════════════════════════════════════════════════════════════════════════

  async getWishes(): Promise<WishEntity[]> {
    if (this.useDb) {
      const { data } = await this.sb!.from('wishes').select('*').order('created_at', { ascending: false });
      return (data ?? []).map(this.toWish);
    }
    return this.readJson<WishEntity>(this.wishesPath);
  }

  async saveWish(wish: Omit<WishEntity, 'id' | 'candles' | 'createdAt'>): Promise<WishEntity> {
    if (this.useDb) {
      const { data } = await this.sb!.from('wishes').insert([{
        name: wish.name, city: wish.city, wish: wish.wish, category: wish.category,
        for_whom: wish.forWhom ?? null, place_name: wish.placeName ?? null, points: wish.points,
      }]).select().single();
      return this.toWish(data);
    }
    const wishes = await this.getWishes();
    const maxId = wishes.length ? Math.max(...wishes.map(w => w.id)) : 0;
    const entity: WishEntity = { id: maxId + 1, candles: 0, createdAt: new Date().toISOString(), ...wish };
    wishes.unshift(entity);
    this.writeJson(this.wishesPath, wishes);
    return entity;
  }

  async lightWish(id: number): Promise<WishEntity | null> {
    if (this.useDb) {
      const { data: current } = await this.sb!.from('wishes').select('candles,points').eq('id', id).maybeSingle();
      if (!current) return null;
      const { data } = await this.sb!.from('wishes').update({ candles: current.candles + 1, points: current.points + 1 }).eq('id', id).select().single();
      return this.toWish(data);
    }
    const wishes = await this.getWishes();
    const i = wishes.findIndex(w => w.id === id);
    if (i === -1) return null;
    wishes[i].candles += 1;
    wishes[i].points += 1;
    this.writeJson(this.wishesPath, wishes);
    return wishes[i];
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // Streaks
  // ══════════════════════════════════════════════════════════════════════════════

  async getStreaks(): Promise<StreakRecord[]> {
    if (this.useDb) {
      const { data } = await this.sb!.from('streaks').select('*');
      return (data ?? []).map(this.toStreak);
    }
    return this.readJson<StreakRecord>(this.streaksPath);
  }

  async updateStreak(name: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (this.useDb) {
      const { data: existing } = await this.sb!.from('streaks').select('*').eq('name', name).maybeSingle();
      if (!existing) {
        await this.sb!.from('streaks').insert([{ name, last_date: today, streak: 1 }]);
        return 1;
      }
      if (existing.last_date === today) return existing.streak;
      const streak = existing.last_date === yesterday ? existing.streak + 1 : 1;
      await this.sb!.from('streaks').update({ last_date: today, streak }).eq('name', name);
      return streak;
    }

    const streaks = await this.getStreaks();
    const existing = streaks.find(s => s.name === name);
    if (!existing) {
      streaks.push({ name, lastDate: today, streak: 1 });
      this.writeJson(this.streaksPath, streaks);
      return 1;
    }
    if (existing.lastDate === today) return existing.streak;
    existing.streak = existing.lastDate === yesterday ? existing.streak + 1 : 1;
    existing.lastDate = today;
    this.writeJson(this.streaksPath, streaks);
    return existing.streak;
  }

  async getStreak(name: string): Promise<number> {
    if (this.useDb) {
      const { data } = await this.sb!.from('streaks').select('streak').eq('name', name).maybeSingle();
      return data?.streak ?? 0;
    }
    const streaks = await this.getStreaks();
    return streaks.find(s => s.name === name)?.streak ?? 0;
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // Places
  // ══════════════════════════════════════════════════════════════════════════════

  async getPlaces(city?: string, mitzvah?: string): Promise<PlaceEntity[]> {
    if (this.useDb) {
      let q = this.sb!.from('places').select('*').eq('approved', true);
      if (city) q = q.eq('city', city);
      if (mitzvah) q = q.contains('mitzvot', [mitzvah]);
      const { data } = await q.order('name');
      return (data ?? []).map(this.toPlace);
    }
    const places: PlaceEntity[] = JSON.parse(readFileSync(this.placesPath, 'utf-8'));
    return places.filter(p => {
      if (!p.approved) return false;
      if (city && p.city !== city) return false;
      if (mitzvah && !p.mitzvot.includes(mitzvah)) return false;
      return true;
    });
  }

  async getAllPlaces(): Promise<PlaceEntity[]> {
    if (this.useDb) {
      const { data } = await this.sb!.from('places').select('*').order('city').order('name');
      return (data ?? []).map(this.toPlace);
    }
    return JSON.parse(readFileSync(this.placesPath, 'utf-8'));
  }

  async createPlace(place: Omit<PlaceEntity, 'id' | 'createdAt'>): Promise<PlaceEntity> {
    if (this.useDb) {
      const { data } = await this.sb!.from('places').insert([{
        name: place.name, type: place.type, city: place.city, address: place.address ?? null,
        website: place.website ?? null, phone: place.phone ?? null, mitzvot: place.mitzvot,
        description: place.description ?? null, approved: place.approved,
      }]).select().single();
      return this.toPlace(data);
    }
    const places = await this.getAllPlaces();
    const maxId = places.length ? Math.max(...places.map(p => p.id)) : 0;
    const entity: PlaceEntity = { id: maxId + 1, createdAt: new Date().toISOString(), ...place };
    places.push(entity);
    writeFileSync(this.placesPath, JSON.stringify(places, null, 2));
    return entity;
  }

  async updatePlace(id: number, updates: Partial<PlaceEntity>): Promise<PlaceEntity | null> {
    if (this.useDb) {
      const patch: any = {};
      if (updates.name !== undefined) patch.name = updates.name;
      if (updates.type !== undefined) patch.type = updates.type;
      if (updates.city !== undefined) patch.city = updates.city;
      if (updates.address !== undefined) patch.address = updates.address;
      if (updates.website !== undefined) patch.website = updates.website;
      if (updates.phone !== undefined) patch.phone = updates.phone;
      if (updates.mitzvot !== undefined) patch.mitzvot = updates.mitzvot;
      if (updates.description !== undefined) patch.description = updates.description;
      if (updates.approved !== undefined) patch.approved = updates.approved;
      const { data } = await this.sb!.from('places').update(patch).eq('id', id).select().maybeSingle();
      return data ? this.toPlace(data) : null;
    }
    const places = await this.getAllPlaces();
    const i = places.findIndex(p => p.id === id);
    if (i === -1) return null;
    places[i] = { ...places[i], ...updates, id };
    writeFileSync(this.placesPath, JSON.stringify(places, null, 2));
    return places[i];
  }

  async deletePlace(id: number): Promise<boolean> {
    if (this.useDb) {
      const { error } = await this.sb!.from('places').delete().eq('id', id);
      return !error;
    }
    const places = await this.getAllPlaces();
    const filtered = places.filter(p => p.id !== id);
    if (filtered.length === places.length) return false;
    writeFileSync(this.placesPath, JSON.stringify(filtered, null, 2));
    return true;
  }

  // ── JSON seed helpers ───────────────────────────────────────────────────────

  private seedPlacesData(): PlaceEntity[] {
    const ALL = ['chesed', 'tzedakah', 'bikur', 'orchim', 'avelim', 'horim', 'olam', 'gmilut'];
    const now = new Date().toISOString();
    return [
      { id: 1,  name: 'Chabad of Jerusalem',            type: 'chabad',           city: 'ישראל',        mitzvot: ALL,                                       approved: true, createdAt: now },
      { id: 2,  name: 'Hadassah Medical Center',         type: 'hospital',         city: 'ישראל',        mitzvot: ['bikur','chesed'],                         approved: true, createdAt: now },
      { id: 3,  name: 'Mayanei HaYeshua Hospital',       type: 'hospital',         city: 'ישראל',        mitzvot: ['bikur','chesed'],                         approved: true, createdAt: now },
      { id: 4,  name: 'Leket Israel Food Bank',          type: 'charity',          city: 'ישראל',        mitzvot: ['tzedakah','olam'],                        approved: true, createdAt: now },
      { id: 5,  name: 'Yad Sarah',                       type: 'charity',          city: 'ישראל',        mitzvot: ['chesed','bikur','gmilut'],                 approved: true, createdAt: now },
      { id: 6,  name: 'Chabad of Manhattan',             type: 'chabad',           city: 'New York',     mitzvot: ALL,                                       approved: true, createdAt: now },
      { id: 7,  name: 'Bikur Cholim of Greater NY',      type: 'charity',          city: 'New York',     mitzvot: ['bikur','chesed','avelim'],                 approved: true, createdAt: now },
      { id: 8,  name: 'UJA-Federation of New York',      type: 'charity',          city: 'New York',     mitzvot: ['tzedakah','olam'],                        approved: true, createdAt: now },
      { id: 9,  name: 'Mount Sinai Hospital',            type: 'hospital',         city: 'New York',     mitzvot: ['bikur','chesed'],                         approved: true, createdAt: now },
      { id: 10, name: 'Jewish Home Lifecare',            type: 'community_center', city: 'New York',     mitzvot: ['horim','bikur','chesed'],                  approved: true, createdAt: now },
      { id: 11, name: 'Chabad de Paris',                 type: 'chabad',           city: 'Paris',        mitzvot: ALL,                                       approved: true, createdAt: now },
      { id: 12, name: 'Hôpital Rothschild',              type: 'hospital',         city: 'Paris',        mitzvot: ['bikur','chesed'],                         approved: true, createdAt: now },
      { id: 13, name: 'FSJU — Fonds Social Juif Unifié', type: 'charity',          city: 'Paris',        mitzvot: ['tzedakah','olam','chesed'],                approved: true, createdAt: now },
      { id: 14, name: 'Association Bikour Holim Paris',  type: 'charity',          city: 'Paris',        mitzvot: ['bikur','chesed','avelim'],                 approved: true, createdAt: now },
      { id: 15, name: 'Chabad de Buenos Aires',          type: 'chabad',           city: 'Buenos Aires', mitzvot: ALL,                                       approved: true, createdAt: now },
      { id: 16, name: 'AMIA',                            type: 'community_center', city: 'Buenos Aires', mitzvot: ['tzedakah','olam','chesed','gmilut'],        approved: true, createdAt: now },
      { id: 17, name: 'Hospital Israelita',              type: 'hospital',         city: 'Buenos Aires', mitzvot: ['bikur','chesed'],                         approved: true, createdAt: now },
      { id: 18, name: 'Fundación Tzedaká',               type: 'charity',          city: 'Buenos Aires', mitzvot: ['tzedakah','olam'],                        approved: true, createdAt: now },
      { id: 19, name: 'Chabad of London',                type: 'chabad',           city: 'London',       mitzvot: ALL,                                       approved: true, createdAt: now },
      { id: 20, name: 'Jewish Care',                     type: 'charity',          city: 'London',       mitzvot: ['chesed','bikur','horim','tzedakah'],        approved: true, createdAt: now },
      { id: 21, name: 'World Jewish Relief',             type: 'charity',          city: 'London',       mitzvot: ['tzedakah','olam'],                        approved: true, createdAt: now },
      { id: 22, name: 'Bikur Cholim London',             type: 'charity',          city: 'London',       mitzvot: ['bikur','chesed','avelim'],                 approved: true, createdAt: now },
      { id: 23, name: 'Chabad Moscow — Marina Roscha',   type: 'chabad',           city: 'Moscow',       mitzvot: ALL,                                       approved: true, createdAt: now },
      { id: 24, name: 'Federation of Jewish Communities',type: 'community_center', city: 'Moscow',       mitzvot: ['tzedakah','olam','chesed'],                approved: true, createdAt: now },
      { id: 25, name: 'Hesed Avot Social Services',      type: 'charity',          city: 'Moscow',       mitzvot: ['horim','chesed','bikur','gmilut'],          approved: true, createdAt: now },
    ];
  }

  private seedProductsJson() {
    const seededProducts: ProductEntity[] = [
      { id: 1, sku: 'NS2-2024', imageUrl: '/images/nintendo-switch-2-product.jpg', price: 449.99, flags: 'featured,new', translations: [{ locale: 'en', title: 'Nintendo Switch 2', description: 'The next generation of Nintendo gaming.', category: 'New Arrivals', badges: 'Featured,Hot' }, { locale: 'he', title: "נינטנדו סוויץ' 2", description: 'הדור הבא של משחקי נינטנדו.', category: 'מוצרים חדשים', badges: 'מומלץ,לוהט' }] },
      { id: 2, sku: 'PS5-STD', imageUrl: '/images/bd80e124-a5e2-4d34-9c82-ebc0dbd6a697.png', price: 499.99, flags: 'featured,new', translations: [{ locale: 'en', title: 'PlayStation 5', description: 'Next-generation gaming console.', category: 'New Arrivals', badges: 'Featured' }, { locale: 'he', title: 'פלייסטיישן 5', description: 'קונסולת משחקים מהדור הבא.', category: 'מוצרים חדשים', badges: 'מומלץ' }] },
      { id: 3, sku: 'XSX-2024', imageUrl: '/images/78a95f48-606e-44b6-950e-af0555a3f04f.png', price: 449.99, flags: 'new', translations: [{ locale: 'en', title: 'Xbox Series X', description: 'The most powerful Xbox ever.', category: 'New Arrivals' }, { locale: 'he', title: 'אקסבוקס סדרה X', description: 'ה-Xbox החזק ביותר אי פעם.', category: 'מוצרים חדשים' }] },
      { id: 4, sku: 'DRN-PRO', imageUrl: '/images/07ba8bc0-8d14-4d62-a534-659913ac5f99.png', price: 1299.99, translations: [{ locale: 'en', title: 'Professional Drones', description: 'High-performance drones.', category: 'Drones' }, { locale: 'he', title: 'רחפנים מקצועיים', description: 'רחפנים בעלי ביצועים גבוהים.', category: 'רחפנים' }] },
      { id: 5, sku: 'EBIKE-SMART', imageUrl: '/images/a0bd3ab6-05d5-4312-b6ec-f0e256d7a63a.png', price: 1899.99, translations: [{ locale: 'en', title: 'Smart E-Bikes', description: 'Electric bikes with smart connectivity.', category: 'E-Bikes' }, { locale: 'he', title: 'אופניים חשמליים חכמים', description: 'אופניים חשמליים עם קישוריות חכמה.', category: 'אופניים חשמליים' }] },
      { id: 6, sku: 'TV-4K-55', imageUrl: '/images/6df37998-af04-426e-b749-365ffeb66787.png', price: 799.99, translations: [{ locale: 'en', title: '4K Smart TVs', description: 'Ultra-high definition smart TVs.', category: 'TVs' }, { locale: 'he', title: 'טלוויזיות חכמות 4K', description: 'טלוויזיות חכמות ברזולוציה גבוהה.', category: 'טלוויזיות' }] },
      { id: 7, sku: 'GAME-ACC', imageUrl: '/images/bd80e124-a5e2-4d34-9c82-ebc0dbd6a697.png', price: 149.99, translations: [{ locale: 'en', title: 'Gaming Accessories', description: 'Premium gaming peripherals.', category: 'Gaming' }, { locale: 'he', title: 'אביזרי גיימינג', description: 'ציוד היקפי משחקים פרימיום.', category: 'משחקים' }] },
      { id: 8, sku: 'SMART-HOME', imageUrl: '/images/6df37998-af04-426e-b749-365ffeb66787.png', price: 299.99, translations: [{ locale: 'en', title: 'Smart Home Electronics', description: 'Connected home devices.', category: 'Electronics' }, { locale: 'he', title: 'אלקטרוניקה לבית חכם', description: 'מכשירים מחוברים לבית.', category: 'אלקטרוניקה' }] },
    ];
    writeFileSync(this.productsPath, JSON.stringify(seededProducts, null, 2));
  }
}
