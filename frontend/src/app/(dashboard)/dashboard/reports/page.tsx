"use client";
import { useState, useEffect } from "react";
import { FaChartLine, FaChartBar, FaCalendarAlt, FaDownload, FaArrowUp, FaBoxOpen, FaExclamationTriangle, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

interface SalesSummary {
    totalOrders: number;
    totalRevenue: number;
    averageOrder: number;
}

interface TopProduct {
    productId: number;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
}

interface MonthSales {
    month: string;
    count: number;
    total: number;
}

interface SalesReport {
    summary: SalesSummary;
    byStatus: { status: string; count: number; total: number }[];
    topProducts: TopProduct[];
    byMonth: MonthSales[];
}

interface InventoryReport {
    summary: { outOfStockCount: number; lowStockCount: number };
    outOfStockProducts: any[];
    lowStockProducts: any[];
    movementsSummary: { type: string; count: number; totalQuantity: number }[];
}

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState<'sales' | 'inventory'>('sales');
    const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
    const [inventoryReport, setInventoryReport] = useState<InventoryReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('MONTH');

    const { token } = useAuthStore();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

    useEffect(() => {
        if (activeTab === 'sales') {
            fetchSalesReport();
        } else {
            fetchInventoryReport();
        }
    }, [activeTab, period]);

    const fetchSalesReport = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/reports/sales?period=${period}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSalesReport(data);
            }
        } catch (error) {
            toast.error("Error al cargar reporte de ventas");
        } finally {
            setLoading(false);
        }
    };

    const fetchInventoryReport = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/reports/inventory`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setInventoryReport(data);
            }
        } catch (error) {
            toast.error("Error al cargar reporte de inventario");
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
    };

    const getMonthName = (monthStr: string) => {
        const [year, month] = monthStr.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleString('es-ES', { month: 'short', year: '2-digit' });
    };

    return (
        <div className="dashboard-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>Reportes y Analítica</h2>
                    <p style={{ color: 'var(--on-surface-variant)' }}>Visualiza el rendimiento de tu negocio</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select 
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', color: 'var(--on-surface)', fontWeight: '700' }}
                    >
                        <option value="TODAY">Hoy</option>
                        <option value="WEEK">Última Semana</option>
                        <option value="MONTH">Último Mes</option>
                        <option value="YEAR">Último Año</option>
                    </select>
                    <button style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', background: 'var(--surface-high)', color: 'var(--on-surface)', border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <FaDownload /> Exportar PDF
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--surface-high)', paddingBottom: '1rem' }}>
                <button 
                    onClick={() => setActiveTab('sales')}
                    style={{ 
                        padding: '0.75rem 1.5rem', 
                        background: activeTab === 'sales' ? 'var(--primary)' : 'none', 
                        color: activeTab === 'sales' ? 'white' : 'var(--on-surface-variant)', 
                        border: 'none', 
                        borderRadius: '0.75rem', 
                        fontWeight: '700', 
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <FaChartLine style={{ marginRight: '0.5rem' }} /> Reporte de Ventas
                </button>
                <button 
                    onClick={() => setActiveTab('inventory')}
                    style={{ 
                        padding: '0.75rem 1.5rem', 
                        background: activeTab === 'inventory' ? 'var(--primary)' : 'none', 
                        color: activeTab === 'inventory' ? 'white' : 'var(--on-surface-variant)', 
                        border: 'none', 
                        borderRadius: '0.75rem', 
                        fontWeight: '700', 
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <FaChartBar style={{ marginRight: '0.5rem' }} /> Reporte de Inventario
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--on-surface-variant)' }}>Generando reporte...</div>
            ) : activeTab === 'sales' && salesReport ? (
                <div style={{ display: 'grid', gap: '2rem' }}>
                    {/* Summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <div className="stat-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ background: 'var(--primary-container)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '0.75rem' }}><FaChartLine size={24} /></div>
                                <span style={{ color: '#10b981', fontWeight: '700', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><FaArrowUp /> Período</span>
                            </div>
                            <h4 style={{ color: 'var(--on-surface-variant)', marginTop: '1rem', fontSize: '0.875rem' }}>Ingresos Totales</h4>
                            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--on-surface)' }}>{formatPrice(salesReport.summary.totalRevenue)}</div>
                        </div>
                        <div className="stat-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ background: 'var(--secondary-container)', color: 'var(--secondary)', padding: '0.75rem', borderRadius: '0.75rem' }}><FaShoppingCart size={24} /></div>
                            </div>
                            <h4 style={{ color: 'var(--on-surface-variant)', marginTop: '1rem', fontSize: '0.875rem' }}>Pedidos Realizados</h4>
                            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--on-surface)' }}>{salesReport.summary.totalOrders}</div>
                        </div>
                        <div className="stat-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '0.75rem', borderRadius: '0.75rem' }}><FaCalendarAlt size={24} /></div>
                            </div>
                            <h4 style={{ color: 'var(--on-surface-variant)', marginTop: '1rem', fontSize: '0.875rem' }}>Ticket Promedio</h4>
                            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--on-surface)' }}>{formatPrice(salesReport.summary.averageOrder)}</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                        {/* Monthly Chart (Simulated) */}
                        <div className="stat-card">
                            <h3 style={{ marginBottom: '2rem', fontSize: '1.1rem', fontWeight: '800' }}>Ventas por Mes</h3>
                            <div style={{ display: 'flex', alignItems: 'flex-end', height: '250px', gap: '1rem', paddingBottom: '2rem' }}>
                                {salesReport.byMonth.map(m => {
                                    const maxTotal = Math.max(...salesReport.byMonth.map(x => x.total), 1);
                                    const height = (m.total / maxTotal) * 100;
                                    return (
                                        <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '100%', height: `${height}%`, background: 'var(--primary)', borderRadius: '0.5rem 0.5rem 0 0', position: 'relative' }} title={formatPrice(m.total)}>
                                                <div style={{ position: 'absolute', top: '-1.5rem', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', fontWeight: '700' }}>{formatPrice(m.total).split(',')[0]}</div>
                                            </div>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', fontWeight: '700' }}>{getMonthName(m.month)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="stat-card">
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '800' }}>Top Productos</h3>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {salesReport.topProducts.map((p, idx) => (
                                    <div key={p.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--surface-low)', borderRadius: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)' }}>#{idx+1}</span>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '700', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.productName}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{p.totalQuantity} ud.</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)' }}>{formatPrice(p.totalRevenue)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : activeTab === 'inventory' && inventoryReport ? (
                <div style={{ display: 'grid', gap: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {/* Critical Alerts */}
                        <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <FaExclamationTriangle color="#ef4444" size={24} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Agotados ({inventoryReport.summary.outOfStockCount})</h3>
                            </div>
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                {inventoryReport.outOfStockProducts.length === 0 ? (
                                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>No hay productos agotados.</p>
                                ) : inventoryReport.outOfStockProducts.slice(0, 5).map(p => (
                                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '0.5rem' }}>
                                        <span style={{ fontWeight: '700' }}>{p.name}</span>
                                        <span style={{ color: 'var(--on-surface-variant)' }}>{p.category}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <FaExclamationTriangle color="#f59e0b" size={24} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Stock Bajo ({inventoryReport.summary.lowStockCount})</h3>
                            </div>
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                {inventoryReport.lowStockProducts.length === 0 ? (
                                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>Todo el stock está en niveles óptimos.</p>
                                ) : inventoryReport.lowStockProducts.slice(0, 5).map(p => (
                                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.5rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '0.5rem' }}>
                                        <span style={{ fontWeight: '700' }}>{p.name}</span>
                                        <span style={{ fontWeight: '800', color: '#f59e0b' }}>{p.stock} ud.</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '800' }}>Resumen de Movimientos</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            {inventoryReport.movementsSummary.map(m => (
                                <div key={m.type} style={{ padding: '1.5rem', background: 'var(--surface-low)', borderRadius: '1rem', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{m.type === 'IN' ? 'Entradas' : m.type === 'OUT' ? 'Salidas' : 'Ajustes'}</div>
                                    <div style={{ fontSize: '2rem', fontWeight: '900', color: m.type === 'IN' ? '#10b981' : m.type === 'OUT' ? '#ef4444' : '#f59e0b' }}>{m.count}</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--on-surface-variant)' }}>Total: {m.totalQuantity} unidades</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--on-surface-variant)' }}>No hay datos disponibles para este período.</div>
            )}
        </div>
    );
}
