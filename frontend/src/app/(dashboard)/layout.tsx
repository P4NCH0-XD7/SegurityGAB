"use client";
import Link from "next/link";
import { FaThLarge, FaShoppingCart, FaBoxes, FaUsers, FaChartBar, FaCog, FaBell, FaUserCircle } from "react-icons/fa";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import "../../styles/dashboard/dashboard.css";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        // Redirigir si no está autenticado o si no es admin (roleId !== 1)
        if (!isAuthenticated || user?.roleId !== 1) {
            router.replace("/");
        }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || user?.roleId !== 1) {
        return null; // Evitar parpadeo de contenido mientras redirige
    }

    const navItems = [
        { label: "Resumen", icon: <FaThLarge />, href: "/dashboard" },
        { label: "Pedidos", icon: <FaShoppingCart />, href: "/dashboard/sales" },
        { label: "Productos", icon: <FaBoxes />, href: "/dashboard/products" },
        { label: "Usuarios", icon: <FaUsers />, href: "/dashboard/users" },
        { label: "Categorías", icon: <FaCog />, href: "/dashboard/categories" },
        { label: "Reportes", icon: <FaChartBar />, href: "/dashboard/reports" },
    ];

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-title">
                    SegurityGAB
                </div>
                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {navItems.map((item) => (
                            <li key={item.label}>
                                <Link href={item.href} className="nav-link">
                                    <span style={{ fontSize: '1.2rem', display: 'flex' }}>{item.icon}</span>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="dashboard-main">
                {/* TopBar */}
                <header className="topbar">
                    <div style={{ color: 'var(--on-surface-variant)', fontWeight: '600' }}>
                        Bienvenido de nuevo, <span style={{ color: 'var(--on-surface)' }}>{user?.name || 'Administrador'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <FaBell style={{ color: 'var(--on-surface-variant)' }} size={20} />
                            <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--error)', borderRadius: '50%' }}></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '0.5rem 1rem', background: 'var(--surface-low)', borderRadius: '2rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--on-surface)' }}>{user?.name}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Panel de Gestión</div>
                            </div>
                            <FaUserCircle size={32} color="var(--primary)" />
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
