import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { GoodDeedsService } from './good-deeds.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('api/good-deeds')
export class GoodDeedsController {
  constructor(private goodDeedsService: GoodDeedsService) {}

  @Get()
  async getAll() {
    return this.goodDeedsService.getAll();
  }

  @Post()
  async create(@Body() body: { name: string; deed: string }) {
    return this.goodDeedsService.create(body.name?.trim(), body.deed?.trim());
  }

  @Patch(':id/points')
  @UseGuards(JwtAuthGuard)
  async updatePoints(@Param('id') id: string, @Body() body: { points: number }) {
    return this.goodDeedsService.updatePoints(Number(id), body.points);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.goodDeedsService.delete(Number(id));
  }
}
