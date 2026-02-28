'use client';

import { useEffect, useState } from 'react';
import { products, categories as getCategories, cart as cartApi } from '@/lib/api';
import { AppHeader } from '@/app/components/AppHeader';
import { useAuthSession } from '@/lib/use-auth-session';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  images?: string[];
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { isAuthenticated } = useAuthSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          products.getAll(),
          getCategories.getAll(),
        ]);
        setProductList(productsRes.data.products || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addToCart = async (product: Product) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    setAddingToCart(product.id);
    try {
      await cartApi.addItem({
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl || product.images?.[0] || '',
        quantity: 1,
        price: product.price,
      });
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

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
        <h1 className="text-3xl font-bold mb-8">Products</h1>

        {categories.length > 0 && (
          <div className="mb-6 flex gap-2 flex-wrap">
            <button className="px-4 py-2 bg-primary text-white rounded-full text-sm">
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="px-4 py-2 bg-gray-200 rounded-full text-sm hover:bg-gray-300"
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {productList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available</p>
            <p className="text-gray-400">Check back later for new products</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList.map((product) => {
              const productImage = product.imageUrl || product.images?.[0];

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="aspect-square bg-gray-200 relative">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">${product.price}</span>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={addingToCart === product.id}
                        className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90 disabled:opacity-50"
                      >
                        {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
