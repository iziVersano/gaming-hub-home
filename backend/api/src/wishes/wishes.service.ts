import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonStorageService, WishEntity } from '../storage/json-storage.service';

export interface PlaceWishDto {
  name: string;
  city: string;
  wish: string;
  category: string;
  forWhom?: string;
}

@Injectable()
export class WishesService {
  constructor(private readonly storage: JsonStorageService) {}

  async getAll(): Promise<WishEntity[]> {
    return this.storage.getWishes();
  }

  async place(dto: PlaceWishDto): Promise<WishEntity> {
    return this.storage.saveWish({
      name: dto.name.trim().slice(0, 50),
      city: dto.city,
      wish: dto.wish.trim().slice(0, 280),
      category: dto.category,
      forWhom: dto.forWhom?.trim().slice(0, 80) || undefined,
    });
  }

  async light(id: number): Promise<WishEntity> {
    const updated = await this.storage.lightWish(id);
    if (!updated) throw new NotFoundException(`Wish ${id} not found`);
    return updated;
  }
}
