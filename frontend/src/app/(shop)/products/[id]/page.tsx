'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import { useParams } from 'next/navigation';
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import Link from 'next/link';

export default function ProductDetailPage() {
    const params = useParams();
    const productId = params?.id;

    const addItem = useCartStore((state) => state.addItem);

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
        const fetchProduct = async () => {
            if (!productId) return;
            try {
                const res = await fetch(`${API_URL}/products/${productId}`);
                if (res.ok) {
                    const p = await res.json();
                    setProduct({
                        id: p.id,
                        title: p.name,
                        description: p.description,
                        rawPrice: Number(p.price),
                        price: `$${Number(p.price).toLocaleString('es-CO')}`,
                        image: getDisplayImageUrl(p.imageUrl) || "/products/placeholder.png",
                        sku: p.sku,
                        stock: p.stock
                    });
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId, API_URL]);

    const handleAddToCart = () => {
        if (product) {
            addItem(product);
            toast.success(`${product.title} añadido al carrito`);
        }
    };

    return (
        <div style={{ background: 'var(--surface)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            
            <main className="container" style={{ padding: '40px 1.5rem', flex: 1 }}>
                <Link href="/products" style={{ color: 'var(--primary)', fontWeight: '600', display: 'inline-block', marginBottom: '2rem' }}>
                    &larr; Volver al catálogo
                </Link>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--on-surface-variant)', fontSize: '1.25rem' }}>
                        Cargando información del producto...
                    </div>
                ) : product ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'start' }} className="product-detail-grid">
                        <style dangerouslySetInnerHTML={{__html: `
                            @media (min-width: 768px) {
                                .product-detail-grid {
                                    grid-template-columns: 1fr 1fr !important;
                                }
                            }
                        `}} />
                        <div style={{ 
                            background: 'var(--surface-lowest)', 
                            borderRadius: 'var(--radius-lg)', 
                            padding: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '400px'
                        }}>
                            <img 
                                src={product.image} 
                                alt={product.title} 
                                referrerPolicy="no-referrer"
                                style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.15))' }} 
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/products/placeholder.png";
                                }}
                            />
                        </div>

                        <div>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--on-surface)' }}>{product.title}</h1>
                            {product.sku && (
                                <p style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)', marginBottom: '1.5rem', fontFamily: 'monospace' }}>
                                    SKU: {product.sku}
                                </p>
                            )}
                            
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '2rem' }}>
                                {product.price}
                            </div>
                            
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--on-surface)' }}>Descripción del Producto</h3>
                                <p style={{ 
                                    fontSize: '1rem', 
                                    lineHeight: '1.6', 
                                    color: 'var(--on-surface-variant)',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {product.description || "Este producto no tiene una descripción detallada disponible."}
                                </p>
                            </div>

                            <div style={{ padding: '1.5rem', background: 'var(--surface-low)', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--on-surface-variant)' }}>Disponibilidad:</span>
                                    <span style={{ fontWeight: '700', color: product.stock > 0 ? 'var(--secondary)' : 'var(--error)' }}>
                                        {product.stock > 0 ? `En stock (${product.stock} unidades)` : 'Agotado'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--on-surface-variant)' }}>Envío:</span>
                                    <span style={{ fontWeight: '700', color: 'var(--on-surface)' }}>Gratis a nivel nacional</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className="btn btn-primary" 
                                style={{ 
                                    width: '100%', 
                                    padding: '1.25rem', 
                                    fontSize: '1.1rem',
                                    cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                                    opacity: product.stock > 0 ? 1 : 0.5
                                }}
                            >
                                {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--on-surface-variant)', fontSize: '1.25rem' }}>
                        Producto no encontrado.
                    </div>
                )}
            </main>
            
            <Footer />
        </div>
    );
}
