import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonStorageService, PlaceEntity } from '../storage/json-storage.service';

@Injectable()
export class PlacesService {
  constructor(private readonly storage: JsonStorageService) {}

  async getAll(city?: string, mitzvah?: string): Promise<PlaceEntity[]> {
    return this.storage.getPlaces(city, mitzvah);
  }

  async getAllAdmin(): Promise<PlaceEntity[]> {
    return this.storage.getAllPlaces();
  }

  async create(data: Omit<PlaceEntity, 'id' | 'createdAt'>): Promise<PlaceEntity> {
    return this.storage.createPlace(data);
  }

  async update(id: number, data: Partial<PlaceEntity>): Promise<PlaceEntity> {
    const updated = await this.storage.updatePlace(id, data);
    if (!updated) throw new NotFoundException(`Place ${id} not found`);
    return updated;
  }

  async remove(id: number): Promise<{ success: boolean }> {
    const deleted = await this.storage.deletePlace(id);
    if (!deleted) throw new NotFoundException(`Place ${id} not found`);
    return { success: true };
  }
}
