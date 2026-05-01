"use client";
import Link from "next/link";
import { FaThLarge, FaShoppingCart, FaBoxes, FaUsers, FaChartBar, FaCog, FaBell, FaUserCircle, FaSignOutAlt, FaStore, FaClipboardList, FaBars, FaTimes, FaTags } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import NotificationDropdown from "@/components/dashboard/NotificationDropdown";
import "../../styles/dashboard/dashboard.css";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, logout, checkAuth, isInitialized } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isInitialized) {
            checkAuth();
        }
    }, [isInitialized, checkAuth]);

    useEffect(() => {
        if (isInitialized) {
            if (!isAuthenticated || user?.roleId !== 1) {
                router.replace("/");
            }
        }
    }, [isInitialized, isAuthenticated, user, router]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    if (!isInitialized || !isAuthenticated || user?.roleId !== 1) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--surface)' }}>
                <div>Cargando dashboard...</div>
            </div>
        );
    }

    const navItems = [
        { label: "Resumen", icon: <FaThLarge />, href: "/dashboard" },
        { label: "Pedidos", icon: <FaShoppingCart />, href: "/dashboard/sales" },
        { label: "Productos", icon: <FaBoxes />, href: "/dashboard/products" },
        { label: "Inventario", icon: <FaClipboardList />, href: "/dashboard/inventory" },
        { label: "Categorías", icon: <FaTags />, href: "/dashboard/categories" },
        { label: "Usuarios", icon: <FaUsers />, href: "/dashboard/users" },
        { label: "Reportes", icon: <FaChartBar />, href: "/dashboard/reports" },
    ];

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <Link href="/dashboard" className="sidebar-title" style={{ textDecoration: 'none', color: 'inherit', margin: 0 }}>
                        SegurityGAB
                    </Link>
                    <button 
                        onClick={() => setIsSidebarOpen(false)} 
                        style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', fontSize: '1.5rem', display: 'none' }}
                        className="mobile-only"
                    >
                        <FaTimes />
                    </button>
                </div>
                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {navItems.map((item) => (
                            <li key={item.label}>
                                <Link 
                                    href={item.href} 
                                    className={`nav-link ${pathname === item.href ? 'active' : ''}`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <span style={{ fontSize: '1.2rem', display: 'flex' }}>{item.icon}</span>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid var(--surface-high)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link href="/" className="nav-link" style={{ color: 'var(--secondary)' }}>
                        <FaStore /> Volver a la Tienda
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="dashboard-main">
                {/* TopBar */}
                <header className="topbar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            style={{ background: 'none', border: 'none', color: 'var(--on-surface)', cursor: 'pointer', fontSize: '1.5rem', display: 'none' }}
                            className="mobile-only"
                        >
                            <FaBars />
                        </button>
                        <div style={{ color: 'var(--on-surface-variant)', fontWeight: '600' }} className="desktop-only">
                            Bienvenido de nuevo, <span style={{ color: 'var(--on-surface)' }}>{user?.name || 'Administrador'}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <NotificationDropdown />
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1rem', 
                            padding: '0.5rem 1rem', 
                            background: 'var(--surface-low)', 
                            borderRadius: '2rem',
                            border: '1px solid var(--surface-high)'
                        }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--on-surface)' }}>{user?.name}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin</div>
                            </div>
                            <Link href="/profile" style={{ color: 'var(--primary)', display: 'flex' }}>
                                <FaUserCircle size={32} />
                            </Link>
                            <button 
                                onClick={handleLogout}
                                title="Cerrar Sesión"
                                style={{ 
                                    background: 'var(--surface-high)', 
                                    border: 'none', 
                                    color: 'var(--error)', 
                                    cursor: 'pointer',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    marginLeft: '0.5rem'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'var(--surface-high)'}
                            >
                                <FaSignOutAlt size={16} />
                            </button>
                        </div>
                    </div>
                </header>

                <main style={{ flex: 1 }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
