import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(
    new DomainExceptionFilter(),
    new GlobalExceptionFilter(),
  );

  const serveStatic = require('serve-static');
  app.use('/uploads', serveStatic(join(process.cwd(), 'uploads')));

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  const apiPrefix = configService.get('API_PREFIX') || 'api';
  const apiVersion = configService.get('API_VERSION') || 'v1';

  // CORS — accepte plusieurs origines séparées par des virgules
  const adminOrigins = (configService.get('FRONTEND_ADMIN_URL') || 'http://localhost:3001').split(',').map((s) => s.trim());
  const storefrontOrigins = (configService.get('FRONTEND_STOREFRONT_URL') || 'http://localhost:3002').split(',').map((s) => s.trim());
  app.enableCors({
    origin: [...adminOrigins, ...storefrontOrigins],
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
  const env = configService.get('NODE_ENV') || 'development';
  console.log(`🚀 Backend API running on: http://localhost:${port}/${apiPrefix}/${apiVersion} (${env})`);
  if (env !== 'production') {
    console.log(`📚 Swagger Docs: http://localhost:${port}/api/docs`);
  }
}

bootstrap();
