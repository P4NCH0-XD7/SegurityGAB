import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import { FaLock, FaCreditCard, FaTruck } from "react-icons/fa";

export default function CheckoutPage() {
    return (
        <div style={{ background: 'var(--surface)', minHeight: '100vh' }}>
            <Navbar />
            
            <main className="container" style={{ padding: '80px 1.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem', letterSpacing: '-0.02em' }}>Finalizar Compra</h1>
                
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                    {/* Checkout Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ background: 'var(--surface-lowest)', padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <FaTruck color="var(--primary)" /> Información de Envío
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Nombre Completo</label>
                                    <input type="text" style={{ padding: '1rem', background: 'var(--surface-low)', border: 'none', borderRadius: 'var(--radius)', outline: 'none' }} placeholder="Ej. Juan Pérez" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Ciudad</label>
                                    <input type="text" style={{ padding: '1rem', background: 'var(--surface-low)', border: 'none', borderRadius: 'var(--radius)', outline: 'none' }} placeholder="Medellín" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Teléfono</label>
                                    <input type="text" style={{ padding: '1rem', background: 'var(--surface-low)', border: 'none', borderRadius: 'var(--radius)', outline: 'none' }} placeholder="+57 300..." />
                                </div>
                                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Dirección</label>
                                    <input type="text" style={{ padding: '1rem', background: 'var(--surface-low)', border: 'none', borderRadius: 'var(--radius)', outline: 'none' }} placeholder="Calle 123..." />
                                </div>
                            </div>
                        </div>

                        <div style={{ background: 'var(--surface-lowest)', padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <FaCreditCard color="var(--primary)" /> Método de Pago
                            </h3>
                            <div style={{ background: 'var(--surface-low)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '2px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <FaCreditCard size={24} color="var(--primary)" />
                                    <div>
                                        <div style={{ fontWeight: '700' }}>Tarjeta de Crédito / Débito</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>Pago seguro procesado por Stripe</div>
                                    </div>
                                </div>
                                <input type="radio" checked readOnly style={{ width: '20px', height: '20px' }} />
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Summary */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ 
                            background: 'var(--surface-lowest)', 
                            padding: '2.5rem', 
                            borderRadius: 'var(--radius-lg)',
                            height: 'fit-content'
                        }}>
                             <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2rem' }}>Resumen</h3>
                             <div style={{ display: 'flex', marginBottom: '2rem', gap: '1rem', alignItems: 'center' }}>
                                 <div style={{ width: '60px', height: '60px', background: 'var(--surface-low)', borderRadius: '0.5rem' }}></div>
                                 <div style={{ flex: 1 }}>
                                     <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Cámara IP Domo 4K</div>
                                     <div style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: '700' }}>$129.000</div>
                                 </div>
                             </div>

                             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--on-surface-variant)' }}>
                                    <span>Subtotal</span>
                                    <span>$129.000</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--on-surface-variant)' }}>
                                    <span>Envío</span>
                                    <span style={{ color: 'var(--secondary)', fontWeight: '700' }}>Gratis</span>
                                </div>
                                <div style={{ height: '1px', background: 'var(--surface-low)', margin: '0.5rem 0' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: '800' }}>
                                    <span>Total</span>
                                    <span>$129.000</span>
                                </div>
                            </div>
                            
                            <button className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                <FaLock /> Pagar Ahora
                            </button>
                            <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--on-surface-variant)', fontSize: '0.75rem' }}>
                                Tus datos están cifrados y protegidos.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
