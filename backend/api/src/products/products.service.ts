import { Injectable } from '@nestjs/common';
import { JsonStorageService, ProductEntity, ProductTranslation } from '../storage/json-storage.service';

@Injectable()
export class ProductsService {
  constructor(private storage: JsonStorageService) {}

  async getAllProducts(locale: string = 'en'): Promise<any[]> {
    const products = await this.storage.getProducts();
    return products.map((p) => this.localizeProduct(p, locale));
  }

  async getProductById(id: number, locale: string = 'en'): Promise<any | null> {
    const product = await this.storage.getProductById(id);
    return product ? this.localizeProduct(product, locale) : null;
  }

  async createProduct(data: Omit<ProductEntity, 'id'>): Promise<any> {
    const product = await this.storage.createProduct({ ...data, id: 0 });
    return this.localizeProduct(product, 'en');
  }

  async updateProduct(id: number, data: Partial<ProductEntity>): Promise<any | null> {
    const product = await this.storage.updateProduct(id, data);
    return product ? this.localizeProduct(product, 'en') : null;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.storage.deleteProduct(id);
  }

  private localizeProduct(product: ProductEntity, locale: string): any {
    const translation = product.translations.find((t) => t.locale === locale) || product.translations.find((t) => t.locale === 'en');

    return {
      id: product.id,
      sku: product.sku,
      imageUrl: product.imageUrl,
      price: product.price,
      flags: product.flags,
      title: translation?.title || 'Untitled',
      description: translation?.description || 'No description available',
      category: translation?.category || 'Uncategorized',
      badges: translation?.badges,
    };
  }
}
