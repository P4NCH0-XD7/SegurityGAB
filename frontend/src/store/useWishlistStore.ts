import { create } from 'zustand';

interface WishlistProduct {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  stock: number;
  status: string;
  category?: { id: number; name: string };
}

interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  addedAt: string;
  product: WishlistProduct;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  fetchWishlist: (token: string) => Promise<void>;
  addToWishlist: (productId: number, token: string) => Promise<void>;
  removeFromWishlist: (wishlistId: number, token: string) => Promise<void>;
  checkInWishlist: (productId: number, token: string) => Promise<{ inWishlist: boolean; wishlistId: number | null }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  loading: false,

  fetchWishlist: async (token: string) => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}/wishlist/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        set({ items: data });
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      set({ loading: false });
    }
  },

  addToWishlist: async (productId: number, token: string) => {
    const res = await fetch(`${API_URL}/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al agregar a favoritos');
    }

    const newItem: WishlistItem = await res.json();
    set({ items: [newItem, ...get().items] });
  },

  removeFromWishlist: async (wishlistId: number, token: string) => {
    const res = await fetch(`${API_URL}/wishlist/${wishlistId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Error al eliminar de favoritos');

    set({ items: get().items.filter((item) => item.id !== wishlistId) });
  },

  checkInWishlist: async (productId: number, token: string) => {
    const res = await fetch(`${API_URL}/wishlist/check/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return res.json();
    return { inWishlist: false, wishlistId: null };
  },
}));
