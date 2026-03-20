'use client';

import Link from "next/link";
import { FaShoppingCart, FaSearch, FaUser } from "react-icons/fa";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export default function Navbar() {
  const items = useCartStore(state => state.items);
  const { user, isAuthenticated, isInitialized, checkAuth } = useAuthStore();
  const itemCount = items.reduce((acc, item) => acc + (item.quantity || 0), 0);

  useEffect(() => {
    if (!isInitialized) {
      checkAuth();
    }
  }, [isInitialized, checkAuth]);

  return (
    <nav style={{
      height: '80px',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 5%',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      borderBottom: '1px solid rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
        <Link href="/" style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.02em' }}>
          SegurityGAB
        </Link>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link href="/products" style={{ fontWeight: '500', color: 'var(--on-surface-variant)' }}>Productos</Link>
          {user?.roleId === 1 && (
            <Link href="/dashboard" style={{ fontWeight: '500', color: 'var(--primary)' }}>Gestión</Link>
          )}
          <Link href="/support" style={{ fontWeight: '500', color: 'var(--on-surface-variant)' }}>Soporte</Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--outline-variant)' }} />
          <input 
            type="text" 
            placeholder="Buscar..." 
            style={{ 
              padding: '0.6rem 1rem 0.6rem 2.5rem', 
              borderRadius: '2rem', 
              border: 'none',
              background: 'var(--surface-low)',
              color: 'var(--on-surface)',
              width: '240px',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'all 0.2s ease'
            }} 
          />
        </div>
        <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <FaShoppingCart size={20} color="var(--on-surface-variant)" style={{ cursor: 'pointer' }} />
          {itemCount > 0 && (
            <span style={{ 
              position: 'absolute', 
              top: '-8px', 
              right: '-8px', 
              background: 'var(--primary)', 
              color: 'white', 
              fontSize: '0.7rem', 
              fontWeight: '700', 
              padding: '2px 6px', 
              borderRadius: '10px',
              minWidth: '18px',
              textAlign: 'center'
            }}>
              {itemCount}
            </span>
          )}
        </Link>
        <Link href={isAuthenticated ? "/profile" : "/login"} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <FaUser size={20} color="var(--on-surface-variant)" style={{ cursor: 'pointer' }} />
          {isInitialized && isAuthenticated && user && (
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--on-surface)' }}>{user.name || 'Mi Perfil'}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}
