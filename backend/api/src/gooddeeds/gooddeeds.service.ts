import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonStorageService, GoodDeedEntity } from '../storage/json-storage.service';

export interface SubmitDeedDto {
  name: string;
  city: string;
  deed: string;
  category: string;
  proofUrl?: string;
}

@Injectable()
export class GoodDeedsService {
  constructor(private readonly storage: JsonStorageService) {}

  async getAll(): Promise<GoodDeedEntity[]> {
    return this.storage.getGoodDeeds();
  }

  async submit(dto: SubmitDeedDto): Promise<GoodDeedEntity> {
    return this.storage.saveGoodDeed({
      name: dto.name.trim().slice(0, 50),
      city: dto.city,
      deed: dto.deed.trim().slice(0, 300),
      category: dto.category,
      proofUrl: dto.proofUrl?.trim() || undefined,
    });
  }

  async vouch(id: number): Promise<GoodDeedEntity> {
    const updated = await this.storage.vouchGoodDeed(id);
    if (!updated) throw new NotFoundException(`Deed ${id} not found`);
    return updated;
  }
}
