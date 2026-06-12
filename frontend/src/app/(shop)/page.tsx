'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaCamera, FaBell, FaShieldAlt, FaTools, FaCogs, FaHeadset, FaTruck, FaStar, FaSearch, FaChevronDown, FaChevronUp, FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import Navbar from '@/components/shop/Navbar';
import Footer from '@/components/shop/Footer';
import SecurityNews from '@/components/dashboard/SecurityNews';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';
import { formatPrice } from '@/utils/formatters';

const CAT_ICONS: Record<string, React.ReactNode> = {
  default: <FaCamera size={22}/>,
  camara: <FaCamera size={22}/>, cámara: <FaCamera size={22}/>,
  dvr: <FaCogs size={22}/>, nvr: <FaCogs size={22}/>,
  alarma: <FaBell size={22}/>, accesorio: <FaTools size={22}/>,
};

function getCatIcon(name: string) {
  const key = name.toLowerCase().split(' ')[0];
  return CAT_ICONS[key] || CAT_ICONS.default;
}

const FAQS = [
  { q: '¿Ofrecen instalación?', a: 'Sí. Contamos con técnicos certificados en toda Colombia. Puedes solicitarla al completar tu compra.' },
  { q: '¿Cuál es el tiempo de entrega?', a: 'Entre 2 y 5 días hábiles según tu ciudad. Bogotá y principales ciudades en 24–48 h.' },
  { q: '¿Los productos tienen garantía?', a: 'Todos los productos tienen garantía mínima de 12 meses directa con el fabricante.' },
  { q: '¿Puedo pagar a plazos?', a: 'Sí, aceptamos cuotas con las principales tarjetas de crédito y PSE sin costo adicional.' },
];

const STATS = [
  { value: '500+', label: 'Clientes satisfechos' },
  { value: '99%', label: 'Disponibilidad del sistema' },
  { value: '24/7', label: 'Soporte técnico' },
  { value: '5 años', label: 'Experiencia en el sector' },
];

