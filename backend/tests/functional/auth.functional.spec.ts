import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../../src/modules/auth/auth.module';
import { UsersModule } from '../../src/modules/users/users.module';
import { ProductsModule } from '../../src/modules/products/products.module';
import { OrdersModule } from '../../src/modules/orders/orders.module';

import { User } from '../../src/modules/users/user_entity/user.entity';
import { Product } from '../../src/modules/products/products_entity/product_entity';
import { Order } from '../../src/modules/orders/orders_entity/order.entity';

import { testUsers } from '../fixtures/test-data';

describe('Auth endpoints (functional)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // AuthModule uses JWT_SECRET from ConfigService/env.
    process.env.JWT_SECRET = 'functional-test-secret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqljs',
          autoSave: false,
          synchronize: true,
          dropSchema: true,
          entities: [User, Product, Order],
          logging: false,
        }),
        UsersModule,
        ProductsModule,
        OrdersModule,
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register -> crea usuario y no devuelve password', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: testUsers.alice.name,
        email: testUsers.alice.email,
        password: testUsers.alice.password,
      })
      .expect(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: testUsers.alice.name,
        email: testUsers.alice.email,
        role: 'user',
      }),
    );
    expect(res.body.password).toBeUndefined();
  });

  it('POST /auth/login -> rechaza credenciales inválidas', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUsers.alice.email, password: 'wrong' })
      .expect(401);
  });

  it('POST /auth/login -> entrega access_token con credenciales válidas', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUsers.alice.email, password: testUsers.alice.password })
      .expect(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(Number),
          email: testUsers.alice.email,
          role: 'user',
        }),
      }),
    );
  });
});
