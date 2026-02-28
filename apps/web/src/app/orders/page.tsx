'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { orders } from '@/lib/api';
import { AppHeader } from '@/app/components/AppHeader';
import { useAuthSession } from '@/lib/use-auth-session';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: string | number;
  items: OrderItem[];
  shippingAddress: string | null;
  createdAt: string;
}

export default function OrdersPage() {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const { isAuthenticated, isHydrated } = useAuthSession();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isHydrated]);

  const fetchOrders = async () => {
    try {
      const response = await orders.getAll();
      const rawOrders = Array.isArray(response.data) ? response.data : [];
      const normalizedOrders = rawOrders.map((order: Partial<Order>) => ({
        id: order.id || '',
        orderNumber: order.orderNumber || 'N/A',
        status: order.status || 'pending',
        total: order.total ?? 0,
        items: Array.isArray(order.items) ? order.items : [],
        shippingAddress: order.shippingAddress || null,
        createdAt: order.createdAt || new Date(0).toISOString(),
      }));
      setOrderList(normalizedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrderList([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(orderId);
    try {
      await orders.cancel(orderId);
      await fetchOrders();
    } catch (error) {
      alert('Failed to cancel order');
    } finally {
      setCancelling(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view your orders</h1>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orderList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No orders yet</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orderList.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="border-t border-b py-4 my-4">
                  {(order.items || []).map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between py-2"
                    >
                      <span>
                        {item.productName} x {item.quantity}
                      </span>
                      <span>${item.total}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Shipping Address</p>
                    <p className="font-medium">{order.shippingAddress || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-xl font-bold">${order.total}</p>
                  </div>
                </div>

                {order.status === 'pending' && (
                  <div className="mt-4 pt-4 border-t flex justify-end">
                    <button
                      onClick={() => cancelOrder(order.id)}
                      disabled={cancelling === order.id}
                      className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 disabled:opacity-50"
                    >
                      {cancelling === order.id ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
