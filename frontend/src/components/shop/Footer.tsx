import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer style={{ background: 'var(--on-surface)', color: 'var(--surface-lowest)', padding: '80px 5% 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '60px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--surface-lowest)', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>SegurityGAB</h2>
          <p style={{ color: 'var(--outline-variant)', lineHeight: '1.6' }}>
            Líderes en seguridad electrónica y soluciones de monitoreo inteligente para el hogar y la empresa.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <FaFacebook size={20} style={{ cursor: 'pointer', color: 'var(--outline-variant)' }} />
            <FaTwitter size={20} style={{ cursor: 'pointer', color: 'var(--outline-variant)' }} />
            <FaInstagram size={20} style={{ cursor: 'pointer', color: 'var(--outline-variant)' }} />
            <FaLinkedin size={20} style={{ cursor: 'pointer', color: 'var(--outline-variant)' }} />
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Enlaces Rápidos</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><Link href="/" style={{ color: 'var(--outline-variant)' }}>Nosotros</Link></li>
            <li><Link href="/products" style={{ color: 'var(--outline-variant)' }}>Productos</Link></li>
            <li><Link href="/" style={{ color: 'var(--outline-variant)' }}>Blog de Seguridad</Link></li>
            <li><Link href="/" style={{ color: 'var(--outline-variant)' }}>Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Soporte</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><Link href="/" style={{ color: 'var(--outline-variant)' }}>Centro de Ayuda</Link></li>
            <li><Link href="/" style={{ color: 'var(--outline-variant)' }}>Preguntas Frecuentes</Link></li>
            <li><Link href="/" style={{ color: 'var(--outline-variant)' }}>Términos de Servicio</Link></li>
            <li><Link href="/" style={{ color: 'var(--outline-variant)' }}>Privacidad</Link></li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Contacto</h3>
          <p style={{ color: 'var(--outline-variant)', marginBottom: '0.75rem' }}>Email: info@seguritygab.com</p>
          <p style={{ color: 'var(--outline-variant)', marginBottom: '1.5rem' }}>Tel: +1 234 567 890</p>
          <div style={{ display: 'flex' }}>
            <input 
              type="text" 
              placeholder="Tu email" 
              style={{ 
                padding: '0.75rem', 
                borderRadius: 'var(--radius) 0 0 var(--radius)', 
                border: 'none', 
                width: '180px',
                background: 'rgba(255,255,255,0.1)',
                color: 'var(--surface-lowest)',
                outline: 'none'
              }} 
            />
            <button style={{ 
              padding: '0.75rem 1.5rem', 
              background: 'var(--primary)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0 var(--radius) var(--radius) 0',
              fontWeight: '600',
              cursor: 'pointer'
            }}>OK</button>
          </div>
        </div>
      </div>
      
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px', textAlign: 'center', color: 'var(--outline)', fontSize: '0.875rem' }}>
        © 2026 SegurityGAB. Todos los derechos reservados.
      </div>
    </footer>
  );
}
