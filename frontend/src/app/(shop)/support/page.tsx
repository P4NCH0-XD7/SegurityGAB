"use client";
import { FaHeadset, FaWhatsapp, FaEnvelope, FaQuestionCircle, FaArrowRight } from "react-icons/fa";
import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";

export default function SupportPage() {
    const faqs = [
        { q: "¿Cómo configuro mi cámara por primera vez?", a: "Debes descargar nuestra App móvil y escanear el código QR que se encuentra en la base del dispositivo." },
        { q: "¿Tienen servicio de instalación?", a: "Sí, contamos con técnicos especializados para instalaciones en todo el país." },
        { q: "¿Qué garantía tienen los productos?", a: "Todos nuestros equipos cuentan con 1 año de garantía por defectos de fábrica." }
    ];

    return (
        <div style={{ background: 'var(--surface)', minHeight: '100vh', color: 'var(--on-surface)' }}>
            <Navbar />
            
            <section style={{ 
                padding: '100px 5%', 
                background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("/support-bg.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                textAlign: 'center',
                color: 'white'
            }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem' }}>Centro de <span style={{ color: 'var(--primary)' }}>Soporte</span></h1>
                <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>Estamos aquí para ayudarte. Encuentra soluciones rápidas o contáctanos directamente.</p>
            </section>

            <section style={{ padding: '80px 5%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
                    <div style={{ background: 'var(--surface-low)', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid var(--surface-high)', textAlign: 'center' }}>
                        <FaWhatsapp size={48} color="#25D366" style={{ marginBottom: '1.5rem' }} />
                        <h3>WhatsApp</h3>
                        <p style={{ color: 'var(--secondary)', margin: '1rem 0' }}>Respuesta inmediata (Horario comercial)</p>
                        <a href="#" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            Chatear ahora <FaArrowRight />
                        </a>
                    </div>
                    <div style={{ background: 'var(--surface-low)', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid var(--surface-high)', textAlign: 'center' }}>
                        <FaEnvelope size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                        <h3>Email</h3>
                        <p style={{ color: 'var(--secondary)', margin: '1rem 0' }}>Soporte técnico y ventas</p>
                        <p style={{ fontWeight: '700' }}>soporte@seguritygab.com</p>
                    </div>
                    <div style={{ background: 'var(--surface-low)', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid var(--surface-high)', textAlign: 'center' }}>
                        <FaHeadset size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                        <h3>Llamada</h3>
                        <p style={{ color: 'var(--secondary)', margin: '1rem 0' }}>Atención telefónica personalizada</p>
                        <p style={{ fontWeight: '700' }}>+57 300 000 0000</p>
                    </div>
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>Preguntas <span style={{ color: 'var(--primary)' }}>Frecuentes</span></h2>
                    {faqs.map((faq, idx) => (
                        <div key={idx} style={{ 
                            background: 'var(--surface-low)', 
                            padding: '1.5rem 2rem', 
                            borderRadius: '1rem', 
                            marginBottom: '1rem',
                            border: '1px solid var(--surface-high)'
                         }}>
                            <div style={{ fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <FaQuestionCircle color="var(--primary)" /> {faq.q}
                            </div>
                            <p style={{ color: 'var(--secondary)', fontSize: '0.95rem' }}>{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
