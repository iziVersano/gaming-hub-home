import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonStorageService, WishEntity } from '../storage/json-storage.service';

export interface PlaceWishDto {
  name: string;
  city: string;
  wish: string;
  category: string;
  forWhom?: string;
}

export interface PlaceWishResult {
  wish: WishEntity;
  pointsAwarded: number;
  isChallenge: boolean;
  streak: number;
  streakBonus: boolean;
}

const DAILY_THEMES = ['שלום', 'בריאות', 'משפחה', 'אהבה', 'פרנסה', 'קהילה', 'שלום'];

@Injectable()
export class WishesService {
  constructor(private readonly storage: JsonStorageService) {}

  private getTodayTheme(): string {
    return DAILY_THEMES[new Date().getDay()];
  }

  async getAll(): Promise<WishEntity[]> {
    return this.storage.getWishes();
  }

  async place(dto: PlaceWishDto): Promise<PlaceWishResult> {
    const todayTheme = this.getTodayTheme();
    const isChallenge = dto.category === todayTheme;
    const streak = await this.storage.updateStreak(dto.name.trim());
    const streakBonus = streak >= 3;

    const points = 1 + (isChallenge ? 2 : 0) + (streakBonus ? 1 : 0);

    const wish = await this.storage.saveWish({
      name: dto.name.trim().slice(0, 50),
      city: dto.city,
      wish: dto.wish.trim().slice(0, 280),
      category: dto.category,
      forWhom: dto.forWhom?.trim().slice(0, 80) || undefined,
      points,
    });

    return { wish, pointsAwarded: points, isChallenge, streak, streakBonus };
  }

  async light(id: number): Promise<WishEntity> {
    const updated = await this.storage.lightWish(id);
    if (!updated) throw new NotFoundException(`Wish ${id} not found`);
    return updated;
  }

  async getStreak(name: string): Promise<{ name: string; streak: number }> {
    const streak = await this.storage.getStreak(name);
    return { name, streak };
  }
}
