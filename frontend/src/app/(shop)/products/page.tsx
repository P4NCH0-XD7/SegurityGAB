'use client';

import { useState, useEffect } from 'react';

import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";

export default function ProductsPage() {
    const addItem = useCartStore((state) => state.addItem);

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

    const getDisplayImageUrl = (url?: string) => {
        if (!url) return "";
        const driveMatch = url.match(/(?:\/file\/d\/|id=)([a-zA-Z0-9_-]+)/);
        if (driveMatch && driveMatch[1]) {
            return `https://drive.usercontent.google.com/download?id=${driveMatch[1]}&export=view`;
        }
        return url;
    };

    useEffect(() => {
        const fetchAllVisibleProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/products`);
                if (res.ok) {
                    const data = await res.json();
                    const visible = data
                      .filter((p: any) => p.status === 'visible')
                      .map((p: any) => ({
                          id: p.id,
                          title: p.name,
                          price: `$${Number(p.price).toLocaleString('es-CO')}`,
                          image: getDisplayImageUrl(p.imageUrl) || "/products/placeholder.png", // fallback image
                      }));
                    setProducts(visible);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllVisibleProducts();
    }, [API_URL]);

    const handleAddToCart = (product: any) => {
        addItem(product);
        toast.success(`${product.title} añadido al carrito`);
    };

    return (
        <div style={{ background: 'var(--surface)' }}>
            <Navbar />
            <main className="container" style={{ padding: '80px 1.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Nuestro Catálogo</h1>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--on-surface-variant)', fontSize: '1.25rem' }}>
                        Cargando catálogo...
                    </div>
                ) : products.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                        {products.map(product => (
                            <div key={product.id} className="product-card" style={{ background: 'var(--surface-lowest)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                                <div style={{ height: '240px', background: 'var(--surface-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    <img 
                                        src={product.image} 
                                        alt={product.title} 
                                        referrerPolicy="no-referrer"
                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }} 
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/products/placeholder.png";
                                        }}
                                    />
                                </div>
                                <div style={{ padding: '2rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>{product.title}</h3>
                                    <p style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '1.5rem' }}>{product.price}</p>
                                    <button 
                                        onClick={() => handleAddToCart(product)}
                                        className="btn btn-primary" 
                                        style={{ width: '100%', padding: '1rem', cursor: 'pointer' }}
                                    >
                                        Comprar ahora
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--on-surface-variant)', fontSize: '1.25rem' }}>
                        No hay productos disponibles en el catálogo.
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
