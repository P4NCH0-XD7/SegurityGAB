import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersModule } from '../../src/modules/orders/orders.module';
import { Order } from '../../src/modules/orders/orders_entity/order.entity';
import { testOrders } from '../fixtures/test-data';

describe('Orders endpoints (functional)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqljs',
          autoSave: false,
          synchronize: true,
          dropSchema: true,
          entities: [Order],
          logging: false,
        }),
        OrdersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /orders -> inicia vacío', async () => {
    const res = await request(app.getHttpServer()).get('/orders').expect(200);
    expect(res.body).toEqual([]);
  });

  it('CRUD básico de órdenes', async () => {
    // CREATE
    const created = await request(app.getHttpServer())
      .post('/orders')
      .send(testOrders.order1)
      .expect(201);

    expect(created.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        customerEmail: testOrders.order1.customerEmail,
        status: 'created',
      }),
    );

    const id = created.body.id;

    // READ
    const fetched = await request(app.getHttpServer()).get(`/orders/${id}`).expect(200);
    expect(fetched.body).toEqual(expect.objectContaining({ id }));

    // UPDATE
    const updated = await request(app.getHttpServer())
      .put(`/orders/${id}`)
      .send({ status: 'paid' })
      .expect(200);

    expect(updated.body).toEqual(expect.objectContaining({ id, status: 'paid' }));

    // DELETE
    const deleted = await request(app.getHttpServer()).delete(`/orders/${id}`).expect(200);
    expect(deleted.body).toEqual({ ok: true });

    await request(app.getHttpServer()).get(`/orders/${id}`).expect(404);
  });
});
