import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { GoodDeedsService, SubmitDeedDto } from './gooddeeds.service';

@Controller('api/gooddeeds')
export class GoodDeedsController {
  constructor(private readonly service: GoodDeedsService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Post()
  submit(@Body() dto: SubmitDeedDto) {
    return this.service.submit(dto);
  }

  @Post(':id/vouch')
  vouch(@Param('id', ParseIntPipe) id: number) {
    return this.service.vouch(id);
  }
}
