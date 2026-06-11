import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { WishesService, PlaceWishDto } from './wishes.service';

@Controller('api/wishes')
export class WishesController {
  constructor(private readonly service: WishesService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Post()
  place(@Body() dto: PlaceWishDto) {
    return this.service.place(dto);
  }

  @Post(':id/light')
  light(@Param('id', ParseIntPipe) id: number) {
    return this.service.light(id);
  }
}
