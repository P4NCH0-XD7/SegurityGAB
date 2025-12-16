import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../../src/modules/users/users.module';
import { User } from '../../src/modules/users/user_entity/user.entity';
import { testUsers } from '../fixtures/test-data';

describe('Users endpoints (functional)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqljs',
          autoSave: false,
          synchronize: true,
          dropSchema: true,
          entities: [User],
          logging: false,
        }),
        UsersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /users -> crea usuario', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: testUsers.alice.name,
        email: testUsers.alice.email,
        password: testUsers.alice.password,
      })
      .expect(201);

    // Nota: UsersController devuelve la entidad User, que incluye password hasheado.
    // Este test solo valida que se creó correctamente.
    expect(res.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: testUsers.alice.name,
        email: testUsers.alice.email,
        role: 'user',
        password: expect.any(String),
      }),
    );
  });

  it('GET /users -> lista usuarios', async () => {
    const res = await request(app.getHttpServer()).get('/users').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('PATCH /users/:id/role -> actualiza role', async () => {
    const list = await request(app.getHttpServer()).get('/users').expect(200);
    const id = list.body[0].id;

    const res = await request(app.getHttpServer())
      .patch(`/users/${id}/role`)
      .send({ role: 'admin' })
      .expect(200);

    expect(res.body).toEqual(expect.objectContaining({ id, role: 'admin' }));
  });
});
