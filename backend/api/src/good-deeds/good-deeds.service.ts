import { Injectable } from '@nestjs/common';
import { JsonStorageService } from '../storage/json-storage.service';

@Injectable()
export class GoodDeedsService {
  constructor(private storage: JsonStorageService) {}

  async getAll() {
    const deeds = await this.storage.getGoodDeeds();
    return [...deeds].reverse();
  }

  async create(name: string, deed: string) {
    return this.storage.createGoodDeed({ name, deed });
  }

  async updatePoints(id: number, points: number) {
    const updated = await this.storage.updateGoodDeedPoints(id, points);
    if (!updated) return { success: false, message: 'Deed not found' };
    return { success: true, deed: updated };
  }

  async delete(id: number) {
    const deleted = await this.storage.deleteGoodDeed(id);
    return { success: deleted, message: deleted ? 'Deed deleted' : 'Deed not found' };
  }
}
