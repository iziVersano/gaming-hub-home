import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PlacesService } from './places.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('api/places')
export class PlacesController {
  constructor(private readonly service: PlacesService) {}

  @Get()
  getAll(@Query('city') city?: string, @Query('mitzvah') mitzvah?: string) {
    return this.service.getAll(city, mitzvah);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  getAllAdmin() {
    return this.service.getAllAdmin();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
