'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cart as cartApi } from '@/lib/api';
import { AppHeader } from '@/app/components/AppHeader';
import { useAuthSession } from '@/lib/use-auth-session';

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  total: number;
}

interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { isAuthenticated, isHydrated } = useAuthSession();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (isAuthenticated) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isHydrated]);

  const fetchCart = async () => {
    try {
      const response = await cartApi.get();
      const cartData = response.data || {};
      setCart({
        ...cartData,
        items: cartData.items || [],
      });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    setUpdating(productId);
    try {
      await cartApi.updateItem(productId, { quantity });
      await fetchCart();
    } catch (error) {
      alert('Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (productId: string) => {
    setUpdating(productId);
    try {
      await cartApi.removeItem(productId);
      await fetchCart();
    } catch (error) {
      alert('Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clear();
      await fetchCart();
    } catch (error) {
      alert('Failed to clear cart');
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
          <h1 className="text-2xl font-bold mb-4">Please login to view your cart</h1>
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
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {!cart || (cart.items?.length ?? 0) === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {(cart.items || []).map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg shadow-sm flex gap-4"
                >
                  <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.productName}</h3>
                    <p className="text-gray-600">${item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={updating === item.productId}
                        className="w-8 h-8 border rounded hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={updating === item.productId}
                        className="w-8 h-8 border rounded hover:bg-gray-50"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        disabled={updating === item.productId}
                        className="ml-4 text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="font-semibold">${item.total}</div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cart.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${cart.total}</span>
                </div>
              </div>
              <Link
                href="/orders"
                className="block w-full py-3 bg-primary text-white text-center rounded-lg hover:bg-primary/90"
              >
                Checkout
              </Link>
              <button
                onClick={clearCart}
                className="block w-full mt-2 py-2 text-red-600 text-center hover:underline"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
