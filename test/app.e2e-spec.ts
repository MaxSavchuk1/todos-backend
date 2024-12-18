import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { pick } from 'lodash';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const testUser = {
    firstName: 'test',
    lastName: 'test',
    email: `${Date.now()}@test.test`,
    password: '123456',
  };
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users/create (POST)', async () => {
    return request(app.getHttpServer())
      .post('/users/create')
      .send(testUser)
      .expect(201);
  });

  it('/auth/login (POST)', async () => {
    const loginDto = pick(testUser, 'email', 'password');

    const expectedResponse = {
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    };

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .expect((response) => {
        token = response.body.access_token;
        expect(response.body).toEqual(expectedResponse);
      });
  });

  it('/todos/create (POST)', async () => {
    const todoDto = {
      title: 'Test title',
      body: 'Test body',
    };

    return request(app.getHttpServer())
      .post('/todos/create')
      .set('Authorization', `Bearer ${token}`)
      .send(todoDto)
      .expect(201);
  });

  it('/users (GET)', async () => {
    return request(app.getHttpServer())
      .get('/users?limit=1&offset=1')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });
});
