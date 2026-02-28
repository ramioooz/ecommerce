'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { users } from '@/lib/api';
import { AppHeader } from '@/app/components/AppHeader';
import { useAuthSession } from '@/lib/use-auth-session';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { logout, isAuthenticated, isHydrated } = useAuthSession();
  const [profile, setProfile] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (isAuthenticated) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isHydrated]);

  const fetchProfile = async () => {
    try {
      const [profileRes, addressesRes] = await Promise.all([
        users.getProfile(),
        users.getAddresses(),
      ]);
      setProfile(profileRes.data);
      setAddresses(addressesRes.data || []);
      setFormData({
        firstName: profileRes.data.firstName,
        lastName: profileRes.data.lastName,
        phone: profileRes.data.phone || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await users.updateProfile(formData);
      setProfile({ ...profile!, ...formData });
      setEditing(false);
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const addAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      street: (form.elements.namedItem('street') as HTMLInputElement).value,
      city: (form.elements.namedItem('city') as HTMLInputElement).value,
      state: (form.elements.namedItem('state') as HTMLInputElement).value,
      zipCode: (form.elements.namedItem('zipCode') as HTMLInputElement).value,
      country: (form.elements.namedItem('country') as HTMLInputElement).value,
      isDefault: addresses.length === 0,
    };
    try {
      await users.addAddress(data);
      await fetchProfile();
      form.reset();
    } catch (error) {
      alert('Failed to add address');
    }
  };

  const deleteAddress = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    try {
      await users.deleteAddress(id);
      await fetchProfile();
    } catch (error) {
      alert('Failed to delete address');
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
          <h1 className="text-2xl font-bold mb-4">Please login to view your profile</h1>
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
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50"
            >
              Logout
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="text-primary hover:underline"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">
                    {profile?.firstName} {profile?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{profile?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{profile?.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium capitalize">{profile?.role}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Addresses</h2>
            
            {addresses.length > 0 && (
              <div className="space-y-4 mb-6">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="border p-4 rounded-lg flex justify-between items-start"
                  >
                    <div>
                      {addr.isDefault && (
                        <span className="text-xs bg-primary text-white px-2 py-1 rounded mr-2">
                          Default
                        </span>
                      )}
                      <p className="font-medium">{addr.street}</p>
                      <p className="text-gray-600">
                        {addr.city}, {addr.state} {addr.zipCode}
                      </p>
                      <p className="text-gray-600">{addr.country}</p>
                    </div>
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={addAddress} className="border-t pt-4">
              <h3 className="font-medium mb-4">Add New Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <input
                    name="street"
                    placeholder="Street Address"
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <input
                  name="city"
                  placeholder="City"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  name="state"
                  placeholder="State"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  name="zipCode"
                  placeholder="Zip Code"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  name="country"
                  placeholder="Country"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Add Address
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
