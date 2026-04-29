'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/shop/Navbar';
import Footer from '@/components/shop/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHeart, FaTrash, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { useAuthStore } from '@/store/useAuthStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';
import { formatPrice } from '@/utils/formatters';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function WishlistPage() {
    const router = useRouter();
    const { user, token, isAuthenticated, isInitialized, checkAuth } = useAuthStore();
    const { items, loading, fetchWishlist, removeFromWishlist } = useWishlistStore();
    const { addItem } = useCartStore();

    const [search, setSearch] = useState('');
    const [removingId, setRemovingId] = useState<number | null>(null);

    // Inicializar auth y redirigir si no está autenticado
    useEffect(() => {
        if (!isInitialized) checkAuth();
    }, [isInitialized, checkAuth]);

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push('/login?redirect=/wishlist');
        }
    }, [isInitialized, isAuthenticated, router]);

    // Cargar wishlist cuando el token esté disponible
    useEffect(() => {
        if (isAuthenticated && token) {
            fetchWishlist(token);
        }
    }, [isAuthenticated, token]);

    // Imagen con proxy para Google Drive / GitHub
    const getDisplayImageUrl = (url?: string) => {
        if (!url) return '/products/placeholder.png';
        const isDrive = url.match(/(?:\/file\/d\/|id=)([a-zA-Z0-9_-]+)/);
        const isGithubBlob = url.match(/github\.com\/[^/]+\/[^/]+\/blob\//);
        if (isDrive || isGithubBlob) {
            return `${API_URL}/products/image-proxy?url=${encodeURIComponent(url)}`;
        }
        return url;
    };

    // Filtrar por búsqueda
    const filtered = items.filter(item =>
        item.product.name.toLowerCase().includes(search.toLowerCase())
    );

    // Eliminar de favoritos
    const handleRemove = async (wishlistId: number, productName: string) => {
        if (!token) return;
        setRemovingId(wishlistId);
        try {
            await removeFromWishlist(wishlistId, token);
            toast.success(`"${productName}" eliminado de favoritos`);
        } catch {
            toast.error('Error al eliminar de favoritos');
        } finally {
            setRemovingId(null);
        }
    };

    // Agregar al carrito desde wishlist
    const handleAddToCart = (item: any) => {
        if (item.product.stock <= 0) {
            toast.error('Este producto no tiene stock disponible');
            return;
        }
        addItem({
            id:    item.product.id,
            title: item.product.name,
            price: Number(item.product.price),
            image: getDisplayImageUrl(item.product.imageUrl),
        });
        toast.success(`"${item.product.name}" añadido al carrito`);
    };

    // Estado: no autenticado
    if (!isInitialized || !isAuthenticated) {
        return (
            <div style={{ background: 'var(--surface)', minHeight: '100vh' }}>
                <Navbar />
                <main className="container" style={{ padding: '120px 1.5rem', textAlign: 'center' }}>
                    <div style={{ color: 'var(--on-surface-variant)', fontSize: '1.1rem' }}>
                        Verificando sesión...
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Estado: cargando
    if (loading) {
        return (
            <div style={{ background: 'var(--surface)', minHeight: '100vh' }}>
                <Navbar />
                <main className="container" style={{ padding: '120px 1.5rem', textAlign: 'center' }}>
                    <div style={{ color: 'var(--on-surface-variant)', fontSize: '1.1rem' }}>
                        Cargando tu lista de deseos...
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Estado: lista vacía
    if (!loading && items.length === 0) {
        return (
            <div style={{ background: 'var(--surface)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <main className="container" style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', padding: '100px 1.5rem'
                }}>
                    <div style={{
                        background: 'var(--surface-low)', width: '120px', height: '120px',
                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', marginBottom: '2rem', color: 'var(--outline-variant)'
                    }}>
                        <FaHeart size={48} />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        Tu lista de deseos está vacía
                    </h1>
                    <p style={{ color: 'var(--on-surface-variant)', marginBottom: '2.5rem' }}>
                        Guarda los productos que te interesan para encontrarlos fácilmente.
                    </p>
                    <Link href="/products" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
                        Explorar Productos
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--surface)', minHeight: '100vh' }}>
            <Navbar />

            <main className="container" style={{ padding: '80px 1.5rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                            Mi Lista de Deseos
                        </h1>
                        <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem' }}>
                            {items.length} {items.length === 1 ? 'producto guardado' : 'productos guardados'}
                        </p>
                    </div>

                    {/* Buscador */}
                    <div style={{ position: 'relative' }}>
                        <FaSearch style={{
                            position: 'absolute', left: '14px', top: '50%',
                            transform: 'translateY(-50%)', color: 'var(--outline-variant)'
                        }} />
                        <input
                            type="text"
                            placeholder="Buscar en favoritos..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                padding: '0.75rem 1rem 0.75rem 2.75rem',
                                borderRadius: '2rem',
                                border: 'none',
                                background: 'var(--surface-low)',
                                color: 'var(--on-surface)',
                                width: '260px',
                                fontSize: '0.9rem',
                                outline: 'none',
                            }}
                        />
                    </div>
                </div>

                {/* Sin resultados de búsqueda */}
                {filtered.length === 0 && search && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--on-surface-variant)' }}>
                        No se encontraron productos con "{search}"
                    </div>
                )}

                {/* Grid de productos */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2.5rem'
                }}>
                    {filtered.map(item => {
                        const product  = item.product;
                        const imgUrl   = getDisplayImageUrl(product.imageUrl);
                        const inStock  = product.stock > 0;
                        const isRemoving = removingId === item.id;

                        return (
                            <div
                                key={item.id}
                                style={{
                                    background: 'var(--surface-lowest)',
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    opacity: isRemoving ? 0.5 : 1,
                                    transition: 'opacity 0.2s ease',
                                    position: 'relative',
                                }}
                            >
                                {/* Botón eliminar favorito */}
                                <button
                                    onClick={() => handleRemove(item.id, product.name)}
                                    disabled={isRemoving}
                                    title="Eliminar de favoritos"
                                    style={{
                                        position: 'absolute', top: '12px', right: '12px',
                                        width: '36px', height: '36px', borderRadius: '50%',
                                        border: 'none', background: 'rgba(255,255,255,0.9)',
                                        color: 'var(--error)', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                        transition: 'transform 0.15s ease',
                                    }}
                                >
                                    <FaHeart size={16} />
                                </button>

                                {/* Badge sin stock */}
                                {!inStock && (
                                    <div style={{
                                        position: 'absolute', top: '12px', left: '12px',
                                        background: 'var(--error)', color: 'white',
                                        fontSize: '0.7rem', fontWeight: '700',
                                        padding: '0.25rem 0.6rem', borderRadius: '2rem',
                                        zIndex: 10,
                                    }}>
                                        Agotado
                                    </div>
                                )}

                                {/* Imagen */}
                                <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{
                                        height: '220px', background: 'var(--surface-high)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        overflow: 'hidden',
                                    }}>
                                        <img
                                            src={imgUrl}
                                            alt={product.name}
                                            referrerPolicy="no-referrer"
                                            style={{
                                                maxWidth: '100%', maxHeight: '100%',
                                                objectFit: 'contain',
                                                filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.1))',
                                            }}
                                            onError={e => { (e.target as HTMLImageElement).src = '/products/placeholder.png'; }}
                                        />
                                    </div>

                                    {/* Info producto */}
                                    <div style={{ padding: '1.5rem', paddingBottom: '1rem' }}>
                                        {product.category && (
                                            <span style={{
                                                fontSize: '0.72rem', fontWeight: '700',
                                                color: 'var(--primary)', textTransform: 'uppercase',
                                                letterSpacing: '0.06em',
                                            }}>
                                                {product.category.name}
                                            </span>
                                        )}
                                        <h3 style={{
                                            fontSize: '1.05rem', fontWeight: '700',
                                            margin: '0.4rem 0 0.5rem',
                                            display: '-webkit-box',
                                            WebkitLineClamp: '2',
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            minHeight: '2.4rem',
                                        }}>
                                            {product.name}
                                        </h3>
                                        <p style={{
                                            fontWeight: '800', fontSize: '1.3rem',
                                            color: 'var(--primary)', marginBottom: '0.3rem',
                                        }}>
                                            {formatPrice(Number(product.price))}
                                        </p>
                                        <p style={{
                                            fontSize: '0.72rem', fontWeight: '600',
                                            color: inStock ? 'var(--secondary)' : 'var(--error)',
                                        }}>
                                            {inStock ? `${product.stock} disponibles` : 'Sin stock'}
                                        </p>
                                    </div>
                                </Link>

                                {/* Acciones */}
                                <div style={{ padding: '0 1.5rem 1.5rem', marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        disabled={!inStock}
                                        className="btn btn-primary"
                                        style={{
                                            flex: 1, padding: '0.85rem',
                                            display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', gap: '0.5rem',
                                            cursor: inStock ? 'pointer' : 'not-allowed',
                                            opacity: inStock ? 1 : 0.5,
                                            border: 'none', fontSize: '0.9rem',
                                        }}
                                    >
                                        <FaShoppingCart size={14} />
                                        {inStock ? 'Añadir al carrito' : 'Agotado'}
                                    </button>
                                    <button
                                        onClick={() => handleRemove(item.id, product.name)}
                                        disabled={isRemoving}
                                        title="Eliminar"
                                        style={{
                                            width: '44px', height: '44px',
                                            borderRadius: 'var(--radius)',
                                            border: '1px solid var(--surface-low)',
                                            background: 'transparent',
                                            color: 'var(--error)',
                                            cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>

                                {/* Fecha de agregado */}
                                <div style={{
                                    padding: '0.75rem 1.5rem',
                                    borderTop: '1px solid var(--surface-low)',
                                    fontSize: '0.72rem',
                                    color: 'var(--on-surface-variant)',
                                }}>
                                    Agregado el {new Date(item.addedAt).toLocaleDateString('es-CO', {
                                        year: 'numeric', month: 'short', day: 'numeric'
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Enlace ir a productos */}
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <Link
                        href="/products"
                        style={{ color: 'var(--on-surface-variant)', fontWeight: '600', fontSize: '0.95rem' }}
                    >
                        ← Seguir explorando productos
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
