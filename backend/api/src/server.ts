import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export let app: any;

export async function getApp() {
  if (!app) {
    app = await NestFactory.create(AppModule, { logger: false });
    app.enableCors({
      origin: ['https://www.consoltech.co.il', 'https://consoltech.co.il', 'http://localhost:3000'],
      credentials: true,
    });
    const instance = app.getHttpServer();
    return instance;
  }
  return app.getHttpServer();
}

export async function bootstrap() {
  const nestApp = await NestFactory.create(AppModule);
  nestApp.enableCors({
    origin: ['https://www.consoltech.co.il', 'https://consoltech.co.il', 'http://localhost:3000'],
    credentials: true,
  });
  const port = process.env.PORT || 3000;
  await nestApp.listen(port);
  console.log(`✓ API listening on port ${port}`);
}
