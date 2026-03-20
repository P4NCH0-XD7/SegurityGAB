'use client';

import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import Link from "next/link";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CartPage() {
    const { items, updateQuantity, removeItem, getTotal } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    const handleCheckout = () => {
        if (!isAuthenticated) {
            toast.error("Debes iniciar sesión para completar tu compra");
            router.push("/login?redirect=/checkout");
            return;
        }
        router.push("/checkout");
    };

    const formatPrice = (priceNum: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(priceNum);
    };

    if (items.length === 0) {
        return (
            <div style={{ background: 'var(--surface)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <main className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 1.5rem' }}>
                    <div style={{ background: 'var(--surface-low)', width: '120px', height: '120px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', color: 'var(--outline-variant)' }}>
                        <FaShoppingCart size={48} />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Tu carrito está vacío</h1>
                    <p style={{ color: 'var(--on-surface-variant)', marginBottom: '2.5rem' }}>Parece que aún no has añadido ningún producto.</p>
                    <Link href="/products" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>Explorar Productos</Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--surface)', minHeight: '100vh' }}>
            <Navbar />
            
            <main className="container" style={{ padding: '80px 1.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem', letterSpacing: '-0.02em' }}>Tu Carrito</h1>
                
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '3rem' }}>
                    {/* Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {items.map(item => (
                            <div key={item.id} style={{ 
                                background: 'var(--surface-lowest)', 
                                padding: '2rem', 
                                borderRadius: 'var(--radius-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2rem'
                            }}>
                                <div style={{ width: '120px', height: '120px', background: 'var(--surface-low)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    <img src={item.image} alt={item.title} style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>{item.title}</h3>
                                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '1rem' }}>Precio unitario: {item.price}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-low)', borderRadius: '2rem', padding: '0.25rem' }}>
                                            <button 
                                                onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                                                style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'var(--surface-lowest)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <FaMinus size={10} />
                                            </button>
                                            <span style={{ padding: '0 1.5rem', fontWeight: '700' }}>{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                                style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'var(--surface-lowest)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <FaPlus size={10} />
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                removeItem(item.id);
                                                toast.success("Producto eliminado");
                                            }}
                                            style={{ color: 'var(--error)', border: 'none', background: 'transparent', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                        >
                                            <FaTrash /> Eliminar
                                        </button>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{item.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Sidebar */}
                    <div style={{ 
                        background: 'var(--surface-lowest)', 
                        padding: '2.5rem', 
                        borderRadius: 'var(--radius-lg)',
                        height: 'fit-content',
                        position: 'sticky',
                        top: '120px'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2rem' }}>Resumen del Pedido</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--on-surface-variant)' }}>
                                <span>Subtotal</span>
                                <span>{formatPrice(getTotal())}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--on-surface-variant)' }}>
                                <span>Envío</span>
                                <span style={{ color: 'var(--secondary)', fontWeight: '700' }}>Gratis</span>
                            </div>
                            <div style={{ height: '1px', background: 'var(--surface-low)', margin: '0.5rem 0' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: '800' }}>
                                <span>Total</span>
                                <span>{formatPrice(getTotal())}</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleCheckout}
                            className="btn btn-primary" 
                            style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', cursor: 'pointer', border: 'none' }}
                        >
                            Continuar al Pago
                        </button>
                        <Link href="/products" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: 'var(--on-surface-variant)', fontSize: '0.9rem', fontWeight: '600' }}>
                            ← Seguir Comprando
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
