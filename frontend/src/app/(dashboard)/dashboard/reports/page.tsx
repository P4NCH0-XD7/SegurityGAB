"use client";
import { useState, useEffect } from "react";
import {
    FaChartLine, FaBoxOpen, FaExclamationTriangle,
    FaArrowUp, FaArrowDown, FaWrench, FaTrophy,
    FaChartBar, FaSyncAlt
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

//  Tipos
interface SalesSummary {
    totalOrders: number;
    totalRevenue: number;
    averageOrder: number;
}

interface SalesByStatus {
    status: string;
    count: number;
    total: number;
}

interface TopProduct {
    productId: number;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
}

interface SalesByMonth {
    month: string;
    count: number;
    total: number;
}

interface SalesReport {
    summary: SalesSummary;
    byStatus: SalesByStatus[];
    topProducts: TopProduct[];
    byMonth: SalesByMonth[];
}

interface StockAlertItem {
    id: number;
    name: string;
    sku: string | null;
    stock: number;
    category: string | null;
}

interface MovementSummary {
    type: string;
    count: number;
    totalQuantity: number;
}

interface InventoryReport {
    summary: { outOfStockCount: number; lowStockCount: number };
    outOfStockProducts: StockAlertItem[];
    lowStockProducts: StockAlertItem[];
    movementsSummary: MovementSummary[];
}

//  Helpers
const formatPrice = (val: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(val);

const STATUS_LABEL: Record<string, string> = {
    PENDING: "Pendiente", PAID: "Pagado", SHIPPED: "Enviado",
    DELIVERED: "Entregado", CANCELLED: "Cancelado",
};

const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
    PENDING:   { bg: "rgba(245,158,11,0.12)",  color: "#d97706" },
    PAID:      { bg: "rgba(59,130,246,0.12)",   color: "#2563eb" },
    SHIPPED:   { bg: "rgba(139,92,246,0.12)",   color: "#7c3aed" },
    DELIVERED: { bg: "rgba(16,185,129,0.12)",   color: "#059669" },
    CANCELLED: { bg: "rgba(239,68,68,0.12)",    color: "#dc2626" },
};

const PERIOD_OPTIONS = [
    { value: "month",   label: "Este mes" },
    { value: "week",    label: "Esta semana" },
    { value: "quarter", label: "Este trimestre" },
    { value: "year",    label: "Este año" },
];

const MOV_TYPE_CONFIG: Record<string, { color: string; label: string; icon: JSX.Element }> = {
    IN:         { color: "#059669", label: "Entradas",  icon: <FaArrowUp size={12} /> },
    OUT:        { color: "#dc2626", label: "Salidas",   icon: <FaArrowDown size={12} /> },
    ADJUSTMENT: { color: "#d97706", label: "Ajustes",   icon: <FaWrench size={12} /> },
};

//  Componente principal
export default function ReportsPage() {
    const { token } = useAuthStore();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

    const [salesReport, setSalesReport]       = useState<SalesReport | null>(null);
    const [inventoryReport, setInventoryReport] = useState<InventoryReport | null>(null);
    const [loadingSales, setLoadingSales]       = useState(true);
    const [loadingInventory, setLoadingInventory] = useState(true);
    const [period, setPeriod]                   = useState("month");
    const [activeTab, setActiveTab]             = useState<"sales" | "inventory">("sales");

    //  Fetch reporte de ventas 
    const fetchSalesReport = async (p: string) => {
        if (!token) return;
        setLoadingSales(true);
        try {
            const res = await fetch(`${API_URL}/reports/sales?period=${p}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setSalesReport(await res.json());
            else toast.error("Error al cargar reporte de ventas");
        } catch {
            toast.error("Error de conexión");
        } finally {
            setLoadingSales(false);
        }
    };

    //  Fetch reporte de inventario 
    const fetchInventoryReport = async () => {
        if (!token) return;
        setLoadingInventory(true);
        try {
            const res = await fetch(`${API_URL}/reports/inventory`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setInventoryReport(await res.json());
            else toast.error("Error al cargar reporte de inventario");
        } catch {
            toast.error("Error de conexión");
        } finally {
            setLoadingInventory(false);
        }
    };

    useEffect(() => {
        fetchSalesReport(period);
        fetchInventoryReport();
    }, [token]);

    const handlePeriodChange = (p: string) => {
        setPeriod(p);
        fetchSalesReport(p);
    };

    //  Gráfica de barras SVG (ventas por mes) 
    const renderBarChart = () => {
        if (!salesReport?.byMonth?.length) return (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--on-surface-variant)", fontSize: "0.9rem" }}>
                Sin datos para el período seleccionado
            </div>
        );

        const data   = salesReport.byMonth;
        const maxVal = Math.max(...data.map(d => d.total), 1);
        const W      = 100 / data.length;

        return (
            <div style={{ position: "relative", height: "200px", display: "flex", alignItems: "flex-end", gap: "0.5rem", padding: "0 0.5rem" }}>
                {data.map((d, i) => {
                    const pct = (d.total / maxVal) * 100;
                    return (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", height: "100%", justifyContent: "flex-end" }}>
                            <div style={{ fontSize: "0.65rem", color: "var(--on-surface-variant)", fontWeight: "600" }}>
                                {formatPrice(d.total).replace("$", "").replace(",00", "")}
                            </div>
                            <div
                                style={{
                                    width: "100%", background: "var(--primary)",
                                    height: `${Math.max(pct, 4)}%`,
                                    borderRadius: "0.5rem 0.5rem 0 0",
                                    opacity: 0.85, transition: "height 0.4s ease",
                                    minHeight: "4px",
                                }}
                                title={`${d.month}: ${formatPrice(d.total)} (${d.count} ventas)`}
                            />
                            <div style={{ fontSize: "0.65rem", color: "var(--on-surface-variant)", fontWeight: "600", whiteSpace: "nowrap" }}>
                                {d.month.substring(5)}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="dashboard-content">

            {/* ── Header ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--on-surface)", letterSpacing: "-0.02em" }}>
                        Reportes y Analíticas
                    </h2>
                    <p style={{ color: "var(--on-surface-variant)" }}>
                        Métricas de ventas e inventario en tiempo real
                    </p>
                </div>
                <button
                    onClick={() => { fetchSalesReport(period); fetchInventoryReport(); }}
                    style={{
                        background: "var(--surface-low)", border: "none",
                        padding: "0.75rem 1.25rem", borderRadius: "0.75rem",
                        color: "var(--on-surface)", fontWeight: "700", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "0.5rem",
                    }}
                >
                    <FaSyncAlt size={13} /> Actualizar
                </button>
            </div>

            {/*  Tabs  */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", background: "var(--surface-low)", padding: "0.4rem", borderRadius: "1rem", width: "fit-content" }}>
                {[
                    { key: "sales",     label: "Ventas",     icon: <FaChartLine size={13} /> },
                    { key: "inventory", label: "Inventario", icon: <FaBoxOpen size={13} /> },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        style={{
                            padding: "0.6rem 1.5rem", borderRadius: "0.75rem", border: "none",
                            fontWeight: "700", cursor: "pointer", fontSize: "0.9rem",
                            display: "flex", alignItems: "center", gap: "0.5rem",
                            background: activeTab === tab.key ? "var(--surface)" : "transparent",
                            color: activeTab === tab.key ? "var(--primary)" : "var(--on-surface-variant)",
                            boxShadow: activeTab === tab.key ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                            transition: "all 0.2s",
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB VENTAS  */}
            {activeTab === "sales" && (
                <>
                    {/* Selector de período */}
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                        {PERIOD_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => handlePeriodChange(opt.value)}
                                style={{
                                    padding: "0.5rem 1.25rem", borderRadius: "2rem",
                                    border: period === opt.value ? "none" : "1px solid var(--surface-high)",
                                    background: period === opt.value ? "var(--primary)" : "var(--surface-low)",
                                    color: period === opt.value ? "white" : "var(--on-surface-variant)",
                                    fontWeight: "700", cursor: "pointer", fontSize: "0.85rem",
                                    transition: "all 0.2s",
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {loadingSales ? (
                        <div style={{ textAlign: "center", padding: "4rem", color: "var(--on-surface-variant)" }}>
                            Cargando reporte de ventas...
                        </div>
                    ) : salesReport && (
                        <>
                            {/* Cards resumen */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
                                {[
                                    { label: "Total Órdenes",   value: salesReport.summary.totalOrders.toString(),      color: "#2563eb", icon: <FaChartBar /> },
                                    { label: "Ingresos Totales", value: formatPrice(salesReport.summary.totalRevenue),   color: "#059669", icon: <FaChartLine /> },
                                    { label: "Ticket Promedio",  value: formatPrice(salesReport.summary.averageOrder),   color: "#7c3aed", icon: <FaTrophy /> },
                                ].map((card, i) => (
                                    <div key={i} className="stat-card">
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                                            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                {card.label}
                                            </span>
                                            <span style={{ color: card.color, background: `${card.color}15`, padding: "0.35rem 0.6rem", borderRadius: "0.5rem", fontSize: "0.85rem" }}>
                                                {card.icon}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--on-surface)", letterSpacing: "-0.02em" }}>
                                            {card.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Gráfica de barras + por estado */}
                            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>

                                {/* Gráfica ventas por mes */}
                                <div className="stat-card">
                                    <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--on-surface)", marginBottom: "1.5rem" }}>
                                        Ventas por Mes
                                    </h3>
                                    {renderBarChart()}
                                </div>

                                {/* Por estado */}
                                <div className="stat-card">
                                    <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--on-surface)", marginBottom: "1.5rem" }}>
                                        Por Estado
                                    </h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                        {salesReport.byStatus.length === 0 ? (
                                            <p style={{ color: "var(--on-surface-variant)", fontSize: "0.85rem" }}>Sin datos</p>
                                        ) : salesReport.byStatus.map(row => (
                                            <div key={row.status} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <span style={{
                                                    padding: "0.25rem 0.6rem", borderRadius: "2rem",
                                                    fontSize: "0.72rem", fontWeight: "700",
                                                    background: STATUS_COLOR[row.status]?.bg || "var(--surface-low)",
                                                    color: STATUS_COLOR[row.status]?.color || "var(--on-surface)",
                                                    minWidth: "85px", textAlign: "center"
                                                }}>
                                                    {STATUS_LABEL[row.status] || row.status}
                                                </span>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{
                                                        height: "6px", background: "var(--surface-high)",
                                                        borderRadius: "3px", overflow: "hidden"
                                                    }}>
                                                        <div style={{
                                                            height: "100%", borderRadius: "3px",
                                                            background: STATUS_COLOR[row.status]?.color || "var(--primary)",
                                                            width: `${Math.min((row.count / (salesReport.summary.totalOrders || 1)) * 100, 100)}%`,
                                                        }} />
                                                    </div>
                                                </div>
                                                <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--on-surface)", minWidth: "20px", textAlign: "right" }}>
                                                    {row.count}
                                                </span>
                                                <span style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", minWidth: "80px", textAlign: "right" }}>
                                                    {formatPrice(row.total)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Top productos */}
                            <div className="stat-card" style={{ padding: 0, overflow: "hidden" }}>
                                <div style={{ padding: "1.5rem 1.5rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <FaTrophy style={{ color: "#d97706" }} />
                                    <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--on-surface)" }}>
                                        Top 10 Productos Más Vendidos
                                    </h3>
                                </div>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "var(--surface-low)", color: "var(--on-surface-variant)", fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase" }}>
                                            <th style={{ padding: "0.75rem 1.5rem", textAlign: "left" }}>#</th>
                                            <th style={{ padding: "0.75rem 1.5rem", textAlign: "left" }}>Producto</th>
                                            <th style={{ padding: "0.75rem 1.5rem", textAlign: "right" }}>Unidades</th>
                                            <th style={{ padding: "0.75rem 1.5rem", textAlign: "right" }}>Ingresos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salesReport.topProducts.length === 0 ? (
                                            <tr><td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "var(--on-surface-variant)" }}>Sin datos</td></tr>
                                        ) : salesReport.topProducts.map((p, i) => (
                                            <tr key={p.productId} style={{ borderBottom: "1px solid var(--surface-high)" }}>
                                                <td style={{ padding: "1rem 1.5rem" }}>
                                                    <span style={{
                                                        width: "26px", height: "26px", borderRadius: "50%",
                                                        background: i < 3 ? "rgba(217,119,6,0.15)" : "var(--surface-low)",
                                                        color: i < 3 ? "#d97706" : "var(--on-surface-variant)",
                                                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                                                        fontSize: "0.75rem", fontWeight: "800"
                                                    }}>
                                                        {i + 1}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "1rem 1.5rem", fontWeight: "700", color: "var(--on-surface)" }}>
                                                    {p.productName}
                                                </td>
                                                <td style={{ padding: "1rem 1.5rem", textAlign: "right", fontWeight: "800", color: "var(--primary)", fontSize: "1rem" }}>
                                                    {p.totalQuantity}
                                                </td>
                                                <td style={{ padding: "1rem 1.5rem", textAlign: "right", fontWeight: "700", color: "var(--on-surface)" }}>
                                                    {formatPrice(p.totalRevenue)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </>
            )}

            {/*  TAB INVENTARIO */}
            {activeTab === "inventory" && (
                <>
                    {loadingInventory ? (
                        <div style={{ textAlign: "center", padding: "4rem", color: "var(--on-surface-variant)" }}>
                            Cargando reporte de inventario...
                        </div>
                    ) : inventoryReport && (
                        <>
                            {/* Cards resumen */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
                                <div className="stat-card">
                                    <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
                                        Sin Stock
                                    </div>
                                    <div style={{ fontSize: "2.5rem", fontWeight: "800", color: "#dc2626" }}>
                                        {inventoryReport.summary.outOfStockCount}
                                    </div>
                                    <div style={{ fontSize: "0.8rem", color: "var(--on-surface-variant)", marginTop: "0.25rem" }}>productos agotados</div>
                                </div>
                                <div className="stat-card">
                                    <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
                                        Stock Bajo
                                    </div>
                                    <div style={{ fontSize: "2.5rem", fontWeight: "800", color: "#d97706" }}>
                                        {inventoryReport.summary.lowStockCount}
                                    </div>
                                    <div style={{ fontSize: "0.8rem", color: "var(--on-surface-variant)", marginTop: "0.25rem" }}>productos con menos de 10 uds</div>
                                </div>
                                <div className="stat-card">
                                    <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                                        Movimientos por tipo
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        {inventoryReport.movementsSummary.map(m => (
                                            <div key={m.type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{
                                                    display: "flex", alignItems: "center", gap: "0.35rem",
                                                    fontSize: "0.8rem", fontWeight: "700",
                                                    color: MOV_TYPE_CONFIG[m.type]?.color || "var(--on-surface-variant)"
                                                }}>
                                                    {MOV_TYPE_CONFIG[m.type]?.icon}
                                                    {MOV_TYPE_CONFIG[m.type]?.label || m.type}
                                                </span>
                                                <span style={{ fontWeight: "800", color: "var(--on-surface)", fontSize: "0.9rem" }}>
                                                    {m.count} ({m.totalQuantity} uds)
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sin stock + Stock bajo */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>

                                {/* Sin stock */}
                                <div className="stat-card" style={{ padding: 0, overflow: "hidden" }}>
                                    <div style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--surface-high)" }}>
                                        <FaExclamationTriangle style={{ color: "#dc2626" }} />
                                        <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--on-surface)" }}>
                                            Productos sin stock ({inventoryReport.summary.outOfStockCount})
                                        </h3>
                                    </div>
                                    {inventoryReport.outOfStockProducts.length === 0 ? (
                                        <div style={{ padding: "2rem", textAlign: "center", color: "var(--on-surface-variant)", fontSize: "0.85rem" }}>
                                            ✅ Sin productos agotados
                                        </div>
                                    ) : (
                                        <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                                            {inventoryReport.outOfStockProducts.map(p => (
                                                <div key={p.id} style={{ padding: "0.85rem 1.5rem", borderBottom: "1px solid var(--surface-high)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <div>
                                                        <div style={{ fontWeight: "700", color: "var(--on-surface)", fontSize: "0.85rem" }}>{p.name}</div>
                                                        <div style={{ fontSize: "0.72rem", color: "var(--on-surface-variant)" }}>
                                                            {p.sku ? `SKU: ${p.sku}` : ""} {p.category ? `· ${p.category}` : ""}
                                                        </div>
                                                    </div>
                                                    <span style={{ background: "rgba(239,68,68,0.12)", color: "#dc2626", padding: "0.2rem 0.6rem", borderRadius: "2rem", fontSize: "0.72rem", fontWeight: "800" }}>
                                                        0 uds
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Stock bajo */}
                                <div className="stat-card" style={{ padding: 0, overflow: "hidden" }}>
                                    <div style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--surface-high)" }}>
                                        <FaExclamationTriangle style={{ color: "#d97706" }} />
                                        <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--on-surface)" }}>
                                            Stock bajo ({inventoryReport.summary.lowStockCount})
                                        </h3>
                                    </div>
                                    {inventoryReport.lowStockProducts.length === 0 ? (
                                        <div style={{ padding: "2rem", textAlign: "center", color: "var(--on-surface-variant)", fontSize: "0.85rem" }}>
                                            ✅ Sin alertas de stock bajo
                                        </div>
                                    ) : (
                                        <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                                            {inventoryReport.lowStockProducts.map(p => (
                                                <div key={p.id} style={{ padding: "0.85rem 1.5rem", borderBottom: "1px solid var(--surface-high)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <div>
                                                        <div style={{ fontWeight: "700", color: "var(--on-surface)", fontSize: "0.85rem" }}>{p.name}</div>
                                                        <div style={{ fontSize: "0.72rem", color: "var(--on-surface-variant)" }}>
                                                            {p.sku ? `SKU: ${p.sku}` : ""} {p.category ? `· ${p.category}` : ""}
                                                        </div>
                                                    </div>
                                                    <span style={{
                                                        background: p.stock <= 3 ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                                                        color: p.stock <= 3 ? "#dc2626" : "#d97706",
                                                        padding: "0.2rem 0.6rem", borderRadius: "2rem",
                                                        fontSize: "0.72rem", fontWeight: "800"
                                                    }}>
                                                        {p.stock} uds
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
