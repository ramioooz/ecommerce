const supertest = require('supertest');
const axios = require('axios');

describe('E2E Tests', () => {
  const BASE_URL = 'http://localhost:20000';
  const API = supertest(BASE_URL);
  
  let authToken;
  let userId;
  let productId;
  let categoryId;
  let orderId;
  let cartId;

  // Test user credentials
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User'
  };

  describe('Auth Flow', () => {
    it('should register a new user', async () => {
      const res = await API.post('/auth/register')
        .send(testUser)
        .expect(201);
      
      expect(res.body.user).toBeDefined();
      expect(res.body.accessToken).toBeDefined();
      userId = res.body.user.id;
    });

    it('should login the user', async () => {
      const res = await API.post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);
      
      expect(res.body.user).toBeDefined();
      expect(res.body.accessToken).toBeDefined();
      authToken = res.body.accessToken;
    });
  });

  describe('Product Management', () => {
    it('should create a category', async () => {
      const res = await API.post('/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Electronics',
          slug: 'electronics',
          description: 'Electronic products'
        })
        .expect(201);
      
      expect(res.body.id).toBeDefined();
      categoryId = res.body.id;
    });

    it('should create a product', async () => {
      const res = await API.post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Product',
          description: 'A test product',
          slug: 'test-product',
          sku: 'TEST-001',
          price: 99.99,
          stock: 10,
          categoryId: categoryId
        })
        .expect(201);
      
      expect(res.body.id).toBeDefined();
      productId = res.body.id;
    });

    it('should get products', async () => {
      const res = await API.get('/products')
        .expect(200);
      
      expect(res.body.products).toBeDefined();
      expect(Array.isArray(res.body.products)).toBe(true);
    });
  });

  describe('Shopping Cart', () => {
    it('should add item to cart', async () => {
      const res = await API.post('/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: productId,
          productName: 'Test Product',
          quantity: 1,
          price: 99.99
        })
        .expect(201);
      
      expect(res.body.id).toBeDefined();
      cartId = res.body.id;
    });

    it('should get cart', async () => {
      const res = await API.get('/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(res.body.total).toBe('99.99');
    });
  });

  describe('Order Processing', () => {
    it('should create an order', async () => {
      // First create an address
      await API.post('/users/addresses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          street: '123 Main St',
          city: 'Test City',
          state: 'TS',
          country: 'USA',
          zipCode: '12345'
        })
        .expect(201);

      // Get address ID
      const addressRes = await API.get('/users/addresses')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      const addressId = addressRes.body[0].id;

      const res = await API.post('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [{
            productId: productId,
            productName: 'Test Product',
            quantity: 1,
            price: 99.99
          }],
          shippingAddressId: addressId
        })
        .expect(201);
      
      expect(res.body.id).toBeDefined();
      orderId = res.body.id;
    });

    it('should get order details', async () => {
      const res = await API.get(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(res.body.id).toBe(orderId);
      expect(res.body.status).toBe('pending');
    });
  });

  describe('Payment Processing', () => {
    it('should initiate payment', async () => {
      const res = await API.post('/payments/checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          orderId: orderId,
          paymentMethod: 'stripe'
        })
        .expect(201);
      
      expect(res.body.id).toBeDefined();
    });

    it('should get payment status', async () => {
      const res = await API.get(`/payments/${orderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(res.body.orderId).toBe(orderId);
    });
  });

  describe('User Profile', () => {
    it('should get user profile', async () => {
      const res = await API.get('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(res.body.id).toBe(userId);
      expect(res.body.email).toBe(testUser.email);
    });

    it('should get user addresses', async () => {
      const res = await API.get('/users/addresses')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get user orders', async () => {
      const res = await API.get('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // Cleanup
  afterAll(async () => {
    // Delete test data if needed
    console.log('Test suite completed');
  });
});