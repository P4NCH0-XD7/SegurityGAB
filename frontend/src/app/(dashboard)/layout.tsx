import Link from "next/link";
import { FaThLarge, FaShoppingCart, FaBoxes, FaUsers, FaChartBar, FaCog, FaBell, FaUserCircle } from "react-icons/fa";
import "../../styles/dashboard/dashboard.css";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const navItems = [
        { label: "Resumen", icon: <FaThLarge />, href: "/dashboard" },
        { label: "Pedidos", icon: <FaShoppingCart />, href: "/dashboard/sales" },
        { label: "Inventario", icon: <FaBoxes />, href: "/dashboard/inventory" },
        { label: "Clientes", icon: <FaUsers />, href: "/dashboard/customers" },
        { label: "Estadísticas", icon: <FaChartBar />, href: "/dashboard/reports" },
        { label: "Configuración", icon: <FaCog />, href: "/dashboard/settings" },
    ];

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-title">
                    <h1>SegurityGAB</h1>
                </div>
                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {navItems.map((item) => (
                            <li key={item.label} style={{ marginBottom: '0.5rem' }}>
                                <Link href={item.href} className="nav-link">
                                    <span style={{ marginRight: '0.75rem' }}>{item.icon}</span>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* TopBar */}
                <header className="topbar">
                    <div style={{ color: '#64748b' }}>Bienvenido de nuevo, Admin</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <FaBell style={{ color: '#64748b', cursor: 'pointer' }} size={20} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>Admin Gaby</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Super Manager</div>
                            </div>
                            <FaUserCircle size={32} color="#94a3b8" />
                        </div>
                    </div>
                </header>

                <main style={{ padding: '2rem', flex: 1 }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
