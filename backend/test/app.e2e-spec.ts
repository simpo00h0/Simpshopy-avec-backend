import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const apiPrefix = 'api/v1';

  jest.setTimeout(15000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalFilters(
      new DomainExceptionFilter(),
      new GlobalExceptionFilter(),
    );
    app.setGlobalPrefix(apiPrefix);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /storefront/:slug', () => {
    it('retourne 404 pour une boutique inexistante', () => {
      return request(app.getHttpServer())
        .get(`/${apiPrefix}/storefront/boutique-inexistante-123`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('Boutique introuvable');
        });
    });
  });

  describe('POST /shipping/calculate', () => {
    it('retourne 201 avec un tableau (vide si pas de zones)', () => {
      return request(app.getHttpServer())
        .post(`/${apiPrefix}/shipping/calculate`)
        .send({
          storeId: 'store-test-uuid',
          country: 'SN',
          city: 'Dakar',
          weight: 1,
        })
        .expect(201)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('retourne 400 si storeId manquant', () => {
      return request(app.getHttpServer())
        .post(`/${apiPrefix}/shipping/calculate`)
        .send({ country: 'SN' })
        .expect(400);
    });
  });
});
