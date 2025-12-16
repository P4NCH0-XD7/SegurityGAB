import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsModule } from '../../src/modules/products/products.module';
import { Product } from '../../src/modules/products/products_entity/product_entity';
import { testProducts } from '../fixtures/test-data';

describe('Products endpoints (functional)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqljs',
          autoSave: false,
          synchronize: true,
          dropSchema: true,
          entities: [Product],
          logging: false,
        }),
        ProductsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /products -> inicia vacío', async () => {
    const res = await request(app.getHttpServer()).get('/products').expect(200);
    expect(res.body).toEqual([]);
  });

  it('CRUD básico de productos', async () => {
    // CREATE
    const created = await request(app.getHttpServer())
      .post('/products')
      .send(testProducts.camera1)
      .expect(201);

    expect(created.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: testProducts.camera1.name,
        model: testProducts.camera1.model,
      }),
    );

    const id = created.body.id;

    // READ
    const fetched = await request(app.getHttpServer()).get(`/products/${id}`).expect(200);
    expect(fetched.body).toEqual(expect.objectContaining({ id, name: testProducts.camera1.name }));

    // UPDATE
    const updated = await request(app.getHttpServer())
      .put(`/products/${id}`)
      .send({ name: 'Updated product' })
      .expect(200);

    expect(updated.body).toEqual(expect.objectContaining({ id, name: 'Updated product' }));

    // DELETE
    await request(app.getHttpServer()).delete(`/products/${id}`).expect(200);

    // Ensure it is gone
    await request(app.getHttpServer()).get(`/products/${id}`).expect(404);
  });
});
