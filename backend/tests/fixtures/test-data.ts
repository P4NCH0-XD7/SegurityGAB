/**
 * Shared test fixtures.
 * Keep these values stable so unit/functional/blackbox tests are consistent.
 */

export const testUsers = {
  alice: {
    name: 'Alice Test',
    email: 'alice.test@example.com',
    password: 'secret123',
    role: 'user' as const,
  },
  admin: {
    name: 'Admin Test',
    email: 'admin.test@example.com',
    password: 'secret123',
    role: 'admin' as const,
  },
};

export const testProducts = {
  camera1: {
    name: 'Camara Test 1',
    description: 'Desc test',
    price: 10.5,
    stock: 5,
    image: '/uploads/x.png',
    long_description: 'Long test',
    model: 'M1',
  },
  camera2: {
    name: 'Camara Test 2',
    description: 'Desc test 2',
    price: 20.0,
    stock: 2,
    image: '/uploads/y.png',
    long_description: 'Long test 2',
    model: 'M2',
  },
};

export const testOrders = {
  order1: {
    customerEmail: testUsers.alice.email,
    status: 'created',
    total: 31.0,
    items: JSON.stringify([
      { productModel: testProducts.camera1.model, quantity: 1, price: testProducts.camera1.price },
      { productModel: testProducts.camera2.model, quantity: 1, price: testProducts.camera2.price },
    ]),
  },
};
