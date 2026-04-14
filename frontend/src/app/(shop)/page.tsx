'use client';

import { useState, useEffect } from 'react';

import Link from "next/link";
import { FaCamera, FaBell, FaShieldAlt, FaTools, FaHeadset, FaCogs } from "react-icons/fa";
import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import "../../styles/shop/landing.css";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";

export default function LandingPage() {
  const addItem = useCartStore((state) => state.addItem);

  const categories = [
    { title: "Cámaras", icon: <FaCamera size={32} /> },
    { title: "DVR/NVR", icon: <FaCogs size={32} /> },
    { title: "Alarmas", icon: <FaBell size={32} /> },
    { title: "Accesorios", icon: <FaTools size={32} /> },
  ];

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

  useEffect(() => {
    const fetchVisibleProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        if (res.ok) {
          const data = await res.json();
          // Map DB keys to frontend keys, filter visible, limit to 4
          const visible = data
            .filter((p: any) => p.status === 'visible')
            .slice(0, 4)
            .map((p: any) => ({
              id: p.id,
              title: p.name,
              // Convert to money string format expected by UI
              price: `$${Number(p.price).toLocaleString('es-CO')}`,
              image: p.imageUrl || "/products/placeholder.png", // fallback image
            }));
          setProducts(visible);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVisibleProducts();
  }, [API_URL]);

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast.success(`${product.title} añadido al carrito`);
  };

  return (
    <div className="landing-page" style={{ background: 'var(--surface)' }}>
      <Navbar />

      {/* Hero Section - Intentional Asymmetry */}
      <section className="hero" style={{ padding: '120px 0', background: 'var(--surface-low)', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="hero-content" style={{ maxWidth: '600px', textAlign: 'left', zIndex: 1 }}>
            <h1 className="hero-title" style={{ fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              Protección avanzada para lo que más quieres
            </h1>
            <p className="hero-subtitle" style={{ fontSize: '1.25rem', color: 'var(--on-surface-variant)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
              Soluciones integrales de seguridad electrónica para tu hogar y empresa.
              Monitoreo en tiempo real, inteligencia artificial y tecnología de punta.
            </p>
            <div className="hero-actions" style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/products" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Ver Catálogo</Link>
              <Link href="/contact" className="btn" style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: 'rgba(17, 92, 185, 0.1)', color: 'var(--primary)' }}>Contáctanos</Link>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
             {/* Decorative element or silhouetted image placeholder */}
             <div style={{ 
               width: '500px', 
               height: '500px', 
               background: 'linear-gradient(135deg, var(--surface-highest), var(--surface-low))', 
               borderRadius: '2rem',
               transform: 'rotate(-5deg) translateX(50px)',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center'
             }}>
                <FaShieldAlt size={200} color="var(--primary)" opacity={0.15} />
             </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Tonal Shift */}
      <section className="categories" style={{ padding: '100px 0', background: 'var(--surface)' }}>
        <div className="container">
          <label style={{ display: 'block', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '1rem', fontSize: '0.8rem' }}>Ecosistema de Seguridad</label>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '4rem', letterSpacing: '-0.01em' }}>Categorías Principales</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            {categories.map((cat, idx) => (
              <div key={idx} className="category-card" style={{ 
                background: 'var(--surface-lowest)', 
                padding: '3rem 2rem', 
                borderRadius: 'var(--radius-lg)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>{cat.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{cat.title}</h3>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Explorar soluciones especializadas</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - High Contrast Surface Layering */}
      <section className="products" style={{ padding: '120px 0', background: 'var(--surface-low)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <div>
               <label style={{ display: 'block', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '1rem', fontSize: '0.8rem' }}>Selección Premium</label>
               <h2 style={{ fontSize: '2.5rem', margin: 0, letterSpacing: '-0.01em' }}>Productos Destacados</h2>
            </div>
            <Link href="/products" style={{ color: 'var(--primary)', fontWeight: '600' }}>Ver todos los productos →</Link>
          </div>
          
          {loading ? (
             <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '3rem', color: 'var(--on-surface-variant)' }}>
               Cargando productos destacados...
             </div>
          ) : products.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
              {products.map(product => (
                <div key={product.id} className="product-card" style={{ 
                  background: 'var(--surface-lowest)', 
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ height: '300px', background: 'var(--surface-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                     {/* Silhouetted image effect */}
                    <img src={product.image} alt={product.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }} />
                  </div>
                  <div style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontWeight: '600' }}>{product.title}</h3>
                    <p style={{ fontWeight: '700', color: 'var(--on-surface)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>{product.price}</p>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="btn btn-primary" 
                      style={{ width: '100%', padding: '1rem', cursor: 'pointer' }}
                    >
                      Añadir al Carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '3rem', color: 'var(--on-surface-variant)' }}>
               No hay productos destacados disponibles en este momento.
             </div>
          )}
        </div>
      </section>

      {/* Trust Section - Clean Typography and Icons */}
      <section className="trust" style={{ padding: '100px 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ background: 'var(--surface-high)', width: '64px', height: '64px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                <FaShieldAlt size={32} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Garantía Total</h3>
              <p style={{ color: 'var(--on-surface-variant)', lineHeight: '1.6' }}>Respaldamos cada producto con garantía oficial y asistencia técnica inmediata ante cualquier eventualidad.</p>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ background: 'var(--surface-high)', width: '64px', height: '64px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                <FaHeadset size={32} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Soporte Técnico</h3>
              <p style={{ color: 'var(--on-surface-variant)', lineHeight: '1.6' }}>Atención personalizada y asistencia técnica remota por expertos certificados las 24 horas del día.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
