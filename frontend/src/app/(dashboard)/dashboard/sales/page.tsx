"use client";
import { useState, useEffect } from "react";
import {
    FaSearch, FaEye, FaShoppingBag, FaCheckCircle,
    FaTruck, FaBoxOpen, FaTimesCircle, FaClock, FaFilter,
    FaDownload
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

interface SaleDetail {
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product: { id: number; name: string; imageUrl?: string; sku?: string };
}

interface Sale {
    id: number;
    userId: number;
    totalAmount: number;
    status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    shippingAddress: string;
    createdAt: string;
    user?: { id: number; name: string; email: string };
    details?: SaleDetail[];
}

const STATUS_LABEL: Record<string, string> = {
    PENDING:   "Pendiente",
    PAID:      "Pagado",
    SHIPPED:   "Enviado",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
};

const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
    PENDING:   { bg: "rgba(245,158,11,0.12)",  color: "#d97706" },
    PAID:      { bg: "rgba(59,130,246,0.12)",   color: "#2563eb" },
    SHIPPED:   { bg: "rgba(139,92,246,0.12)",   color: "#7c3aed" },
    DELIVERED: { bg: "rgba(16,185,129,0.12)",   color: "#059669" },
    CANCELLED: { bg: "rgba(239,68,68,0.12)",    color: "#dc2626" },
};

const STATUS_ICON: Record<string, JSX.Element> = {
    PENDING:   <FaClock size={11} />,
    PAID:      <FaCheckCircle size={11} />,
    SHIPPED:   <FaTruck size={11} />,
    DELIVERED: <FaBoxOpen size={11} />,
    CANCELLED: <FaTimesCircle size={11} />,
};

// Flujo de estados válidos
const NEXT_STATUS: Record<string, { value: string; label: string }[]> = {
    PENDING:   [{ value: "PAID", label: "Marcar como Pagado" }, { value: "CANCELLED", label: "Cancelar" }],
    PAID:      [{ value: "SHIPPED", label: "Marcar como Enviado" }, { value: "CANCELLED", label: "Cancelar" }],
    SHIPPED:   [{ value: "DELIVERED", label: "Marcar como Entregado" }],
    DELIVERED: [],
    CANCELLED: [],
};

