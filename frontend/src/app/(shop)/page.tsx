import Link from "next/link";
import { FaCamera, FaBell, FaShieldAlt, FaTools, FaHeadset, FaCogs } from "react-icons/fa";
import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import "../../styles/shop/landing.css";

export default function LandingPage() {
  const categories = [
    { title: "Cámaras", icon: <FaCamera size={32} /> },
    { title: "DVR/NVR", icon: <FaCogs size={32} /> },
    { title: "Alarmas", icon: <FaBell size={32} /> },
    { title: "Accesorios", icon: <FaTools size={32} /> },
  ];

  const products = [
    {
      id: 1,
      title: "Cámara IP Domo 4K Vision Nocturna Pro",
      price: "$129.000",
      image: "/products/camera_ip_domo_4k.png",
    },
    {
      id: 2,
      title: "Kit Alarma Inalámbrica Inteligente 8 Zonas",
      price: "$245.500",
      image: "/products/kit_alarma_premium.png",
    },
    {
      id: 3,
      title: "DVR Híbrido 16 Canales Full HD Cloud",
      price: "$189.000",
      image: "/products/dvr_recorder_pro.png",
    },
    {
      id: 4,
      title: "Cámara Exterior Wifi PTZ 360 Auto-tracking",
      price: "$79.990",
      image: "/products/camera_ptz_outdoor.png",
    },
  ];

  return (
    <div className="landing-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Protección avanzada para lo que más quieres
            </h1>
            <p className="hero-subtitle">
              Soluciones integrales de seguridad electrónica para tu hogar y empresa.
              Monitoreo en tiempo real, inteligencia artificial y tecnología de punta a tu alcance.
            </p>
            <div className="hero-actions">
              <Link href="/products" className="btn btn-primary">Ver Catálogo</Link>
              <Link href="/contact" className="btn btn-outline" style={{ marginLeft: '1rem', border: '1px solid var(--border)', background: 'transparent' }}>Contáctanos</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories" style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Categorías Principales</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {categories.map((cat, idx) => (
              <div key={idx} className="category-card">
                <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{cat.icon}</div>
                <h3 style={{ fontSize: '1.25rem' }}>{cat.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products" style={{ padding: '80px 0', background: '#f8fafc' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Productos Destacados</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div style={{ height: '240px', overflow: 'hidden' }}>
                  <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', height: '3rem' }}>{product.title}</h3>
                  <p style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.25rem', marginBottom: '1rem' }}>{product.price}</p>
                  <button className="btn btn-primary" style={{ width: '100%' }}>Añadir al Carrito</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust" style={{ padding: '80px 0', marginBottom: '40px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <FaShieldAlt size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
              <h3>Garantía Total</h3>
              <p style={{ color: 'var(--secondary)', marginTop: '0.5rem' }}>Respaldamos cada producto con garantía oficial y cambio inmediato por fallas.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <FaHeadset size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
              <h3>Soporte Técnico</h3>
              <p style={{ color: 'var(--secondary)', marginTop: '0.5rem' }}>Atención personalizada y asistencia técnica remota las 24 horas del día.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
