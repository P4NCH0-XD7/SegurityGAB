'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaShoppingCart, FaSearch, FaUser, FaShieldAlt,
  FaChevronDown, FaBars, FaTimes, FaSignOutAlt,
  FaUserCircle, FaTachometerAlt, FaHeart, FaWhatsapp
} from 'react-icons/fa';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

const NAV_LINKS = [
  { label: 'Productos', href: '/products' },
  { label: 'Soluciones', href: '/solutions' },
  { label: 'Soporte', href: '/support' },
];

export default function Navbar() {
  const router = useRouter();
  const items = useCartStore(s => s.items);
  const { user, isAuthenticated, isInitialized, checkAuth, logout } = useAuthStore();
  const itemCount = items.reduce((acc, i) => acc + (i.quantity || 0), 0);

  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [userOpen, setUserOpen]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchVal, setSearchVal]     = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const userRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInitialized) checkAuth();
  }, [isInitialized, checkAuth]);

  // scroll listener
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // focus search input when opened
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // close user dropdown on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserOpen(false);
    router.push('/');
  };

  // Barra dinámica: fondo oscuro en hero (transparente), blanco al scroll
  const bgStyle = scrolled
    ? { background: 'rgba(255,255,255,0.95)', boxShadow: '0 1px 20px rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.06)' }
    : { background: 'rgba(15,23,42,0.6)',     boxShadow: 'none',                          borderBottom: '1px solid rgba(255,255,255,0.06)' };

  const textColor     = scrolled ? 'var(--on-surface)'         : 'white';
  const subTextColor  = scrolled ? 'var(--on-surface-variant)' : 'rgba(255,255,255,0.7)';
  const logoColor     = scrolled ? 'var(--primary)'            : 'white';
  const iconColor     = scrolled ? 'var(--on-surface-variant)' : 'rgba(255,255,255,0.8)';

  return (
    <>
      <nav style={{
        height: '72px',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease',
        ...bgStyle,
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          height: '100%', padding: '0 2rem',
          display: 'flex', alignItems: 'center', gap: '2rem',
        }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: '34px', height: '34px', background: scrolled ? 'var(--primary)' : 'rgba(255,255,255,0.15)', borderRadius: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
              <FaShieldAlt size={18} color={scrolled ? 'white' : 'white'} />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: '900', color: logoColor, letterSpacing: '-0.03em', transition: 'color 0.3s' }}>
              SegurityGAB
            </span>
          </Link>

          {/* Links de nav (desktop) */}
          <div style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                style={{ padding: '0.5rem 0.85rem', borderRadius: '0.6rem', fontWeight: '600', fontSize: '0.9rem', color: subTextColor, textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = scrolled ? 'var(--surface-low)' : 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLAnchorElement).style.color = textColor; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = subTextColor; }}
              >
                {l.label}
              </Link>
            ))}
            {isAuthenticated && user?.roleId === 1 && (
              <Link href="/dashboard"
                style={{ padding: '0.5rem 0.85rem', borderRadius: '0.6rem', fontWeight: '700', fontSize: '0.9rem', color: '#60a5fa', textDecoration: 'none', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(59,130,246,0.12)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
              >
                <FaTachometerAlt size={13}/> Admin
              </Link>
            )}
          </div>

          {/* WhatsApp rápido */}
          <a href="https://wa.me/573000000000" target="_blank" rel="noopener"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '700', color: '#4ade80', textDecoration: 'none', padding: '0.4rem 0.85rem', borderRadius: '0.65rem', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(74,222,128,0.18)'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(74,222,128,0.1)'}
          >
            <FaWhatsapp size={14}/> Asesoría gratis
          </a>

          {/* Acciones derecha */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>

            {/* Buscador */}
            <button onClick={() => setSearchOpen(o => !o)}
              style={{ width: '38px', height: '38px', borderRadius: '50%', border: 'none', background: scrolled ? 'var(--surface-low)' : 'rgba(255,255,255,0.1)', color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = scrolled ? 'var(--surface-high)' : 'rgba(255,255,255,0.18)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = scrolled ? 'var(--surface-low)' : 'rgba(255,255,255,0.1)'}
            >
              <FaSearch size={15}/>
            </button>

            {/* Wishlist */}
            <Link href="/wishlist"
              style={{ width: '38px', height: '38px', borderRadius: '50%', background: scrolled ? 'var(--surface-low)' : 'rgba(255,255,255,0.1)', color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = scrolled ? 'var(--surface-high)' : 'rgba(255,255,255,0.18)'; (e.currentTarget as HTMLAnchorElement).style.color = '#f43f5e'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = scrolled ? 'var(--surface-low)' : 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLAnchorElement).style.color = iconColor; }}
            >
              <FaHeart size={15}/>
            </Link>

            {/* Carrito */}
            <Link href="/cart" style={{ position: 'relative', display: 'flex' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: scrolled ? 'var(--surface-low)' : 'rgba(255,255,255,0.1)', color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = scrolled ? 'var(--surface-high)' : 'rgba(255,255,255,0.18)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = scrolled ? 'var(--surface-low)' : 'rgba(255,255,255,0.1)'}
              >
                <FaShoppingCart size={15}/>
              </div>
              {itemCount > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', fontSize: '0.62rem', fontWeight: '800', padding: '2px 5px', borderRadius: '10px', minWidth: '17px', textAlign: 'center', border: '2px solid transparent', lineHeight: 1.2 }}>
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Usuario */}
            <div ref={userRef} style={{ position: 'relative' }}>
              <button onClick={() => setUserOpen(o => !o)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem 0.4rem 0.4rem', borderRadius: '2rem', border: `1px solid ${scrolled ? 'var(--surface-high)' : 'rgba(255,255,255,0.2)'}`, background: scrolled ? 'var(--surface-low)' : 'rgba(255,255,255,0.08)', cursor: 'pointer', color: textColor, transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = scrolled ? 'var(--surface-high)' : 'rgba(255,255,255,0.14)'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = scrolled ? 'var(--surface-low)' : 'rgba(255,255,255,0.08)'}
              >
                {isAuthenticated && user ? (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '900', color: 'white' }}>
                      {user.name?.slice(0,2).toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <FaUserCircle size={22} color={iconColor}/>
                )}
                {isAuthenticated && user && (
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: textColor, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name?.split(' ')[0]}
                  </span>
                )}
                <FaChevronDown size={10} color={subTextColor} style={{ transition: 'transform 0.2s', transform: userOpen ? 'rotate(180deg)' : 'none' }}/>
              </button>

              {/* Dropdown usuario */}
              {userOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '220px', background: 'var(--surface)', border: '1px solid var(--surface-high)', borderRadius: '1rem', boxShadow: '0 16px 40px rgba(0,0,0,0.15)', overflow: 'hidden', zIndex: 200 }}>
                  {isAuthenticated && user ? (
                    <>
                      <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid var(--surface-high)' }}>
                        <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--on-surface)' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '0.2rem' }}>{(user as any).email}</div>
                      </div>
                      {user.roleId === 1 && (
                        <Link href="/dashboard" onClick={() => setUserOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: '700', transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-low)'}
                          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'}
                        >
                          <FaTachometerAlt size={14}/> Panel Admin
                        </Link>
                      )}
                      <Link href="/profile" onClick={() => setUserOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', color: 'var(--on-surface)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: '600', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-low)'}
                        onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'}
                      >
                        <FaUserCircle size={14}/> Mi Perfil
                      </Link>
                      <Link href="/wishlist" onClick={() => setUserOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', color: 'var(--on-surface)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: '600', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-low)'}
                        onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'}
                      >
                        <FaHeart size={13}/> Lista de Deseos
                      </Link>
                      <div style={{ borderTop: '1px solid var(--surface-high)', padding: '0.5rem' }}>
                        <button onClick={handleLogout}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#ef4444', background: 'rgba(239,68,68,0.06)', border: 'none', borderRadius: '0.65rem', fontSize: '0.88rem', fontWeight: '700', cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)'}
                          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.06)'}
                        >
                          <FaSignOutAlt size={13}/> Cerrar Sesión
                        </button>
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: '1rem' }}>
                      <Link href="/login" onClick={() => setUserOpen(false)}
                        style={{ display: 'block', padding: '0.8rem', background: 'var(--primary)', color: 'white', textAlign: 'center', textDecoration: 'none', borderRadius: '0.65rem', fontWeight: '800', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        Iniciar Sesión
                      </Link>
                      <Link href="/register" onClick={() => setUserOpen(false)}
                        style={{ display: 'block', padding: '0.8rem', background: 'var(--surface-low)', color: 'var(--on-surface)', textAlign: 'center', textDecoration: 'none', borderRadius: '0.65rem', fontWeight: '700', fontSize: '0.9rem' }}>
                        Crear cuenta
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hamburger mobile */}
            <button onClick={() => setMenuOpen(o => !o)}
              className="mobile-nav-btn"
              style={{ width: '38px', height: '38px', borderRadius: '50%', border: 'none', background: scrolled ? 'var(--surface-low)' : 'rgba(255,255,255,0.1)', color: iconColor, display: 'none', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              {menuOpen ? <FaTimes size={16}/> : <FaBars size={16}/>}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Buscador overlay ── */}
      {searchOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '120px' }}
          onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false); }}>
          <div style={{ width: '100%', maxWidth: '600px', padding: '0 2rem' }}>
            <form onSubmit={handleSearch}>
              <div style={{ position: 'relative' }}>
                <FaSearch style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)' }} size={18}/>
                <input
                  ref={searchRef}
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Buscar cámaras, alarmas, DVR…"
                  style={{ width: '100%', padding: '1.1rem 1.25rem 1.1rem 3.25rem', background: 'white', border: 'none', borderRadius: '1rem', fontSize: '1.1rem', color: '#0f172a', outline: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
                />
                <button type="button" onClick={() => setSearchOpen(false)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                  <FaTimes size={18}/>
                </button>
              </div>
            </form>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginTop: '0.85rem', textAlign: 'center' }}>
              Presiona Enter para buscar · Esc para cerrar
            </p>
          </div>
        </div>
      )}

      {/* ── Menú mobile ── */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: '72px', left: 0, right: 0, bottom: 0, background: 'var(--surface)', zIndex: 999, padding: '2rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                style={{ padding: '1rem 1.25rem', borderRadius: '0.85rem', color: 'var(--on-surface)', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem', background: 'var(--surface-low)' }}>
                {l.label}
              </Link>
            ))}
            {isAuthenticated && user?.roleId === 1 && (
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                style={{ padding: '1rem 1.25rem', borderRadius: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '800', fontSize: '1.1rem', background: 'rgba(59,130,246,0.08)' }}>
                Panel Admin
              </Link>
            )}
            <div style={{ height: '1px', background: 'var(--surface-high)', margin: '1rem 0' }}/>
            {isAuthenticated ? (
              <button onClick={handleLogout} style={{ padding: '1rem', borderRadius: '0.85rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', textAlign: 'left' }}>
                Cerrar Sesión
              </button>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)}
                style={{ padding: '1rem', borderRadius: '0.85rem', background: 'var(--primary)', color: 'white', textDecoration: 'none', fontWeight: '800', fontSize: '1rem', textAlign: 'center', display: 'block' }}>
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}

      {/* espacio para el navbar fijo */}
      <div style={{ height: '72px' }}/>

      <style>{`
        @media (max-width: 768px) {
          .mobile-nav-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
