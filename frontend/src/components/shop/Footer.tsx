import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: 'white', padding: '80px 5% 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '60px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', marginBottom: '1.5rem' }}>SegurityGAB</h2>
          <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
            Líderes en seguridad electrónica y soluciones de monitoreo inteligente para el hogar y la empresa.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <FaFacebook size={20} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            <FaTwitter size={20} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            <FaInstagram size={20} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            <FaLinkedin size={20} style={{ cursor: 'pointer', color: '#94a3b8' }} />
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Enlaces Rápidos</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><Link href="/about" style={{ color: '#94a3b8' }}>Nosotros</Link></li>
            <li><Link href="/products" style={{ color: '#94a3b8' }}>Productos</Link></li>
            <li><Link href="/blog" style={{ color: '#94a3b8' }}>Blog de Seguridad</Link></li>
            <li><Link href="/contact" style={{ color: '#94a3b8' }}>Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Soporte</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><Link href="/help" style={{ color: '#94a3b8' }}>Centro de Ayuda</Link></li>
            <li><Link href="/faq" style={{ color: '#94a3b8' }}>Preguntas Frecuentes</Link></li>
            <li><Link href="/terms" style={{ color: '#94a3b8' }}>Términos de Servicio</Link></li>
            <li><Link href="/privacy" style={{ color: '#94a3b8' }}>Privacidad</Link></li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Contacto</h3>
          <p style={{ color: '#94a3b8', marginBottom: '0.75rem' }}>Email: info@seguritygab.com</p>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Tel: +1 234 567 890</p>
          <div style={{ display: 'flex' }}>
            <input 
              type="text" 
              placeholder="Tu email" 
              style={{ padding: '0.75rem', borderRadius: '4px 0 0 4px', border: 'none', width: '150px' }} 
            />
            <button style={{ 
              padding: '0.75rem 1rem', 
              background: 'var(--primary)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0 4px 4px 0',
              fontWeight: '600'
            }}>OK</button>
          </div>
        </div>
      </div>
      
      <div style={{ borderTop: '1px solid #1e293b', paddingTop: '40px', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
        © 2026 SegurityGAB. Todos los derechos reservados.
      </div>
    </footer>
  );
}
