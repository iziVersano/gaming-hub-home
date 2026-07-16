import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  // Invoice files saved by the JSON-storage fallback (Supabase mode serves
  // invoices via signed URLs instead)
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  app.enableCors({
    origin: [
      'https://www.consoltech.co.il',
      'https://consoltech.co.il',
      'https://consoltech.shop',
      'https://www.consoltech.shop',
      'http://localhost:5173',
      'http://localhost:5175',
      'http://localhost:8080',
    ],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`✓ API listening on port ${port}`);
}

bootstrap();
