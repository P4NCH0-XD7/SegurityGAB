"use client";
import Link from "next/link";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaShieldAlt, FaHistory, FaEdit, FaCheck, FaTimes, FaSignOutAlt, FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import toast from "react-hot-toast";

export default function ProfilePage() {
    const { user, isAuthenticated, token, logout, updateUser } = useAuthStore();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const [orders, setOrders] = useState<any[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [showAllOrders, setShowAllOrders] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/login?redirect=/profile");
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch(`${API_URL}/sales/my`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setIsLoadingOrders(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, router, token, API_URL]);

    if (!isAuthenticated || !user) {
        return null;
    }

    const handleCancelOrder = async (orderId: number) => {
        if (!window.confirm("¿Estás seguro de que deseas cancelar este pedido?")) return;

        try {
            const response = await fetch(`${API_URL}/sales/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'CANCELLED' })
            });

            if (response.ok) {
                toast.success("Pedido cancelado correctamente");
                setSelectedOrder(null);
                const refreshResponse = await fetch(`${API_URL}/sales/my`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    setOrders(data);
                }
            } else {
                const error = await response.json();
                toast.error(error.message || "Error al cancelar el pedido");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${API_URL}/users/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                updateUser(updatedUser);
                toast.success("Perfil actualizado correctamente");
                setIsEditing(false);
            } else {
                const error = await response.json();
                toast.error(error.message || "Error al actualizar el perfil");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    const getStatusStyles = (status: string) => {
        const styles: Record<string, { bg: string, color: string, label: string }> = {
            'PENDING':   { bg: '#f39c1222', color: '#f39c12', label: 'Pendiente' },
            'PAID':      { bg: '#2ecc7122', color: '#2ecc71', label: 'Pagado' },
            'SHIPPED':   { bg: '#3498db22', color: '#3498db', label: 'Enviado' },
            'DELIVERED': { bg: '#27ae6022', color: '#27ae60', label: 'Entregado' },
            'CANCELLED': { bg: '#e74c3c22', color: '#e74c3c', label: 'Cancelado' },
        };
        return styles[status] || { bg: 'var(--surface-low)', color: 'var(--on-surface-variant)', label: status };
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
                                    {user.roleId === 1 ? 'Administrador del Sistema' : 'Miembro de SegurityGAB'}
                                </p>
                                
                                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
                                        <FaEnvelope /> <span>{user.email}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
                                        <FaMapMarkerAlt /> <span>Mocoa, Colombia</span>
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
                        {user.roleId === 1 && (
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
                                    <Link href="/dashboard/sales" style={{ textDecoration: 'none' }}>
                                        <div style={{ background: 'var(--surface-low)', padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                                            <div style={{ background: 'rgba(52, 152, 219, 0.1)', width: '40px', height: '40px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3498db' }}>
                                                <FaShoppingCart />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--on-surface)' }}>Gestión de Pedidos</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Ver y actualizar todas las ventas</div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Order History Section (Visible to everyone) */}
                        <div style={{ 
                            background: 'var(--surface-lowest)', 
                            padding: '2.5rem', 
                            borderRadius: 'var(--radius-lg)'
                        }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <FaHistory color="var(--primary)" /> Mis Pedidos
                            </h3>
                            
                            {isLoadingOrders ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
                                    Cargando pedidos...
                                </div>
                            ) : orders.length === 0 ? (
                                <div style={{ padding: '3rem 2rem', textAlign: 'center', background: 'var(--surface-low)', borderRadius: 'var(--radius)', color: 'var(--on-surface-variant)' }}>
                                    <div style={{ marginBottom: '1rem', fontSize: '2rem' }}>📦</div>
                                    <p>Aún no has realizado ningún pedido.</p>
                                    <Link href="/" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                                        Explorar Tienda
                                    </Link>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {(showAllOrders ? orders : orders.slice(0, 5)).map((order, i) => {
                                        const { bg, color, label } = getStatusStyles(order.status);
                                        return (
                                            <div 
                                                key={order.id} 
                                                onClick={() => setSelectedOrder(order)}
                                                style={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center', 
                                                    padding: '1.25rem 1rem', 
                                                    margin: '0 -1rem',
                                                    borderRadius: 'var(--radius)',
                                                    borderBottom: i < (showAllOrders ? orders.length : 5) - 1 ? '1px solid var(--surface-low)' : 'none',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-low)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <div>
                                                    <div style={{ fontWeight: '700' }}>Orden #GAB-2024-{order.id}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>
                                                        {new Date(order.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })} • 
                                                        <span style={{ fontWeight: '600', color: 'var(--on-surface)', marginLeft: '5px' }}>
                                                            ${Number(order.totalAmount).toLocaleString('es-CO')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span style={{ 
                                                    padding: '0.35rem 0.75rem', 
                                                    borderRadius: '1rem', 
                                                    background: bg, 
                                                    color: color, 
                                                    fontSize: '0.75rem', 
                                                    fontWeight: '700' 
                                                }}>
                                                    {label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {orders.length > 5 && (
                                <button 
                                    onClick={() => setShowAllOrders(!showAllOrders)}
                                    style={{ 
                                        width: '100%', 
                                        marginTop: '2rem', 
                                        padding: '1rem', 
                                        borderRadius: 'var(--radius)', 
                                        border: 'none', 
                                        background: 'var(--surface-high)', 
                                        color: 'var(--on-surface)',
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {showAllOrders ? 'Ver menos' : `Ver todo el historial (${orders.length})`}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    background: 'rgba(0,0,0,0.6)', 
                    backdropFilter: 'blur(8px)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    zIndex: 1000,
                    padding: '1.5rem'
                }} onClick={() => setSelectedOrder(null)}>
                    <div style={{ 
                        background: 'var(--surface-lowest)', 
                        width: '100%', 
                        maxWidth: '600px', 
                        borderRadius: 'var(--radius-lg)', 
                        padding: '2.5rem',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        position: 'relative'
                    }} onClick={e => e.stopPropagation()}>
                        <button 
                            onClick={() => setSelectedOrder(null)}
                            style={{ 
                                position: 'absolute', 
                                top: '1.5rem', 
                                right: '1.5rem', 
                                background: 'var(--surface-low)', 
                                border: 'none', 
                                width: '36px', 
                                height: '36px', 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'var(--on-surface-variant)'
                            }}
                        >
                            <FaTimes />
                        </button>

                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Detalle de Pedido</h2>
                        <p style={{ color: 'var(--on-surface-variant)', marginBottom: '2rem' }}>Orden #GAB-2024-{selectedOrder.id}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ background: 'var(--surface-low)', padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '700' }}>Estado del pedido</span>
                                <span style={{ 
                                    padding: '0.5rem 1rem', 
                                    borderRadius: '1rem', 
                                    background: getStatusStyles(selectedOrder.status).bg, 
                                    color: getStatusStyles(selectedOrder.status).color,
                                    fontWeight: '800',
                                    fontSize: '0.85rem'
                                }}>
                                    {getStatusStyles(selectedOrder.status).label}
                                </span>
                            </div>

                            <div>
                                <h4 style={{ fontWeight: '700', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Productos</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {selectedOrder.details?.map((item: any) => (
                                        <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ width: '60px', height: '60px', background: 'var(--surface-low)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                <img 
                                                    src={item.product?.imageUrl || 'https://via.placeholder.com/60'} 
                                                    alt={item.product?.name} 
                                                    style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} 
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{item.product?.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>Cantidad: {item.quantity} • ${Number(item.unitPrice).toLocaleString('es-CO')} c/u</div>
                                            </div>
                                            <div style={{ fontWeight: '700', color: 'var(--primary)' }}>
                                                ${Number(item.subtotal).toLocaleString('es-CO')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ height: '1px', background: 'var(--surface-low)' }}></div>

                            <div>
                                <h4 style={{ fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Dirección de Envío</h4>
                                <p style={{ fontSize: '0.95rem' }}>{selectedOrder.shippingAddress}</p>
                            </div>

                            <div style={{ height: '1px', background: 'var(--surface-low)' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>Total Pagado</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                                    ${Number(selectedOrder.totalAmount).toLocaleString('es-CO')}
                                </span>
                            </div>

                            {selectedOrder.status === 'PENDING' && (
                                <button 
                                    onClick={() => handleCancelOrder(selectedOrder.id)}
                                    style={{ 
                                        marginTop: '2rem',
                                        padding: '1rem',
                                        background: 'rgba(231, 76, 60, 0.1)',
                                        color: '#e74c3c',
                                        border: '1px solid #e74c3c',
                                        borderRadius: 'var(--radius)',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#e74c3c';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(231, 76, 60, 0.1)';
                                        e.currentTarget.style.color = '#e74c3c';
                                    }}
                                >
                                    <FaTimes /> Cancelar Pedido
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
