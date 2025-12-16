import { test, expect, request as playwrightRequest } from '@playwright/test';

/**
 * Black-box tests for backend HTTP API.
 * - No imports from NestJS code.
 * - Validates inputs/outputs + error codes.
 */

test.describe('Backend API (blackbox)', () => {
  const backendBaseURL = process.env.E2E_BACKEND_URL || 'http://127.0.0.1:3001';

  test('POST /auth/login with invalid credentials -> 401', async () => {
    const api = await playwrightRequest.newContext({ baseURL: backendBaseURL });

    const res = await api.post('/auth/login', {
      data: { email: 'does-not-exist@example.com', password: 'wrong' },
    });

    expect(res.status()).toBe(401);
    await api.dispose();
  });

  test('POST /auth/register -> 201 and body does NOT include password', async () => {
    const api = await playwrightRequest.newContext({ baseURL: backendBaseURL });
    const uniqueEmail = `bb_${Date.now()}@example.com`;

    const res = await api.post('/auth/register', {
      data: { name: 'BB User', email: uniqueEmail, password: 'secret123' },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();

    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: 'BB User',
        email: uniqueEmail,
        role: 'user',
      }),
    );
    expect(body.password).toBeUndefined();

    await api.dispose();
  });

  test('GET /products/999999 -> 404', async () => {
    const api = await playwrightRequest.newContext({ baseURL: backendBaseURL });

    const res = await api.get('/products/999999');
    expect(res.status()).toBe(404);

    await api.dispose();
  });

  test('Orders: POST /orders -> GET /orders/:id -> DELETE /orders/:id', async () => {
    const api = await playwrightRequest.newContext({ baseURL: backendBaseURL });

    const createRes = await api.post('/orders', {
      data: {
        customerEmail: `bb_${Date.now()}@example.com`,
        status: 'created',
        total: 10.5,
        items: '[]',
      },
    });

    expect(createRes.status()).toBe(201);
    const created = await createRes.json();
    expect(created.id).toBeTruthy();

    const id = created.id;

    const getRes = await api.get(`/orders/${id}`);
    expect(getRes.status()).toBe(200);

    const delRes = await api.delete(`/orders/${id}`);
    expect(delRes.status()).toBe(200);
    expect(await delRes.json()).toEqual({ ok: true });

    const getAfterDel = await api.get(`/orders/${id}`);
    expect(getAfterDel.status()).toBe(404);

    await api.dispose();
  });
});
