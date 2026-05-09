"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaExchangeAlt, FaArrowUp, FaArrowDown, FaWrench, FaBoxOpen, FaListAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { formatPrice } from "@/utils/formatters";

interface InventoryMovement {
    id: number;
    productId: number;
    type: 'IN' | 'OUT' | 'ADJUSTMENT';
    quantity: number;
    reason?: string;
    referenceId?: number;
    createdAt: string;
    product: { name: string; sku: string };
}

interface Product {
    id: number;
    name: string;
    stock: number;
    price: number;
    sku?: string;
    status: string;
}

const TYPE_CONFIG = {
    IN:         { label: 'ENTRADA',  color: '#10b981', bg: 'rgba(16,185,129,0.1)',  Icon: FaArrowUp },
    OUT:        { label: 'SALIDA',   color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   Icon: FaArrowDown },
    ADJUSTMENT: { label: 'AJUSTE',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  Icon: FaWrench },
};

export default function InventoryManagementPage() {
    const { token } = useAuthStore();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

    const [activeTab, setActiveTab] = useState<'movements' | 'stock'>('movements');
    const [movements, setMovements] = useState<InventoryMovement[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        productId: 0,
        type: 'IN',
        quantity: 1,
        reason: "",
    });

    const fetchMovements = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/inventory`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setMovements(await res.json());
            else toast.error("Error al cargar el historial de inventario");
        } catch {
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/products`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setProducts(await res.json());
        } catch {
            console.error("Error fetching products");
        }
    };

    // Depende de token para que recargue cuando el usuario se autentica
    useEffect(() => {
        fetchMovements();
        fetchProducts();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) { toast.error("Sesión no válida"); return; }
        if (formData.productId === 0) { toast.error("Debes seleccionar un producto"); return; }

        try {
            const res = await fetch(`${API_URL}/inventory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    productId: formData.productId,
                    type: formData.type,
                    quantity: Number(formData.quantity),
                    reason: formData.reason || "Registro manual de administrador",
                }),
            });

            if (res.ok) {
                toast.success("Movimiento registrado exitosamente");
                setIsModalOpen(false);
                setFormData({ productId: 0, type: 'IN', quantity: 1, reason: "" });
                // Refresca ambas listas para mantener consistencia
                fetchMovements();
                fetchProducts();
            } else {
                const err = await res.json().catch(() => ({ message: "Error en la petición" }));
                toast.error(err.message || "Error al procesar solicitud");
            }
        } catch {
            toast.error("Error de conexión");
        }
    };

    const filteredMovements = movements.filter(m =>
        m.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.reason?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );

    // Métricas de stock
    const outOfStock  = products.filter(p => p.stock === 0).length;
    const lowStock    = products.filter(p => p.stock > 0 && p.stock < 10).length;
    const healthyStock = products.filter(p => p.stock >= 10).length;

    const getStockColor = (stock: number) => {
        if (stock === 0) return { color: '#dc2626', bg: 'rgba(239,68,68,0.12)' };
        if (stock < 10)  return { color: '#d97706', bg: 'rgba(245,158,11,0.12)' };
        return { color: '#059669', bg: 'rgba(16,185,129,0.12)' };
    };

    return (
        <div className="dashboard-content">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>
                        Control de Inventario
                    </h2>
                    <p style={{ color: 'var(--on-surface-variant)' }}>Registra y monitorea el flujo de stock</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{ background: 'var(--primary)', color: 'var(--on-primary)', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}
                >
                    <FaPlus /> Registrar Movimiento
                </button>
            </div>

            {/* Tarjetas resumen de stock */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Sin Stock',   value: outOfStock,    color: '#dc2626', bg: 'rgba(239,68,68,0.1)' },
                    { label: 'Stock Bajo',  value: lowStock,      color: '#d97706', bg: 'rgba(245,158,11,0.1)' },
                    { label: 'Stock OK',    value: healthyStock,  color: '#059669', bg: 'rgba(16,185,129,0.1)' },
                ].map(({ label, value, color, bg }) => (
                    <div key={label} style={{ background: bg, border: `1px solid ${color}30`, borderRadius: '1rem', padding: '1.25rem' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color }}>{value}</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginTop: '0.25rem' }}>{label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--surface-low)', padding: '0.4rem', borderRadius: '0.75rem', width: 'fit-content' }}>
                {([['movements', <FaExchangeAlt key="1" />, 'Historial de Movimientos'], ['stock', <FaBoxOpen key="2" />, 'Stock Actual por Producto']] as const).map(([tab, icon, label]) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', borderRadius: '0.5rem', border: 'none', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', background: activeTab === tab ? 'var(--primary)' : 'transparent', color: activeTab === tab ? 'white' : 'var(--on-surface-variant)', transition: 'all 0.2s' }}
                    >
                        {icon} {label}
                    </button>
                ))}
            </div>

            {/* Búsqueda */}
            <div style={{ background: 'var(--surface-low)', padding: '1rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                    <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)' }} />
                    <input
                        type="text"
                        placeholder={activeTab === 'movements' ? "Buscar por producto, motivo..." : "Buscar por nombre o SKU..."}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', background: 'var(--surface)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)', outline: 'none' }}
                    />
                </div>
            </div>

            {/* ── TAB: Historial de movimientos ── */}
            {activeTab === 'movements' && (
                <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--surface-low)', color: 'var(--on-surface-variant)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                                <th style={{ padding: '1.25rem', textAlign: 'left' }}>Fecha</th>
                                <th style={{ padding: '1.25rem', textAlign: 'left' }}>Producto</th>
                                <th style={{ padding: '1.25rem', textAlign: 'left' }}>Tipo</th>
                                <th style={{ padding: '1.25rem', textAlign: 'left' }}>Cantidad</th>
                                <th style={{ padding: '1.25rem', textAlign: 'left' }}>Motivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>Cargando inventario...</td></tr>
                            ) : filteredMovements.length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>No existen historiales de movimientos</td></tr>
                            ) : filteredMovements.map(mov => {
                                const cfg = TYPE_CONFIG[mov.type];
                                return (
                                    <tr key={mov.id} style={{ borderBottom: '1px solid var(--surface-high)' }}>
                                        <td style={{ padding: '1.25rem', color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>
                                            {new Date(mov.createdAt).toLocaleString('es-CO')}
                                        </td>
                                        <td style={{ padding: '1.25rem', fontWeight: '700', color: 'var(--on-surface)' }}>
                                            {mov.product?.name || `Producto #${mov.productId}`}
                                            {mov.product?.sku && <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)', fontFamily: 'monospace' }}>{mov.product.sku}</div>}
                                        </td>
                                        <td style={{ padding: '1.25rem' }}>
                                            <span style={{ color: cfg.color, background: cfg.bg, padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <cfg.Icon /> {cfg.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem', fontWeight: '800', fontSize: '1.1rem', color: cfg.color }}>
                                            {mov.type === 'OUT' ? '-' : mov.type === 'IN' ? '+' : '='}{mov.quantity}
                                        </td>
                                        <td style={{ padding: '1.25rem', color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>
                                            {mov.reason || 'S/M'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── TAB: Stock actual por producto ── */}
            {activeTab === 'stock' && (
                <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--surface-low)', color: 'var(--on-surface-variant)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                                <th style={{ padding: '1.25rem', textAlign: 'left' }}>Producto</th>
                                <th style={{ padding: '1.25rem', textAlign: 'left' }}>SKU</th>
                                <th style={{ padding: '1.25rem', textAlign: 'left' }}>Precio</th>
                                <th style={{ padding: '1.25rem', textAlign: 'left' }}>Stock Actual</th>
                                <th style={{ padding: '1.25rem', textAlign: 'left' }}>Estado Stock</th>
                                <th style={{ padding: '1.25rem', textAlign: 'center' }}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>Cargando productos...</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>No se encontraron productos</td></tr>
                            ) : filteredProducts.map(product => {
                                const sc = getStockColor(product.stock);
                                const label = product.stock === 0 ? 'Sin Stock' : product.stock < 10 ? 'Stock Bajo' : 'OK';
                                return (
                                    <tr key={product.id} style={{ borderBottom: '1px solid var(--surface-high)' }}>
                                        <td style={{ padding: '1.25rem', fontWeight: '700', color: 'var(--on-surface)' }}>
                                            {product.name}
                                        </td>
                                        <td style={{ padding: '1.25rem', color: 'var(--on-surface-variant)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                            {product.sku || 'N/A'}
                                        </td>
                                        <td style={{ padding: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>
                                            {formatPrice(Number(product.price))}
                                        </td>
                                        <td style={{ padding: '1.25rem' }}>
                                            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: sc.color }}>{product.stock}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginLeft: '0.4rem' }}>uds</span>
                                        </td>
                                        <td style={{ padding: '1.25rem' }}>
                                            <span style={{ padding: '0.35rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: '700', background: sc.bg, color: sc.color }}>
                                                {label}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                                            <button
                                                onClick={() => {
                                                    setFormData({ productId: product.id, type: 'IN', quantity: 1, reason: '' });
                                                    setIsModalOpen(true);
                                                }}
                                                style={{ background: 'var(--surface-high)', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', color: 'var(--primary)', fontWeight: '700', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                                            >
                                                <FaPlus size={10} /> Mover Stock
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Modal Registrar Movimiento ── */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div style={{ background: 'var(--surface)', padding: '2.5rem', borderRadius: '1.5rem', width: '100%', maxWidth: '550px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid var(--surface-high)' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.5rem', color: 'var(--on-surface)' }}>
                            Registrar Movimiento
                        </h3>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>Producto a Modificar</label>
                                <select
                                    required
                                    value={formData.productId}
                                    onChange={e => setFormData({ ...formData, productId: parseInt(e.target.value) })}
                                    style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)' }}
                                >
                                    <option value={0}>[ Selecciona un producto ]</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} — Stock: {p.stock} uds
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>Tipo de Movimiento</label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                        style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)', fontWeight: '600' }}
                                    >
                                        <option value="IN">↑ Entrada (IN)</option>
                                        <option value="OUT">↓ Salida (OUT)</option>
                                        <option value="ADJUSTMENT">= Ajuste Manual</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>
                                        {formData.type === 'ADJUSTMENT' ? 'Nuevo Stock Total' : 'Cantidad'}
                                    </label>
                                    <input
                                        type="number" min="1" required
                                        value={formData.quantity}
                                        onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                        style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)', fontSize: '1.1rem', fontWeight: '800' }}
                                    />
                                </div>
                            </div>

                            {formData.type === 'OUT' && (
                                <div style={{ fontSize: '0.75rem', color: '#ef4444', background: 'rgba(239,68,68,0.08)', padding: '0.75rem', borderRadius: '0.5rem', marginTop: '-0.5rem' }}>
                                    ⚠️ Asegúrate de que el producto tenga stock suficiente antes de registrar una salida.
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>Motivo / Referencia</label>
                                <input
                                    type="text" required
                                    placeholder="Ej: Compra proveedor, Merma, Ajuste conteo físico..."
                                    value={formData.reason}
                                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => { setIsModalOpen(false); setFormData({ productId: 0, type: 'IN', quantity: 1, reason: '' }); }}
                                    style={{ flex: 1, padding: '1rem', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', background: 'none', color: 'var(--on-surface)', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    style={{ flex: 1, padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}
                                >
                                    Registrar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
