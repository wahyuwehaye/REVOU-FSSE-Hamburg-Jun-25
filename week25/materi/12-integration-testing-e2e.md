# Integration Testing (E2E)

## 🤔 What is Integration Testing?

**Analogi:**
- **Unit Test** 🔧 = Test satu part mobil (steering wheel, engine)
- **Integration Test** 🚗 = Test mobil lengkap (apakah bisa jalan?)

**Integration/E2E Test** = Test **multiple components together** dengan **real HTTP requests**.

---

## 🧪 E2E Testing with Supertest

### Setup
```typescript
// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ name: 'John', email: 'john@email.com' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('John');
      });
  });

  it('/users (POST) - validation error', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ name: 'John' }) // Missing email
      .expect(400);
  });
});
```

---

## 🔐 Testing with Authentication

```typescript
describe('Protected routes', () => {
  let authToken: string;

  beforeAll(async () => {
    // Login to get token
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@email.com', password: 'password' });

    authToken = response.body.accessToken;
  });

  it('should access protected route with token', () => {
    return request(app.getHttpServer())
      .get('/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('should reject without token', () => {
    return request(app.getHttpServer())
      .get('/users/profile')
      .expect(401);
  });
});
```

---

## 📝 Summary

**E2E Tests:**
- 🌐 Test complete HTTP flow
- 🔗 Test multiple components together
- 🐢 Slower than unit tests
- 💰 More expensive to maintain
- ✅ High confidence

**Best Practices:**
- ✅ Test critical user flows
- ✅ Test authentication/authorization
- ✅ Use in-memory database
- ✅ Clean database between tests
- ❌ Don't test every single endpoint

---

## 🔗 Next Steps
- **Materi 13:** Testing Best Practices
- **Materi 14:** Debugging Tests
