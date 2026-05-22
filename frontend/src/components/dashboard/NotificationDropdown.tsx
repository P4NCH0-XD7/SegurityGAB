"use client";
import { useState, useEffect } from "react";
import { FaBell, FaExclamationTriangle, FaBox, FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'warning' | 'info' | 'success';
    href: string;
    date: Date;
    isRead: boolean;
}

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { token } = useAuthStore();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

    useEffect(() => {
        fetchAlerts();
        // Cargar alertas cada 5 minutos
        const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchAlerts = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/reports/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const newNotifications: Notification[] = [];

                if (data.outOfStock > 0) {
                    newNotifications.push({
                        id: 'out-of-stock',
                        title: 'Productos Agotados',
                        message: `Hay ${data.outOfStock} productos sin existencias.`,
                        type: 'warning',
                        href: '/dashboard/reports',
                        date: new Date(),
                        isRead: false
                    });
                }

                if (data.lowStock > 0) {
                    newNotifications.push({
                        id: 'low-stock',
                        title: 'Stock Bajo',
                        message: `${data.lowStock} productos están por debajo del límite.`,
                        type: 'warning',
                        href: '/dashboard/reports',
                        date: new Date(),
                        isRead: false
                    });
                }

                if (data.pendingSales > 0) {
                    newNotifications.push({
                        id: 'pending-sales',
                        title: 'Pedidos Pendientes',
                        message: `Tienes ${data.pendingSales} pedidos esperando gestión.`,
                        type: 'info',
                        href: '/dashboard/sales',
                        date: new Date(),
                        isRead: false
                    });
                }

                setNotifications(newNotifications);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length + 1;

    const getIcon = (type: string) => {
        switch (type) {
            case 'warning': return <FaExclamationTriangle color="#ef4444" />;
            case 'info': return <FaInfoCircle color="#3b82f6" />;
            default: return <FaBell color="var(--primary)" />;
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <div
                data-testid="notification-bell"
                onClick={() => setIsOpen(!isOpen)}
                style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
                <FaBell style={{ color: 'var(--on-surface-variant)' }} size={20} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: 'var(--error)',
                        color: 'white',
                        fontSize: '0.6rem',
                        fontWeight: '800',
                        padding: '2px 5px',
                        borderRadius: '10px',
                        minWidth: '15px',
                        textAlign: 'center',
                        border: '2px solid var(--surface)'
                    }}>
                        {unreadCount}
                    </span>
                )}
            </div>

            {isOpen && (
                <div className="notifications-dropdown">
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--surface-high)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, fontWeight: '800', fontSize: '1rem' }}>Notificaciones</h4>
                        {unreadCount > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>{unreadCount} nuevas</span>}
                    </div>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
                                <FaBell size={32} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>No tienes notificaciones pendientes</p>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <Link
                                    key={n.id}
                                    href={n.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`notification-item ${n.isRead ? '' : 'unread'}`}
                                    style={{ display: 'flex', gap: '1rem', textDecoration: 'none', color: 'inherit' }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '0.75rem',
                                        background: 'var(--surface-high)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem',
                                        flexShrink: 0
                                    }}>
                                        {getIcon(n.type)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--on-surface)', marginBottom: '0.2rem' }}>{n.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', lineHeight: '1.4' }}>{n.message}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)', marginTop: '0.5rem', fontWeight: '600' }}>Hace un momento</div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                    {notifications.length > 0 && (
                        <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid var(--surface-high)', background: 'var(--surface-low)' }}>
                            <Link href="/dashboard/reports" onClick={() => setIsOpen(false)} style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', textDecoration: 'none' }}>
                                Ver todos los reportes
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
