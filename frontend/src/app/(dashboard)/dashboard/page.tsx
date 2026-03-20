import { FaChartLine, FaShoppingBag, FaUserCheck, FaExclamationTriangle, FaBoxOpen, FaClipboardList, FaTicketAlt } from "react-icons/fa";

export default function DashboardPage() {
    const stats = [
        { label: "Ventas Totales", value: "$1,240.00", trend: "+15%", color: "#10b981", icon: <FaChartLine /> },
        { label: "Pedidos Nuevos", value: "12", trend: "-5%", color: "#ef4444", icon: <FaShoppingBag /> },
        { label: "Nuevos Clientes", value: "8", trend: "Estable", color: "#64748b", icon: <FaUserCheck /> },
        { label: "Alertas Activas", value: "3", trend: "Acción", color: "#f59e0b", icon: <FaExclamationTriangle /> },
    ];

    const alerts = [
        { type: "Stock", title: "Producto sin stock", desc: "Cámara exterior WiFi 4K (20 uds)", icon: <FaBoxOpen />, color: "#ef4444" },
        { type: "Pago", title: "Pedido pendiente", desc: "Orden #ORD-9401 espera pago", icon: <FaClipboardList />, color: "#f59e0b" },
        { type: "Soporte", title: "Ticket abierto", desc: "Reclamación de garantía #TK-102", icon: <FaTicketAlt />, color: "#3b82f6" },
    ];

    const recentOrders = [
        { id: "#ORD-9401", customer: "Juan Pérez", total: "$129.00", status: "Pendiente", date: "Hace 2h" },
        { id: "#ORD-9398", customer: "Maria Silva", total: "$245.50", status: "Completado", date: "Hace 5h" },
        { id: "#ORD-9395", customer: "Carlos Ruiz", total: "$89.00", status: "Completado", date: "Ayer" },
    ];

    return (
        <div className="dashboard-content" style={{ background: 'var(--surface)' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>Resumen General</h2>
                <p style={{ color: 'var(--on-surface-variant)' }}>Bienvenido al panel de control de SegurityGAB</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                {stats.map((stat, idx) => (
                    <div key={idx} className="stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                            <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{stat.label}</div>
                            <div style={{ color: stat.color, background: `${stat.color}15`, padding: '0.35rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                {stat.icon} {stat.trend}
                            </div>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Sales Chart SVG */}
                    <div className="stat-card">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '2rem', color: 'var(--on-surface)' }}>Evolución de Ventas (7 días)</h3>
                        <div style={{ height: '260px', position: 'relative' }}>
                            <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%' }}>
                                <path 
                                    d="M0,120 L50,110 L100,130 L150,90 L200,100 L250,60 L300,70 L350,40 L400,50" 
                                    fill="none" 
                                    stroke="var(--primary)" 
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                                <path 
                                    d="M0,120 L50,110 L100,130 L150,90 L200,100 L250,60 L300,70 L350,40 L400,50 V150 H0 Z" 
                                    fill="url(#gradient)"
                                    opacity="0.1"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="var(--primary)" />
                                        <stop offset="100%" stopColor="white" />
                                    </linearGradient>
                                </defs>
                                {[0,1,2,3,4,5,6].map(i => (
                                    <line key={i} x1={i * 66} y1="0" x2={i * 66} y2="150" stroke="var(--surface-high)" strokeWidth="1" />
                                ))}
                            </svg>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--on-surface-variant)', fontSize: '0.75rem', marginTop: '1.5rem', fontWeight: '600' }}>
                                <span>Lun</span><span>Mar</span><span>Mie</span><span>Jue</span><span>Vie</span><span>Sab</span><span>Dom</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Recent Orders Table */}
                    <div className="stat-card">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '2rem', color: 'var(--on-surface)' }}>Pedidos Recientes</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ color: 'var(--on-surface-variant)', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em' }}>
                                        <th style={{ padding: '1rem 0', textTransform: 'uppercase' }}>ID</th>
                                        <th style={{ padding: '1rem 0', textTransform: 'uppercase' }}>CLIENTE</th>
                                        <th style={{ padding: '1rem 0', textTransform: 'uppercase' }}>TOTAL</th>
                                        <th style={{ padding: '1rem 0', textTransform: 'uppercase' }}>ESTADO</th>
                                        <th style={{ padding: '1rem 0', textTransform: 'uppercase' }}>FECHA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order, idx) => (
                                        <tr key={idx} style={{ fontSize: '0.9rem', color: 'var(--on-surface)' }}>
                                            <td style={{ padding: '1.25rem 0', fontWeight: '700' }}>{order.id}</td>
                                            <td style={{ padding: '1.25rem 0' }}>{order.customer}</td>
                                            <td style={{ padding: '1.25rem 0', fontWeight: '600' }}>{order.total}</td>
                                            <td style={{ padding: '1.25rem 0' }}>
                                                <span style={{ 
                                                    padding: '0.35rem 0.75rem', 
                                                    borderRadius: '2rem', 
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    background: order.status === 'Completado' ? 'var(--secondary-container)' : 'rgba(245, 158, 11, 0.15)',
                                                    color: order.status === 'Completado' ? 'var(--secondary)' : '#b45309'
                                                }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.25rem 0', color: 'var(--on-surface-variant)' }}>{order.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="stat-card" style={{ height: 'fit-content' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '2rem', color: 'var(--on-surface)' }}>Alertas Críticas</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {alerts.map((alert, idx) => (
                            <div key={idx} className="alert-item" style={{ background: 'var(--surface-low)', transition: 'all 0.2s ease' }}>
                                <div className="icon-box" style={{ background: `${alert.color}15`, color: alert.color, borderRadius: '0.75rem' }}>
                                    {alert.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--on-surface)' }}>{alert.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginTop: '0.2rem' }}>{alert.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button style={{ 
                        width: '100%', 
                        marginTop: '2.5rem', 
                        padding: '1rem', 
                        borderRadius: 'var(--radius)', 
                        border: 'none', 
                        background: 'var(--surface-high)', 
                        color: 'var(--on-surface)',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                    }}>
                        Ver todas las alertas
                    </button>
                </div>
            </div>
        </div>
    );
}
