import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  const apiPrefix = configService.get('API_PREFIX') || 'api';
  const apiVersion = configService.get('API_VERSION') || 'v1';

  // CORS
  app.enableCors({
    origin: [
      configService.get('FRONTEND_ADMIN_URL') || 'http://localhost:3001',
      configService.get('FRONTEND_STOREFRONT_URL') || 'http://localhost:3002',
    ],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Documentation
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Simpshopy API')
      .setDescription('API pour la plateforme e-commerce Simpshopy - Zone CFA')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentification')
      .addTag('users', 'Gestion des utilisateurs')
      .addTag('stores', 'Gestion des boutiques')
      .addTag('products', 'Gestion des produits')
      .addTag('orders', 'Gestion des commandes')
      .addTag('payments', 'Paiements (Mobile Money, Cartes)')
      .addTag('subscriptions', 'Abonnements')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(port);
  console.log(`🚀 Backend API running on: http://localhost:${port}/${apiPrefix}/${apiVersion}`);
  console.log(`📚 Swagger Docs: http://localhost:${port}/api/docs`);
}

bootstrap();
