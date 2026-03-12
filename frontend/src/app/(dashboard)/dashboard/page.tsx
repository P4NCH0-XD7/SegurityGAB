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
        <div className="dashboard-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>Resumen General</h2>
                <p style={{ color: '#64748b' }}>Bienvenido al panel de control de SegurityGAB</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {stats.map((stat, idx) => (
                    <div key={idx} className="stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '600' }}>{stat.label}</div>
                            <div style={{ color: stat.color, background: `${stat.color}10`, padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                {stat.icon} {stat.trend}
                            </div>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Sales Chart SVG */}
                    <div className="stat-card">
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Evolución de Ventas (7 días)</h3>
                        <div style={{ height: '240px', position: 'relative' }}>
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
                                    <line key={i} x1={i * 66} y1="0" x2={i * 66} y2="150" stroke="#f1f5f9" strokeWidth="1" />
                                ))}
                            </svg>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.75rem', marginTop: '1rem' }}>
                                <span>Lun</span><span>Mar</span><span>Mie</span><span>Jue</span><span>Vie</span><span>Sab</span><span>Dom</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Recent Orders Table */}
                    <div className="stat-card">
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Pedidos Recientes</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ color: '#64748b', fontSize: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                                        <th style={{ padding: '0.75rem 0' }}>ID</th>
                                        <th style={{ padding: '0.75rem 0' }}>CLIENTE</th>
                                        <th style={{ padding: '0.75rem 0' }}>TOTAL</th>
                                        <th style={{ padding: '0.75rem 0' }}>ESTADO</th>
                                        <th style={{ padding: '0.75rem 0' }}>FECHA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order, idx) => (
                                        <tr key={idx} style={{ fontSize: '0.875rem', borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{ padding: '1rem 0', fontWeight: '600' }}>{order.id}</td>
                                            <td style={{ padding: '1rem 0' }}>{order.customer}</td>
                                            <td style={{ padding: '1rem 0' }}>{order.total}</td>
                                            <td style={{ padding: '1rem 0' }}>
                                                <span style={{ 
                                                    padding: '0.25rem 0.5rem', 
                                                    borderRadius: '1rem', 
                                                    fontSize: '0.7rem',
                                                    background: order.status === 'Completado' ? '#dcfce7' : '#fef9c3',
                                                    color: order.status === 'Completado' ? '#166534' : '#854d0e'
                                                }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem 0', color: '#64748b' }}>{order.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Alertas Críticas</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {alerts.map((alert, idx) => (
                            <div key={idx} className="alert-item">
                                <div className="icon-box" style={{ background: `${alert.color}15`, color: alert.color }}>
                                    {alert.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{alert.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{alert.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
