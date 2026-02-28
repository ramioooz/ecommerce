export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
}

export const KAFKA_TOPICS = {
  USER_REGISTERED: 'user.registered',
  USER_UPDATED: 'user.updated',
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_CANCELLED: 'order.cancelled',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  PRODUCT_OUT_OF_STOCK: 'product.out_of_stock',
  PRODUCT_RESTOCKED: 'product.restocked',
} as const;

export const API_VERSIONS = {
  V1: 'v1',
} as const;

export const REDIS_KEYS = {
  SESSION_PREFIX: 'session:',
  REFRESH_TOKEN_PREFIX: 'refresh:',
  RATE_LIMIT_PREFIX: 'rate_limit:',
  PRODUCT_CACHE_PREFIX: 'product:',
  CATEGORY_CACHE_PREFIX: 'category:',
} as const;
