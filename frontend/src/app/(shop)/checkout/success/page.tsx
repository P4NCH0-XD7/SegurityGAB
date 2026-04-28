'use client';

import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import Link from "next/link";
import { FaCheckCircle, FaShoppingBag } from "react-icons/fa";

export default function SuccessPage() {
    return (
        <div style={{ background: 'var(--surface)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            
            <main className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 1.5rem' }}>
                <div style={{ 
                    background: 'rgba(39, 174, 96, 0.1)', 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginBottom: '2.5rem', 
                    color: '#27ae60' 
                }}>
                    <FaCheckCircle size={64} />
                </div>
                
                <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', textAlign: 'center', letterSpacing: '-0.02em' }}>
                    ¡Gracias por tu compra!
                </h1>
                
                <p style={{ 
                    color: 'var(--on-surface-variant)', 
                    fontSize: '1.25rem', 
                    marginBottom: '3rem', 
                    textAlign: 'center', 
                    maxWidth: '600px',
                    lineHeight: '1.6'
                }}>
                    Tu pedido ha sido recibido y está siendo procesado. Te enviaremos un correo electrónico con los detalles de tu orden y la información de seguimiento en breve.
                </p>
                
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <Link href="/products" className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FaShoppingBag /> Seguir Comprando
                    </Link>
                    <Link href="/" className="btn" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', background: 'var(--surface-low)', color: 'var(--on-surface)' }}>
                        Volver al Inicio
                    </Link>
                </div>

                <div style={{ marginTop: '5rem', padding: '2rem', border: '1px dashed var(--outline-variant)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)' }}>
                        ¿Tienes alguna duda? <Link href="/support" style={{ color: 'var(--primary)', fontWeight: '600' }}>Contacta con soporte</Link>
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
