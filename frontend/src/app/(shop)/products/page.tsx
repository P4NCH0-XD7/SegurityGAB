'use client';

import { useState, useEffect } from 'react';

import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import { formatPrice } from '@/utils/formatters';

export default function ProductsPage() {
    const addItem = useCartStore((state) => state.addItem);

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);
    const [activeCat, setActiveCat] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const ITEMS_PER_PAGE = 6;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

    const getDisplayImageUrl = (url?: string) => {
        if (!url) return "";
        const isDrive = url.match(/(?:\/file\/d\/|id=)([a-zA-Z0-9_-]+)/);
        const isGithubBlob = url.match(/github\.com\/[^/]+\/[^/]+\/blob\//);
        if (isDrive || isGithubBlob) {
            return `${API_URL}/products/image-proxy?url=${encodeURIComponent(url)}`;
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
                          description: p.description,
                          price: Number(p.price),
                          stock: Number(p.stock),
                          image: getDisplayImageUrl(p.imageUrl) || "/products/placeholder.png", // fallback image
                          categoryId: p.categoryId ?? (p.category && p.category.id) ?? null,
                          categoryName: (p.category && p.category.name) || ''
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

    useEffect(() => {
    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/categories`);
            if (res.ok) {
                const data = await res.json();
                setCategories(data || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    fetchCategories();
    }, [API_URL]);

    const handleAddToCart = (product: any) => {
        addItem(product);
        toast.success(`${product.title} añadido al carrito`);
    };

    const filteredProducts = activeCat ? products.filter(p => p.categoryId === activeCat) : products;
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [activeCat, products]);

    return (
        <div style={{ background: 'var(--surface)' }}>
            <Navbar />
            <main className="container" style={{ padding: '80px 1.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Nuestro Catálogo</h1>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--on-surface-variant)', fontSize: '1.25rem' }}>
                        Cargando catálogo...
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <select value={activeCat ?? ''} onChange={e => setActiveCat(e.target.value ? Number(e.target.value) : null)}
                                style={{ padding: '0.6rem 0.9rem', borderRadius: '0.6rem', border: '1px solid var(--surface-high)', background: 'var(--surface-low)', color: 'var(--on-surface)', fontWeight: 700 }}>
                                <option value="">Todas las categorías</option>
                                {categories.map((c: any) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                            {displayedProducts.map(product => (
                                <div key={product.id} className="product-card" style={{ background: 'var(--surface-lowest)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
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
                                    <div style={{ padding: '2rem', paddingBottom: '1rem' }}>

                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{product.title}</h3>
                                    <p style={{ 
                                        fontSize: '0.85rem', 
                                        color: 'var(--on-surface-variant)', 
                                        marginBottom: '1rem',
                                        display: '-webkit-box',
                                        WebkitLineClamp: '3',
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                        minHeight: '3.6rem',
                                        lineHeight: '1.2'
                                    }}>
                                        {product.description || "Sin descripción disponible"}
                                    </p>
                                    <p style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '0.25rem' }}>{formatPrice(product.price)}</p>
                                    <p style={{ fontSize: '0.7rem', color: product.stock > 0 ? 'var(--secondary)' : 'var(--error)', fontWeight: '600' }}>
                                        {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                                    </p>
                                    </div>
                                </Link>
                                <div style={{ padding: '0 2rem 2rem 2rem', marginTop: 'auto' }}>
                                    <button 
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.stock <= 0}
                                        className="btn btn-primary" 
                                        style={{ 
                                            width: '100%', 
                                            padding: '1rem', 
                                            cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                                            opacity: product.stock > 0 ? 1 : 0.5
                                        }}
                                    >
                                        {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>

                        <div style={{ display:'flex', justifyContent:'center', gap:'0.5rem', marginTop:'1.5rem', alignItems:'center' }}>
                            <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}
                                style={{ padding:'0.45rem 0.75rem', borderRadius:'0.5rem', border:'1px solid var(--surface-high)', background: currentPage===1 ? 'var(--surface-low)' : 'var(--primary)', color: currentPage===1 ? 'var(--on-surface-variant)' : 'white', cursor: currentPage===1 ? 'not-allowed' : 'pointer' }}>
                                « Anterior
                            </button>

                            {Array.from({length: totalPages}, (_, i) => i+1).map(pg => (
                                <button key={pg} onClick={() => setCurrentPage(pg)}
                                    style={{ padding:'0.45rem 0.75rem', borderRadius:'0.5rem', border:'1px solid var(--surface-high)', background: pg===currentPage ? 'var(--primary)' : 'var(--surface-low)', color: pg===currentPage ? 'white' : 'var(--on-surface)', cursor: 'pointer' }}>
                                    {pg}
                                </button>
                            ))}

                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}
                                style={{ padding:'0.45rem 0.75rem', borderRadius:'0.5rem', border:'1px solid var(--surface-high)', background: currentPage===totalPages ? 'var(--surface-low)' : 'var(--primary)', color: currentPage===totalPages ? 'var(--on-surface-variant)' : 'white', cursor: currentPage===totalPages ? 'not-allowed' : 'pointer' }}>
                                Siguiente »
                            </button>
                        </div>

                        </>
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
