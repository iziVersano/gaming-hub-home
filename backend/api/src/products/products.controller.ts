import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('api/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getAllProducts(@Query('locale') locale: string = 'en', @Query('lang') lang: string = 'en') {
    const requestedLocale = locale || lang;
    return this.productsService.getAllProducts(requestedLocale);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string, @Query('locale') locale: string = 'en') {
    return this.productsService.getProductById(parseInt(id, 10), locale);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(@Body() body: any) {
    return this.productsService.createProduct(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateProduct(@Param('id') id: string, @Body() body: any) {
    return this.productsService.updateProduct(parseInt(id, 10), body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Param('id') id: string) {
    const success = await this.productsService.deleteProduct(parseInt(id, 10));
    return { success, message: success ? 'Product deleted' : 'Product not found' };
  }
}
