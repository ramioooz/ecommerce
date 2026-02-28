'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { users } from '@/lib/api';
import { useAuthSession } from '@/lib/use-auth-session';

export function AppHeader() {
  const router = useRouter();
  const { accessToken, isHydrated, isAuthenticated, user, setUser, logout } = useAuthSession();

  useEffect(() => {
    const hasUserIdentity = Boolean(user?.firstName || user?.email);
    if (!isHydrated || !isAuthenticated || hasUserIdentity) {
      return;
    }

    users.getProfile()
      .then((res) => {
        if (res?.data?.id) {
          setUser({
            id: res.data.id,
            email: res.data.email,
            firstName: res.data.firstName || '',
            lastName: res.data.lastName || '',
            role: res.data.role || 'customer',
          });
        }
      })
      .catch(() => {
        // Keep UI stable; global API interceptor handles unauthorized cases.
      });
  }, [isHydrated, isAuthenticated, user?.firstName, user?.email, setUser]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  let displayName = user?.firstName || user?.email || 'User';
  if (displayName === 'User' && accessToken) {
    try {
      const base64Url = accessToken.split('.')[1] || '';
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const padding = '='.repeat((4 - (base64.length % 4)) % 4);
      const payload = JSON.parse(
        atob(base64 + padding),
      ) as { email?: string };
      displayName = payload.email || displayName;
    } catch {
      // Keep default fallback.
    }
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="text-2xl font-bold">
          E-Shop
        </Link>

        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <Link href="/products" className="hover:text-primary">
              Products
            </Link>
            <Link href="/cart" className="hover:text-primary">
              Cart
            </Link>
            <Link href="/orders" className="hover:text-primary">
              Orders
            </Link>
            <Link href="/profile" className="hover:text-primary">
              Profile
            </Link>
          </nav>

          {isHydrated && (
            isAuthenticated ? (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-600">
                  Signed in as <span className="font-semibold text-gray-900">{displayName}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 border border-red-300 text-red-600 rounded hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm">
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 border rounded hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-1.5 bg-primary text-white rounded hover:bg-primary/90"
                >
                  Register
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}