export default function LandingPage() {
  const addItem = useCartStore(s => s.addItem);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  const [products, setProducts]     = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [activeCat, setActiveCat]   = useState<number | null>(null);
  const [faqOpen, setFaqOpen]       = useState<number | null>(null);
  const productsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/products`).then(r => r.json()).catch(() => []),
      fetch(`${API_URL}/categories`).then(r => r.json()).catch(() => []),
    ]).then(([prods, cats]) => {
      setProducts(prods.filter((p: any) => p.status === 'visible'));
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = activeCat === null || p.categoryId === activeCat;
    return matchSearch && matchCat;
  }).slice(0, 6);

  const handleAdd = (p: any) => {
    addItem({ id: p.id, title: p.name, price: Number(p.price), image: p.imageUrl || '' });
    toast.success(`${p.name} añadido al carrito 🛒`);
  };

  const scrollToProducts = () => productsRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div style={{ background: 'var(--surface)', fontFamily: 'inherit' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ padding: '110px 0 80px', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1d4ed8 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* decoración */}
        <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'500px', height:'500px', borderRadius:'50%', background:'rgba(59,130,246,0.08)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'-60px', left:'10%', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(16,185,129,0.06)', pointerEvents:'none' }}/>
        <div className="container" style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 2rem', display:'flex', alignItems:'center', gap:'4rem' }}>
          <div style={{ flex:1, zIndex:1 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(59,130,246,0.15)', border:'1px solid rgba(59,130,246,0.3)', borderRadius:'2rem', padding:'0.4rem 1rem', marginBottom:'1.5rem' }}>
              <FaShieldAlt size={12} color="#60a5fa"/>
              <span style={{ fontSize:'0.8rem', color:'#93c5fd', fontWeight:'700', letterSpacing:'0.04em' }}>SEGURIDAD ELECTRÓNICA PROFESIONAL</span>
            </div>
            <h1 style={{ fontSize:'3.2rem', fontWeight:'900', color:'white', lineHeight:'1.1', letterSpacing:'-0.03em', marginBottom:'1.5rem' }}>
              Protege lo que<br/>
              <span style={{ background:'linear-gradient(90deg,#60a5fa,#34d399)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>más importa</span>
            </h1>
            <p style={{ fontSize:'1.1rem', color:'#94a3b8', lineHeight:'1.7', marginBottom:'2.5rem', maxWidth:'480px' }}>
              Soluciones integrales de vigilancia y seguridad para tu hogar y empresa. Tecnología de vanguardia, instalación profesional.
            </p>
            <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
              <button onClick={scrollToProducts} style={{ padding:'0.9rem 2rem', background:'linear-gradient(135deg,#3b82f6,#2563eb)', color:'white', border:'none', borderRadius:'0.85rem', fontWeight:'800', fontSize:'1rem', cursor:'pointer', boxShadow:'0 8px 24px rgba(59,130,246,0.4)', transition:'transform 0.2s' }}
                onMouseEnter={e=>(e.currentTarget.style.transform='translateY(-2px)')}
                onMouseLeave={e=>(e.currentTarget.style.transform='translateY(0)')}>
                Ver Catálogo
              </button>
              <a href="https://wa.me/573000000000" target="_blank" rel="noopener" style={{ padding:'0.9rem 1.75rem', background:'rgba(255,255,255,0.08)', color:'white', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'0.85rem', fontWeight:'700', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <FaWhatsapp color="#4ade80"/> Asesoría gratis
              </a>
            </div>
            {/* mini stats */}
            <div style={{ display:'flex', gap:'2rem', marginTop:'3rem', flexWrap:'wrap' }}>
              {STATS.map(s => (
                <div key={s.label}>
                  <div style={{ fontSize:'1.5rem', fontWeight:'900', color:'white' }}>{s.value}</div>
                  <div style={{ fontSize:'0.75rem', color:'#64748b', fontWeight:'600', marginTop:'0.1rem' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex:'0 0 380px', display:'flex', justifyContent:'center', position:'relative' }}>
            <div style={{ width:'320px', height:'320px', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:'240px', height:'240px', background:'rgba(59,130,246,0.15)', border:'1px solid rgba(59,130,246,0.25)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <FaShieldAlt size={100} color="#3b82f6" opacity={0.7}/>
              </div>
            </div>
            {/* badges flotantes */}
            {[
              { top:'10%', left:'-10px', text:'✅ Instalación incluida', bg:'#10b981' },
              { top:'70%', right:'-10px', text:'🔒 Garantía 12 meses', bg:'#3b82f6' },
            ].map(b => (
              <div key={b.text} style={{ position:'absolute', top:b.top, left:(b as any).left, right:(b as any).right, background:b.bg, color:'white', padding:'0.5rem 0.85rem', borderRadius:'0.65rem', fontSize:'0.75rem', fontWeight:'700', boxShadow:'0 4px 12px rgba(0,0,0,0.3)', whiteSpace:'nowrap' }}>
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORÍAS ── */}
      <section style={{ padding:'70px 0 50px', background:'var(--surface)' }}>
        <div className="container" style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 2rem' }}>
          <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
            <span style={{ fontSize:'0.75rem', fontWeight:'800', color:'var(--primary)', textTransform:'uppercase', letterSpacing:'0.08em' }}>Nuestras líneas</span>
            <h2 style={{ fontSize:'2rem', fontWeight:'900', color:'var(--on-surface)', marginTop:'0.5rem', letterSpacing:'-0.02em' }}>Categorías de Productos</h2>
          </div>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => setActiveCat(null)}
              style={{ padding:'0.7rem 1.5rem', borderRadius:'2rem', fontWeight:'700', fontSize:'0.88rem', border:'2px solid', cursor:'pointer', transition:'all 0.2s',
                borderColor: activeCat===null ? 'var(--primary)' : 'var(--surface-high)',
                background:  activeCat===null ? 'var(--primary)' : 'var(--surface-low)',
                color:       activeCat===null ? 'white'          : 'var(--on-surface-variant)' }}>
              Todos
            </button>
            {categories.map((c: any) => (
              <button key={c.id} onClick={() => setActiveCat(activeCat===c.id ? null : c.id)}
                style={{ padding:'0.7rem 1.5rem', borderRadius:'2rem', fontWeight:'700', fontSize:'0.88rem', border:'2px solid', cursor:'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', gap:'0.5rem',
                  borderColor: activeCat===c.id ? 'var(--primary)' : 'var(--surface-high)',
                  background:  activeCat===c.id ? 'var(--primary)' : 'var(--surface-low)',
                  color:       activeCat===c.id ? 'white'          : 'var(--on-surface-variant)' }}>
                {getCatIcon(c.name)} {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS ── */}
      <section ref={productsRef} style={{ padding:'30px 0 90px', background:'var(--surface)' }}>
        <div className="container" style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 2rem' }}>
          {/* barra búsqueda */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', gap:'1rem', flexWrap:'wrap' }}>
            <div>
              <h2 style={{ fontSize:'1.6rem', fontWeight:'900', color:'var(--on-surface)', margin:0 }}>
                {activeCat ? categories.find((c:any)=>c.id===activeCat)?.name : 'Todos los Productos'}
              </h2>
              <p style={{ color:'var(--on-surface-variant)', fontSize:'0.85rem', margin:'0.25rem 0 0' }}>{filtered.length} productos disponibles</p>
            </div>
            <div style={{ display:'flex', gap:'0.75rem', alignItems:'center', flex:1, minWidth:0 }}>
              <select value={activeCat ?? ''} onChange={e=>setActiveCat(e.target.value ? Number(e.target.value) : null)}
                style={{ padding:'0.6rem 0.9rem', borderRadius:'0.85rem', border:'1px solid var(--surface-high)', background:'var(--surface-low)', color:'var(--on-surface)', fontWeight:'700', cursor:'pointer' }}>
                <option value="">Todas las categorías</option>
                {categories.map((c:any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <div style={{ position:'relative', flex:1, minWidth:0 }}>
                <FaSearch style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--on-surface-variant)' }}/>
                <input value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder="Buscar producto..."
                  style={{ width:'100%', padding:'0.75rem 1rem 0.75rem 3rem', background:'var(--surface-low)', border:'1px solid var(--surface-high)', borderRadius:'0.85rem', color:'var(--on-surface)', outline:'none', fontSize:'0.9rem', minWidth:0 }}/>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:'5rem', color:'var(--on-surface-variant)' }}>
              <div style={{ display:'inline-block', width:'40px', height:'40px', border:'4px solid var(--surface-high)', borderTopColor:'var(--primary)', borderRadius:'50%', animation:'spin 0.8s linear infinite', marginBottom:'1rem' }}/>
              <p>Cargando productos...</p>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'5rem', color:'var(--on-surface-variant)' }}>
              <FaSearch size={40} opacity={0.2} style={{ marginBottom:'1rem' }}/>
              <p style={{ fontWeight:'600' }}>No se encontraron productos</p>
              <button onClick={()=>{setSearch('');setActiveCat(null);}} style={{ marginTop:'1rem', padding:'0.6rem 1.5rem', background:'var(--primary)', color:'white', border:'none', borderRadius:'0.65rem', cursor:'pointer', fontWeight:'700' }}>Ver todos</button>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(270px,1fr))', gap:'1.75rem' }}>
              {filtered.map((p:any) => {
                const hasImg = !!p.imageUrl;
                const initials = p.name.slice(0,2).toUpperCase();
                return (
                  <div key={p.id} style={{ background:'var(--surface-low)', border:'1px solid var(--surface-high)', borderRadius:'1.25rem', overflow:'hidden', display:'flex', flexDirection:'column', transition:'all 0.25s' }}
                    onMouseEnter={e=>{const d=e.currentTarget;d.style.transform='translateY(-4px)';d.style.boxShadow='0 16px 40px rgba(0,0,0,0.12)';d.style.borderColor='var(--primary)';}}
                    onMouseLeave={e=>{const d=e.currentTarget;d.style.transform='translateY(0)';d.style.boxShadow='none';d.style.borderColor='var(--surface-high)';}}>
                    {/* imagen */}
                    <Link href={`/products/${p.id}`} style={{ display:'block', textDecoration:'none' }}>
                      <div style={{ height:'220px', background:'var(--surface-high)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
                        {hasImg ? (
                          <img src={p.imageUrl} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}
                            onError={e=>{e.currentTarget.style.display='none';}}/>
                        ) : (
                          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem' }}>
                            <div style={{ width:'72px', height:'72px', background:'linear-gradient(135deg,var(--primary),#6366f1)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                              <span style={{ fontSize:'1.5rem', fontWeight:'900', color:'white' }}>{initials}</span>
                            </div>
                            <span style={{ fontSize:'0.7rem', color:'var(--on-surface-variant)', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.06em' }}>Sin imagen</span>
                          </div>
                        )}
                        {p.stock === 0 && (
                          <div style={{ position:'absolute', top:'0.75rem', right:'0.75rem', background:'rgba(239,68,68,0.9)', color:'white', padding:'0.25rem 0.6rem', borderRadius:'0.4rem', fontSize:'0.7rem', fontWeight:'800' }}>AGOTADO</div>
                        )}
                        {p.stock > 0 && p.stock < 5 && (
                          <div style={{ position:'absolute', top:'0.75rem', right:'0.75rem', background:'rgba(245,158,11,0.9)', color:'white', padding:'0.25rem 0.6rem', borderRadius:'0.4rem', fontSize:'0.7rem', fontWeight:'800' }}>ÚLTIMAS UNIDADES</div>
                        )}
                      </div>
                    </Link>
                    {/* info */}
                    <div style={{ padding:'1.25rem', flex:1, display:'flex', flexDirection:'column' }}>
                      {p.category?.name && (
                        <span style={{ fontSize:'0.68rem', fontWeight:'800', color:'var(--primary)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.4rem' }}>{p.category.name}</span>
                      )}
                      <Link href={`/products/${p.id}`} style={{ textDecoration:'none' }}>
                        <h3 style={{ fontSize:'0.95rem', fontWeight:'800', color:'var(--on-surface)', marginBottom:'0.5rem', lineHeight:'1.3' }}>{p.name}</h3>
                      </Link>
                      {p.description && (
                        <p style={{ fontSize:'0.78rem', color:'var(--on-surface-variant)', lineHeight:'1.5', marginBottom:'1rem', flex:1 }}>
                          {p.description.slice(0,75)}{p.description.length>75?'…':''}
                        </p>
                      )}
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto' }}>
                        <div>
                          <div style={{ fontSize:'1.3rem', fontWeight:'900', color:'var(--on-surface)' }}>{formatPrice(Number(p.price))}</div>
                          <div style={{ fontSize:'0.72rem', fontWeight:'600', color: p.stock>0?'#059669':'#dc2626' }}>
                            {p.stock>0 ? `${p.stock} disponibles` : 'Agotado'}
                          </div>
                        </div>
                        <button onClick={()=>handleAdd(p)} disabled={p.stock<=0}
                          style={{ padding:'0.6rem 1.1rem', background: p.stock>0?'var(--primary)':'var(--surface-high)', color: p.stock>0?'white':'var(--on-surface-variant)', border:'none', borderRadius:'0.65rem', fontWeight:'700', fontSize:'0.82rem', cursor: p.stock>0?'pointer':'not-allowed' }}>
                          {p.stock>0 ? '+ Carrito' : 'Agotado'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {filtered.length >= 6 && (
            <div style={{ textAlign:'center', marginTop:'3rem' }}>
              <Link href="/products" style={{ padding:'0.9rem 2.5rem', background:'var(--surface-low)', border:'2px solid var(--surface-high)', borderRadius:'0.85rem', color:'var(--on-surface)', textDecoration:'none', fontWeight:'700', display:'inline-block' }}>
                Ver catálogo completo →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section style={{ background:'var(--surface-low)', padding:'60px 0', borderTop:'1px solid var(--surface-high)', borderBottom:'1px solid var(--surface-high)' }}>
        <div className="container" style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 2rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px,1fr))', gap:'2rem' }}>
            {[
              { icon:<FaTruck size={28}/>, title:'Envío rápido', desc:'2–5 días a todo el país' },
              { icon:<FaShieldAlt size={28}/>, title:'Garantía oficial', desc:'Mínimo 12 meses' },
              { icon:<FaHeadset size={28}/>, title:'Soporte 24/7', desc:'Técnicos certificados' },
              { icon:<FaCheckCircle size={28}/>, title:'Pago seguro', desc:'PSE · Tarjetas · Crédito' },
            ].map(b => (
              <div key={b.title} style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                <div style={{ color:'var(--primary)', flexShrink:0 }}>{b.icon}</div>
                <div>
                  <div style={{ fontWeight:'800', fontSize:'0.95rem', color:'var(--on-surface)' }}>{b.title}</div>
                  <div style={{ fontSize:'0.78rem', color:'var(--on-surface-variant)', marginTop:'0.1rem' }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOTICIAS SEGURIDAD ── */}
      <section style={{ padding:'80px 0', background:'var(--surface)' }}>
        <div className="container" style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 2rem', display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:'4rem', alignItems:'start' }}>
          <div>
            <span style={{ fontSize:'0.75rem', fontWeight:'800', color:'var(--primary)', textTransform:'uppercase', letterSpacing:'0.08em' }}>Inteligencia de seguridad</span>
            <h2 style={{ fontSize:'2rem', fontWeight:'900', color:'var(--on-surface)', margin:'0.75rem 0 1rem', lineHeight:'1.2' }}>Actualidad y<br/>Tendencias</h2>
            <p style={{ color:'var(--on-surface-variant)', lineHeight:'1.7', marginBottom:'1.5rem' }}>Mantente informado sobre las últimas amenazas y avances tecnológicos en seguridad electrónica. Feed actualizado 24/7.</p>
            <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
              <div style={{ width:'32px', height:'3px', background:'var(--primary)', borderRadius:'2px' }}/>
              <span style={{ fontWeight:'700', fontSize:'0.85rem', color:'var(--on-surface)' }}>Feed en tiempo real</span>
            </div>
          </div>
          <SecurityNews />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding:'80px 0', background:'var(--surface-low)' }}>
        <div className="container" style={{ maxWidth:'760px', margin:'0 auto', padding:'0 2rem' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <span style={{ fontSize:'0.75rem', fontWeight:'800', color:'var(--primary)', textTransform:'uppercase', letterSpacing:'0.08em' }}>FAQ</span>
            <h2 style={{ fontSize:'2rem', fontWeight:'900', color:'var(--on-surface)', marginTop:'0.5rem' }}>Preguntas frecuentes</h2>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
            {FAQS.map((f,i) => (
              <div key={i} onClick={()=>setFaqOpen(faqOpen===i?null:i)}
                style={{ background:'var(--surface)', border:'1px solid var(--surface-high)', borderRadius:'1rem', overflow:'hidden', cursor:'pointer' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.25rem 1.5rem', fontWeight:'700', color:'var(--on-surface)' }}>
                  {f.q}
                  {faqOpen===i ? <FaChevronUp size={14} color="var(--primary)"/> : <FaChevronDown size={14} color="var(--on-surface-variant)"/>}
                </div>
                {faqOpen===i && (
                  <div style={{ padding:'0 1.5rem 1.25rem', color:'var(--on-surface-variant)', lineHeight:'1.65', fontSize:'0.92rem' }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding:'90px 0', background:'linear-gradient(135deg,#0f172a,#1e3a5f)' }}>
        <div style={{ textAlign:'center', maxWidth:'600px', margin:'0 auto', padding:'0 2rem' }}>
          <h2 style={{ fontSize:'2.2rem', fontWeight:'900', color:'white', marginBottom:'1rem', lineHeight:'1.2' }}>¿Listo para proteger<br/>tu negocio?</h2>
          <p style={{ color:'#94a3b8', lineHeight:'1.7', marginBottom:'2.5rem' }}>Agenda una asesoría gratuita con nuestros expertos y recibe un plan de seguridad personalizado.</p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/products" style={{ padding:'0.9rem 2rem', background:'linear-gradient(135deg,#3b82f6,#2563eb)', color:'white', textDecoration:'none', borderRadius:'0.85rem', fontWeight:'800', boxShadow:'0 8px 24px rgba(59,130,246,0.4)' }}>
              Ver catálogo
            </Link>
            <a href="https://wa.me/573000000000" target="_blank" rel="noopener" style={{ padding:'0.9rem 2rem', background:'rgba(255,255,255,0.08)', color:'white', textDecoration:'none', borderRadius:'0.85rem', fontWeight:'700', border:'1px solid rgba(255,255,255,0.15)', display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <FaWhatsapp color="#4ade80"/> Hablar con un asesor
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