const formatPrice = (val: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(val);

// Componente principal 
export default function SalesPage() {
    const { token } = useAuthStore();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    // Fetch ventas
    const fetchSales = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/sales`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setSales(data);
            } else {
                toast.error("Error al cargar las ventas");
            }
        } catch {
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, [token]);

    //  Ver detalle de una venta 
    const handleViewDetail = async (sale: Sale) => {
        setSelectedSale(sale);
        setIsDetailOpen(true);

        // Si no tiene detalles cargados, los trae
        if (!sale.details) {
            try {
                const res = await fetch(`${API_URL}/sales/${sale.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data: Sale = await res.json();
                    setSales(prev => prev.map(s => s.id === data.id ? data : s));
                    setSelectedSale(data);
                }
            } catch {
                toast.error("Error al cargar el detalle");
            }
        }
    };

    //  Cambiar estado de la venta 
    const handleStatusChange = async (saleId: number, newStatus: string) => {
        if (!token) return;
        setUpdatingId(saleId);
        try {
            const res = await fetch(`${API_URL}/sales/${saleId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                const updated: Sale = await res.json();
                setSales(prev => prev.map(s => s.id === updated.id ? updated : s));
                // Actualizar también el modal si está abierto
                if (selectedSale?.id === saleId) setSelectedSale(updated);
                toast.success(`Estado actualizado a "${STATUS_LABEL[newStatus]}"`);
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(err.message || "Error al actualizar estado");
            }
        } catch {
            toast.error("Error de conexión");
        } finally {
            setUpdatingId(null);
        }
    };

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

    //  Filtros y búsqueda 
    const filtered = sales.filter(s => {
        const matchSearch =
            String(s.id).includes(searchTerm) ||
            s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.shippingAddress?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === "ALL" || s.status === filterStatus;
        return matchSearch && matchStatus;
    });

    //  Resumen de estados 
    const counts = Object.keys(STATUS_LABEL).reduce((acc, k) => {
        acc[k] = sales.filter(s => s.status === k).length;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="dashboard-content">

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
                <div>
                    <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--on-surface)", letterSpacing: "-0.02em" }}>
                        Gestión de Pedidos
                    </h2>
                    <p style={{ color: "var(--on-surface-variant)" }}>
                        Monitorea y actualiza el estado de todas las ventas
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        onClick={exportToCSV}
                        style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', background: 'var(--surface-high)', color: 'var(--on-surface)', border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                    >
                        <FaDownload /> Exportar CSV
                    </button>
                    <div style={{
                        background: "var(--surface-low)", padding: "0.75rem 1.25rem",
                        borderRadius: "0.75rem", display: "flex", alignItems: "center",
                        gap: "0.5rem", fontWeight: "700", color: "var(--on-surface)"
                    }}>
                        <FaShoppingBag style={{ color: "var(--primary)" }} />
                        {sales.length} ventas en total
                    </div>
                </div>
            </div>

            {/* ── Cards resumen ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
                {Object.entries(STATUS_LABEL).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setFilterStatus(filterStatus === key ? "ALL" : key)}
                        style={{
                            background: filterStatus === key ? STATUS_COLOR[key].bg : "var(--surface-low)",
                            border: filterStatus === key
                                ? `2px solid ${STATUS_COLOR[key].color}`
                                : "2px solid transparent",
                            borderRadius: "1rem", padding: "1rem",
                            cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                        }}
                    >
                        <div style={{ fontSize: "1.75rem", fontWeight: "800", color: STATUS_COLOR[key].color }}>
                            {counts[key] || 0}
                        </div>
                        <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--on-surface-variant)", display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.25rem" }}>
                            {STATUS_ICON[key]} {label}
                        </div>
                    </button>
                ))}
            </div>

            {/* ── Barra de búsqueda y filtro ── */}
            <div style={{
                background: "var(--surface-low)", padding: "1rem",
                borderRadius: "1rem", display: "flex", gap: "1rem",
                marginBottom: "2rem", alignItems: "center"
            }}>
                <div style={{ position: "relative", flex: 1 }}>
                    <FaSearch style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--on-surface-variant)" }} />
                    <input
                        type="text"
                        placeholder="Buscar por ID, cliente o dirección..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%", padding: "0.75rem 1rem 0.75rem 3rem",
                            background: "var(--surface)", border: "1px solid var(--surface-high)",
                            borderRadius: "0.75rem", color: "var(--on-surface)", outline: "none"
                        }}
                    />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--on-surface-variant)", fontSize: "0.85rem" }}>
                    <FaFilter size={12} />
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        style={{
                            padding: "0.75rem 1rem", background: "var(--surface)",
                            border: "1px solid var(--surface-high)", borderRadius: "0.75rem",
                            color: "var(--on-surface)", outline: "none", fontWeight: "600"
                        }}
                    >
                        <option value="ALL">Todos los estados</option>
                        {Object.entries(STATUS_LABEL).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ── Tabla de ventas ── */}
            <div className="stat-card" style={{ padding: 0, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{
                            background: "var(--surface-low)", color: "var(--on-surface-variant)",
                            fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase"
                        }}>
                            <th style={{ padding: "1.25rem", textAlign: "left" }}>Pedido</th>
                            <th style={{ padding: "1.25rem", textAlign: "left" }}>Cliente</th>
                            <th style={{ padding: "1.25rem", textAlign: "left" }}>Fecha</th>
                            <th style={{ padding: "1.25rem", textAlign: "left" }}>Total</th>
                            <th style={{ padding: "1.25rem", textAlign: "left" }}>Estado</th>
                            <th style={{ padding: "1.25rem", textAlign: "left" }}>Cambiar estado</th>
                            <th style={{ padding: "1.25rem", textAlign: "center" }}>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "var(--on-surface-variant)" }}>
                                    Cargando pedidos...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "var(--on-surface-variant)" }}>
                                    No se encontraron pedidos
                                </td>
                            </tr>
                        ) : filtered.map(sale => (
                            <tr key={sale.id} style={{ borderBottom: "1px solid var(--surface-high)" }}>

                                {/* ID */}
                                <td style={{ padding: "1.25rem" }}>
                                    <div style={{ fontWeight: "800", color: "var(--primary)", fontSize: "1rem" }}>
                                        #{sale.id}
                                    </div>
                                </td>

                                {/* Cliente */}
                                <td style={{ padding: "1.25rem" }}>
                                    <div style={{ fontWeight: "700", color: "var(--on-surface)" }}>
                                        {sale.user?.name || `Usuario #${sale.userId}`}
                                    </div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>
                                        {sale.user?.email || ""}
                                    </div>
                                </td>

                                {/* Fecha */}
                                <td style={{ padding: "1.25rem", color: "var(--on-surface-variant)", fontSize: "0.85rem" }}>
                                    {new Date(sale.createdAt).toLocaleDateString("es-CO", {
                                        year: "numeric", month: "short", day: "numeric"
                                    })}
                                    <div style={{ fontSize: "0.72rem" }}>
                                        {new Date(sale.createdAt).toLocaleTimeString("es-CO", {
                                            hour: "2-digit", minute: "2-digit"
                                        })}
                                    </div>
                                </td>

                                {/* Total */}
                                <td style={{ padding: "1.25rem", fontWeight: "800", color: "var(--on-surface)", fontSize: "1rem" }}>
                                    {formatPrice(Number(sale.totalAmount))}
                                </td>

                                {/* Badge estado */}
                                <td style={{ padding: "1.25rem" }}>
                                    <span style={{
                                        display: "inline-flex", alignItems: "center", gap: "0.3rem",
                                        padding: "0.35rem 0.75rem", borderRadius: "2rem",
                                        fontSize: "0.75rem", fontWeight: "700",
                                        background: STATUS_COLOR[sale.status].bg,
                                        color: STATUS_COLOR[sale.status].color,
                                    }}>
                                        {STATUS_ICON[sale.status]}
                                        {STATUS_LABEL[sale.status]}
                                    </span>
                                </td>

                                {/* Selector cambio de estado */}
                                <td style={{ padding: "1.25rem" }}>
                                    {NEXT_STATUS[sale.status].length > 0 ? (
                                        <select
                                            disabled={updatingId === sale.id}
                                            defaultValue=""
                                            onChange={e => {
                                                if (e.target.value) handleStatusChange(sale.id, e.target.value);
                                                e.target.value = "";
                                            }}
                                            style={{
                                                padding: "0.5rem 0.75rem",
                                                background: "var(--surface-low)",
                                                border: "1px solid var(--surface-high)",
                                                borderRadius: "0.5rem",
                                                color: "var(--on-surface)",
                                                fontSize: "0.8rem",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                outline: "none",
                                                opacity: updatingId === sale.id ? 0.5 : 1,
                                            }}
                                        >
                                            <option value="" disabled>
                                                {updatingId === sale.id ? "Actualizando..." : "Cambiar a..."}
                                            </option>
                                            {NEXT_STATUS[sale.status].map(opt => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span style={{ fontSize: "0.8rem", color: "var(--on-surface-variant)" }}>
                                            —
                                        </span>
                                    )}
                                </td>

                                {/* Ver detalle */}
                                <td style={{ padding: "1.25rem", textAlign: "center" }}>
                                    <button
                                        onClick={() => handleViewDetail(sale)}
                                        style={{
                                            background: "var(--surface-high)", border: "none",
                                            padding: "0.5rem 0.75rem", borderRadius: "0.5rem",
                                            cursor: "pointer", color: "var(--primary)",
                                            display: "inline-flex", alignItems: "center", gap: "0.35rem",
                                            fontSize: "0.8rem", fontWeight: "700",
                                        }}
                                    >
                                        <FaEye size={12} /> Ver
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Modal detalle de venta ── */}
            {isDetailOpen && selectedSale && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 1000, padding: "1rem"
                }}>
                    <div style={{
                        background: "var(--surface)", padding: "2.5rem",
                        borderRadius: "1.5rem", width: "100%", maxWidth: "600px",
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                        border: "1px solid var(--surface-high)",
                        maxHeight: "90vh", overflowY: "auto"
                    }}>

                        {/* Header modal */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                            <div>
                                <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--on-surface)" }}>
                                    Pedido #{selectedSale.id}
                                </h3>
                                <p style={{ color: "var(--on-surface-variant)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                                    {new Date(selectedSale.createdAt).toLocaleDateString("es-CO", {
                                        weekday: "long", year: "numeric", month: "long", day: "numeric"
                                    })}
                                </p>
                            </div>
                            <span style={{
                                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                                padding: "0.4rem 0.9rem", borderRadius: "2rem",
                                fontSize: "0.8rem", fontWeight: "700",
                                background: STATUS_COLOR[selectedSale.status].bg,
                                color: STATUS_COLOR[selectedSale.status].color,
                            }}>
                                {STATUS_ICON[selectedSale.status]}
                                {STATUS_LABEL[selectedSale.status]}
                            </span>
                        </div>

                        {/* Info cliente */}
                        <div style={{
                            background: "var(--surface-low)", borderRadius: "1rem",
                            padding: "1.25rem", marginBottom: "1.5rem"
                        }}>
                            <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
                                Información del cliente
                            </div>
                            <div style={{ fontWeight: "700", color: "var(--on-surface)" }}>
                                {selectedSale.user?.name || `Usuario #${selectedSale.userId}`}
                            </div>
                            {selectedSale.user?.email && (
                                <div style={{ fontSize: "0.85rem", color: "var(--on-surface-variant)", marginTop: "0.25rem" }}>
                                    {selectedSale.user.email}
                                </div>
                            )}
                            <div style={{ fontSize: "0.85rem", color: "var(--on-surface-variant)", marginTop: "0.5rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                                <span style={{ color: "var(--primary)", flexShrink: 0 }}>📍</span>
                                {selectedSale.shippingAddress}
                            </div>
                        </div>

                        {/* Productos */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
                                Productos del pedido
                            </div>
                            {selectedSale.details ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    {selectedSale.details.map(detail => (
                                        <div key={detail.id} style={{
                                            display: "flex", alignItems: "center",
                                            justifyContent: "space-between",
                                            background: "var(--surface-low)",
                                            borderRadius: "0.75rem", padding: "1rem"
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: "700", color: "var(--on-surface)", fontSize: "0.9rem" }}>
                                                    {detail.product?.name || `Producto #${detail.productId}`}
                                                </div>
                                                <div style={{ fontSize: "0.78rem", color: "var(--on-surface-variant)", marginTop: "0.2rem" }}>
                                                    {detail.quantity} × {formatPrice(Number(detail.unitPrice))}
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: "800", color: "var(--primary)", fontSize: "1rem" }}>
                                                {formatPrice(Number(detail.subtotal))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: "center", color: "var(--on-surface-variant)", padding: "1rem", fontSize: "0.85rem" }}>
                                    Cargando productos...
                                </div>
                            )}
                        </div>

                        {/* Total */}
                        <div style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            borderTop: "1px solid var(--surface-high)", paddingTop: "1.25rem",
                            marginBottom: "1.5rem"
                        }}>
                            <span style={{ fontWeight: "700", color: "var(--on-surface-variant)" }}>Total del pedido</span>
                            <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--on-surface)" }}>
                                {formatPrice(Number(selectedSale.totalAmount))}
                            </span>
                        </div>

                        {/* Cambiar estado desde el modal */}
                        {NEXT_STATUS[selectedSale.status].length > 0 && (
                            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                                {NEXT_STATUS[selectedSale.status].map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleStatusChange(selectedSale.id, opt.value)}
                                        disabled={updatingId === selectedSale.id}
                                        style={{
                                            flex: 1, padding: "0.85rem",
                                            background: opt.value === "CANCELLED"
                                                ? "rgba(239,68,68,0.1)" : "var(--primary)",
                                            color: opt.value === "CANCELLED" ? "#dc2626" : "white",
                                            border: opt.value === "CANCELLED"
                                                ? "1px solid rgba(239,68,68,0.3)" : "none",
                                            borderRadius: "0.75rem", fontWeight: "700",
                                            cursor: "pointer", fontSize: "0.9rem",
                                            opacity: updatingId === selectedSale.id ? 0.6 : 1,
                                        }}
                                    >
                                        {updatingId === selectedSale.id ? "Actualizando..." : opt.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Cerrar modal */}
                        <button
                            onClick={() => { setIsDetailOpen(false); setSelectedSale(null); }}
                            style={{
                                width: "100%", padding: "1rem",
                                border: "1px solid var(--surface-high)",
                                borderRadius: "0.75rem", background: "none",
                                color: "var(--on-surface)", fontWeight: "700", cursor: "pointer"
                            }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
