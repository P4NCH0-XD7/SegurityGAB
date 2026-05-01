"use client";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaSearch, FaEye, FaEdit, FaCheckCircle, FaTruck, FaTimesCircle, FaClock, FaBox, FaDownload } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

interface SaleDetail {
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product: {
        name: string;
        sku?: string;
    }
}

interface Sale {
    id: number;
    userId: number;
    totalAmount: number;
    status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    shippingAddress: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
    details?: SaleDetail[];
}

export default function SalesManagementPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const { token } = useAuthStore();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/sales`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSales(data);
            } else {
                toast.error("Error al cargar pedidos");
            }
        } catch (error) {
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    const fetchSaleDetails = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/sales/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSelectedSale(data);
                setIsModalOpen(true);
            }
        } catch (error) {
            toast.error("Error al cargar detalles del pedido");
        }
    };

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        try {
            const res = await fetch(`${API_URL}/sales/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                toast.success(`Pedido actualizado a ${newStatus}`);
                fetchSales();
                if (selectedSale?.id === id) {
                    fetchSaleDetails(id);
                }
            } else {
                const err = await res.json();
                toast.error(err.message || "Error al actualizar");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'PENDING': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', icon: <FaClock /> };
            case 'PAID': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', icon: <FaCheckCircle /> };
            case 'SHIPPED': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', icon: <FaTruck /> };
            case 'DELIVERED': return { bg: 'var(--secondary-container)', color: 'var(--secondary)', icon: <FaBox /> };
            case 'CANCELLED': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', icon: <FaTimesCircle /> };
            default: return { bg: 'var(--surface-high)', color: 'var(--on-surface-variant)', icon: null };
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
    };

    const filteredSales = sales.filter(s => 
        s.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.id.toString().includes(searchTerm) ||
        s.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToCSV = () => {
        if (sales.length === 0) return;
        
        const headers = ["ID", "Fecha", "Cliente", "Email", "Total", "Estado", "Direccion"];
        const rows = sales.map(sale => [
            sale.id,
            new Date(sale.createdAt).toLocaleDateString(),
            sale.user?.name || 'Cliente',
            sale.user?.email || 'N/A',
            sale.totalAmount,
            sale.status,
            sale.shippingAddress || 'N/A'
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `ventas_seguritygab_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="dashboard-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>Gestión de Pedidos</h2>
                    <p style={{ color: 'var(--on-surface-variant)' }}>Administra las ventas y estados de entrega</p>
                </div>
                <button 
                    onClick={exportToCSV}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', background: 'var(--surface-high)', color: 'var(--on-surface)', border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                >
                    <FaDownload /> Exportar CSV
                </button>
            </div>

            {/* Filters */}
            <div style={{ 
                background: 'var(--surface-low)', 
                padding: '1rem', 
                borderRadius: '1rem', 
                marginBottom: '2rem'
            }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                    <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)' }} />
                    <input 
                        type="text" 
                        placeholder="Buscar por ID, cliente o estado..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: '0.75rem 1rem 0.75rem 3rem', 
                            background: 'var(--surface)', 
                            border: '1px solid var(--surface-high)', 
                            borderRadius: '0.75rem',
                            color: 'var(--on-surface)',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--surface-low)', color: 'var(--on-surface-variant)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                            <th style={{ padding: '1.25rem', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left' }}>Cliente</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left' }}>Fecha</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left' }}>Total</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left' }}>Estado</th>
                            <th style={{ padding: '1.25rem', textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>Cargando pedidos...</td></tr>
                        ) : filteredSales.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>No se encontraron pedidos</td></tr>
                        ) : filteredSales.map((sale) => {
                            const style = getStatusStyle(sale.status);
                            return (
                                <tr key={sale.id} style={{ borderBottom: '1px solid var(--surface-high)' }}>
                                    <td style={{ padding: '1.25rem', fontWeight: '700', color: 'var(--on-surface)' }}>#{sale.id}</td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ fontWeight: '700', color: 'var(--on-surface)' }}>{sale.user?.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>{sale.user?.email}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem', color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>
                                        {new Date(sale.createdAt).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>
                                        {formatPrice(sale.totalAmount)}
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <span style={{ 
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.35rem 0.75rem', 
                                            borderRadius: '2rem', 
                                            fontSize: '0.75rem', 
                                            fontWeight: '700',
                                            background: style.bg,
                                            color: style.color
                                        }}>
                                            {style.icon} {sale.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                                        <button 
                                            onClick={() => fetchSaleDetails(sale.id)}
                                            style={{ background: 'var(--surface-high)', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', color: 'var(--on-surface)', fontWeight: '600', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                                        >
                                            <FaEye /> Detalles
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Details Modal */}
            {isModalOpen && selectedSale && (
                <div style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    background: 'rgba(0,0,0,0.5)', 
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div style={{ 
                        background: 'var(--surface)', 
                        padding: '2.5rem', 
                        borderRadius: '1.5rem', 
                        width: '100%',
                        maxWidth: '800px', 
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid var(--surface-high)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <div>
                                <h3 style={{ fontWeight: '800', fontSize: '1.5rem', color: 'var(--on-surface)' }}>
                                    Detalle del Pedido #{selectedSale.id}
                                </h3>
                                <p style={{ color: 'var(--on-surface-variant)' }}>Realizado el {new Date(selectedSale.createdAt).toLocaleString()}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                            <div style={{ background: 'var(--surface-low)', padding: '1.5rem', borderRadius: '1rem' }}>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '1rem' }}>Información del Cliente</h4>
                                <div style={{ fontWeight: '700', color: 'var(--on-surface)' }}>{selectedSale.user?.name}</div>
                                <div style={{ color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>{selectedSale.user?.email}</div>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Dirección de Envío</h4>
                                <div style={{ color: 'var(--on-surface)', fontSize: '0.9rem' }}>{selectedSale.shippingAddress}</div>
                            </div>
                            <div style={{ background: 'var(--surface-low)', padding: '1.5rem', borderRadius: '1rem' }}>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '1rem' }}>Estado del Pedido</h4>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <span style={{ 
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem', 
                                        borderRadius: '2rem', 
                                        fontSize: '0.85rem', 
                                        fontWeight: '800',
                                        background: getStatusStyle(selectedSale.status).bg,
                                        color: getStatusStyle(selectedSale.status).color
                                    }}>
                                        {getStatusStyle(selectedSale.status).icon} {selectedSale.status}
                                    </span>
                                </div>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '1rem' }}>Acciones de Estado</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(st => (
                                        <button 
                                            key={st}
                                            onClick={() => handleUpdateStatus(selectedSale.id, st)}
                                            disabled={selectedSale.status === st}
                                            style={{ 
                                                padding: '0.4rem 0.8rem', 
                                                borderRadius: '0.5rem', 
                                                border: '1px solid var(--surface-high)',
                                                background: selectedSale.status === st ? 'var(--surface-high)' : 'var(--surface)',
                                                color: selectedSale.status === st ? 'var(--on-surface-variant)' : 'var(--on-surface)',
                                                fontSize: '0.7rem',
                                                fontWeight: '700',
                                                cursor: selectedSale.status === st ? 'default' : 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {st}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--on-surface)', marginBottom: '1rem' }}>Productos en este pedido</h4>
                        <div style={{ border: '1px solid var(--surface-high)', borderRadius: '1rem', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: 'var(--surface-low)' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Producto</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>P. Unitario</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Cant.</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedSale.details?.map((detail) => (
                                        <tr key={detail.id} style={{ borderTop: '1px solid var(--surface-high)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: '700', color: 'var(--on-surface)' }}>{detail.product?.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)' }}>SKU: {detail.product?.sku || 'N/A'}</div>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--on-surface-variant)' }}>{formatPrice(detail.unitPrice)}</td>
                                            <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '700' }}>{detail.quantity}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '800', color: 'var(--on-surface)' }}>{formatPrice(detail.subtotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot style={{ background: 'var(--surface-low)' }}>
                                    <tr>
                                        <td colSpan={3} style={{ padding: '1.25rem', textAlign: 'right', fontWeight: '800', fontSize: '1.1rem' }}>Total</td>
                                        <td style={{ padding: '1.25rem', textAlign: 'right', fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary)' }}>{formatPrice(selectedSale.totalAmount)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
