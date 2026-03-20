"use client";
import Link from "next/link";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaShieldAlt, FaHistory, FaEdit, FaCheck, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import toast from "react-hot-toast";

export default function ProfilePage() {
    const { user, isAuthenticated, token, logout } = useAuthStore();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '' // Podríamos traerlo de un fetch más profundo
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/login?redirect=/profile");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated || !user) {
        return null;
    }

    const handleSave = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast.success("Perfil actualizado correctamente");
                setIsEditing(false);
                // Aquí se podría actualizar el store si el backend devuelve el usuario
            } else {
                toast.error("Error al actualizar el perfil");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    return (
        <div style={{ background: 'var(--surface)', minHeight: '100vh' }}>
            <Navbar />
            
            <main className="container" style={{ padding: '80px 1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '3rem' }}>
                    {/* Profile Info Card */}
                    <div style={{ 
                        background: 'var(--surface-lowest)', 
                        padding: '3rem 2rem', 
                        borderRadius: 'var(--radius-lg)',
                        height: 'fit-content',
                        textAlign: 'center',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ 
                            width: '120px', 
                            height: '120px', 
                            background: 'var(--surface-low)', 
                            borderRadius: '50%', 
                            margin: '0 auto 2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--primary)',
                            position: 'relative'
                        }}>
                            <FaUser size={60} />
                            <div style={{ 
                                position: 'absolute', 
                                bottom: 0, 
                                right: 0, 
                                background: 'var(--primary)', 
                                padding: '0.4rem 0.8rem', 
                                borderRadius: '1rem', 
                                color: 'white', 
                                fontSize: '0.7rem', 
                                fontWeight: '800',
                                textTransform: 'uppercase'
                            }}>
                                {user.roleId === 1 ? 'Admin' : 'Cliente'}
                            </div>
                        </div>

                        {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                                <input 
                                    className="input" 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    placeholder="Nombre completo"
                                />
                                <input 
                                    className="input" 
                                    value={formData.email} 
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    placeholder="Correo electrónico"
                                />
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1 }}>
                                        <FaCheck /> Guardar
                                    </button>
                                    <button onClick={() => setIsEditing(false)} className="btn" style={{ flex: 1, background: 'var(--surface-high)' }}>
                                        <FaTimes /> Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{user.name}</h2>
                                <p style={{ color: 'var(--on-surface-variant)', marginBottom: '2rem' }}>
                                    {user.roleId === 1 ? 'Administrador del Sistema' : 'Miembro desde 2024'}
                                </p>
                                
                                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
                                        <FaEnvelope /> <span>{user.email}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
                                        <FaMapMarkerAlt /> <span>Medellín, Colombia</span>
                                    </div>
                                </div>

                                <button onClick={() => setIsEditing(true)} className="btn btn-primary" style={{ width: '100%', marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <FaEdit /> Editar Perfil
                                </button>

                                <button 
                                    onClick={() => {
                                        logout();
                                        router.replace('/login');
                                    }} 
                                    className="btn" 
                                    style={{ 
                                        width: '100%', 
                                        marginTop: '1rem', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '0.5rem',
                                        background: 'rgba(255, 68, 68, 0.1)',
                                        color: '#ff4444',
                                        border: '1px solid #ff4444'
                                    }}
                                >
                                    <FaSignOutAlt /> Cerrar Sesión
                                </button>
                            </>
                        )}
                    </div>

                    {/* Dashboard Sections */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {user.roleId === 1 ? (
                            /* Admin Specific Sections */
                            <div style={{ 
                                background: 'var(--surface-lowest)', 
                                padding: '2.5rem', 
                                borderRadius: 'var(--radius-lg)'
                            }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <FaShieldAlt color="var(--primary)" /> Panel de Administración
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                                        <div style={{ background: 'var(--surface-low)', padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                                            <div style={{ background: 'var(--primary-container)', width: '40px', height: '40px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                                <FaShieldAlt />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--on-surface)' }}>Ir al Dashboard</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Gestión general del sistema</div>
                                            </div>
                                        </div>
                                    </Link>
                                    <Link href="/dashboard/inventory" style={{ textDecoration: 'none' }}>
                                        <div style={{ background: 'var(--surface-low)', padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                                            <div style={{ background: 'var(--secondary-container)', width: '40px', height: '40px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                                                <FaHistory />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--on-surface)' }}>Inventario</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Control de stock y productos</div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            /* Client Specific Sections */
                            <>
                                <div style={{ 
                                    background: 'var(--surface-lowest)', 
                                    padding: '2.5rem', 
                                    borderRadius: 'var(--radius-lg)'
                                }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <FaShieldAlt color="var(--primary)" /> Mis Dispositivos Seguros
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div style={{ background: 'var(--surface-low)', padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ background: 'var(--surface-lowest)', width: '40px', height: '40px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                                                <FaShieldAlt />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Cámara Sala Principal</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Activa y Protegiendo</div>
                                            </div>
                                        </div>
                                        <div style={{ background: 'var(--surface-low)', padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ background: 'var(--surface-lowest)', width: '40px', height: '40px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                                                <FaShieldAlt />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Sensor Movimiento Garaje</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Activa y Protegiendo</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ 
                                    background: 'var(--surface-lowest)', 
                                    padding: '2.5rem', 
                                    borderRadius: 'var(--radius-lg)'
                                }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <FaHistory color="var(--primary)" /> Pedidos Recientes
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {[1, 2].map(i => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: i === 1 ? '1px solid var(--surface-low)' : 'none' }}>
                                                <div>
                                                    <div style={{ fontWeight: '700' }}>Orden #GAB-2024-{i}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>20 Mar 2026 • $129.000</div>
                                                </div>
                                                <span style={{ padding: '0.35rem 0.75rem', borderRadius: '1rem', background: 'var(--secondary-container)', color: 'var(--secondary)', fontSize: '0.75rem', fontWeight: '700' }}>
                                                    Completado
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <button style={{ 
                                        width: '100%', 
                                        marginTop: '2rem', 
                                        padding: '1rem', 
                                        borderRadius: 'var(--radius)', 
                                        border: 'none', 
                                        background: 'var(--surface-high)', 
                                        color: 'var(--on-surface)',
                                        fontWeight: '700'
                                    }}>
                                        Ver todo el historial
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
