import Link from "next/link";
import { FaShoppingCart, FaSearch, FaUser } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav style={{
      height: '80px',
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 5%',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
        <Link href="/" style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
          SegurityGAB
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href="/products" style={{ fontWeight: '500', color: '#64748b' }}>Productos</Link>
          <Link href="/solutions" style={{ fontWeight: '500', color: '#64748b' }}>Soluciones</Link>
          <Link href="/support" style={{ fontWeight: '500', color: '#64748b' }}>Soporte</Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Buscar..." 
            style={{ 
              padding: '0.5rem 1rem 0.5rem 2.5rem', 
              borderRadius: '2rem', 
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              width: '200px'
            }} 
          />
        </div>
        <FaShoppingCart size={20} color="#64748b" style={{ cursor: 'pointer' }} />
        <Link href="/login">
          <FaUser size={20} color="#64748b" style={{ cursor: 'pointer' }} />
        </Link>
      </div>
    </nav>
  );
}
