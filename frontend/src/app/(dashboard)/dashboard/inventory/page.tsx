"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaExchangeAlt, FaArrowUp, FaArrowDown, FaWrench } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

interface InventoryMovement {
    id: number;
    productId: number;
    type: 'IN' | 'OUT' | 'ADJUSTMENT';
    quantity: number;
    reason?: string;
    referenceId?: number;
    createdAt: string;
    product: {
        name: string;
        sku: string;
    }
}

interface Product {
    id: number;
    name: string;
    stock: number;
}

export default function InventoryManagementPage() {
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

    const { token } = useAuthStore();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

    useEffect(() => {
        fetchMovements();
        fetchProducts();
    }, []);

    const fetchMovements = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/inventory`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMovements(data);
            }
        } catch (error) {
            toast.error("Error al cargar el historial de inventario");
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/products`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!token) {
            toast.error("Sesión no válida");
            return;
        }

        if (formData.productId === 0) {
            toast.error("Debes seleccionar un producto");
            return;
        }

        try {
            const dataToSend = {
                productId: formData.productId,
                type: formData.type,
                quantity: Number(formData.quantity),
                reason: formData.reason || "Registro manual de administrador"
            };

            const res = await fetch(`${API_URL}/inventory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend)
            });

            if (res.ok) {
                toast.success("Movimiento registrado exitosamente");
                setIsModalOpen(false);
                setFormData({ productId: 0, type: 'IN', quantity: 1, reason: "" });
                fetchMovements(); // refrescar la tabla
            } else {
                const err = await res.json().catch(() => ({ message: "Error en la petición" }));
                toast.error(err.message || "Error al procesar solicitud");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    const filteredMovements = movements.filter(m => 
        (m.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (m.reason?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getMovementTypeIcon = (type: string) => {
        switch(type) {
            case 'IN': return <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FaArrowUp /> Entrada</span>;
            case 'OUT': return <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FaArrowDown /> Salida</span>;
            case 'ADJUSTMENT': return <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FaWrench /> Ajuste M.</span>;
            default: return <FaExchangeAlt />;
        }
    };

    return (
        <div className="dashboard-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>Control de Inventario</h2>
                    <p style={{ color: 'var(--on-surface-variant)' }}>Registra y monitorea el flujo de stock</p>
                </div>
                <button 
                    onClick={() => { setIsModalOpen(true); }}
                    style={{ 
                        background: 'var(--primary)', 
                        color: 'var(--on-primary)', 
                        padding: '0.75rem 1.5rem', 
                        borderRadius: '0.75rem', 
                        border: 'none', 
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }}
                >
                    <FaPlus /> Registrar Movimiento
                </button>
            </div>

            {/* Search */}
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
                        placeholder="Buscar por producto, motivo..." 
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
                            <th style={{ padding: '1.25rem', textAlign: 'left' }}>Fecha</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left' }}>Producto Relacionado</th>
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
                        ) : filteredMovements.map((mov) => (
                            <tr key={mov.id} style={{ borderBottom: '1px solid var(--surface-high)' }}>
                                <td style={{ padding: '1.25rem', color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>
                                    {new Date(mov.createdAt).toLocaleString()}
                                </td>
                                <td style={{ padding: '1.25rem', fontWeight: '700', color: 'var(--on-surface)' }}>
                                    {mov.product?.name || `Producto ID: ${mov.productId}`}
                                </td>
                                <td style={{ padding: '1.25rem', fontWeight: '700' }}>
                                    {getMovementTypeIcon(mov.type)}
                                </td>
                                <td style={{ padding: '1.25rem', fontWeight: '800', fontSize: '1.1rem' }}>
                                    {mov.type === 'OUT' ? '-' : (mov.type === 'IN' ? '+' : '')}{mov.quantity}
                                </td>
                                <td style={{ padding: '1.25rem', color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>
                                    {mov.reason || 'S/M'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Form Modal */}
            {isModalOpen && (
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
                        maxWidth: '550px', 
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid var(--surface-high)'
                    }}>
                        <h3 style={{ marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.5rem', color: 'var(--on-surface)' }}>
                            Registrar Movimiento
                        </h3>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>Producto a Modificar</label>
                                <select 
                                    required
                                    value={formData.productId}
                                    onChange={(e) => setFormData({...formData, productId: parseInt(e.target.value)})}
                                    style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)' }}
                                >
                                    <option value={0}>[ Selecciona un producto ]</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>Tipo de Movimiento</label>
                                    <select 
                                        required
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                                        style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)', fontWeight: '600' }}
                                    >
                                        <option value="IN">Entrada (IN)</option>
                                        <option value="OUT">Salida (OUT)</option>
                                        <option value="ADJUSTMENT">Ajuste Manual (Reemplazo)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>
                                        {formData.type === 'ADJUSTMENT' ? 'Nuevo Stock Total' : 'Cantidad'}
                                    </label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        required
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                                        style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)', fontSize: '1.1rem', fontWeight: '800' }}
                                    />
                                </div>
                            </div>
                            
                            {formData.type === 'OUT' && (
                                <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '-0.75rem' }}>
                                    Asegúrate de que el producto tenga stock suficiente.
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>Motivo / Referencia</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="Ej: Compra proveedor, Merma, etc."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                    style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '1rem', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', background: 'none', color: 'var(--on-surface)', fontWeight: '700', cursor: 'pointer' }}>
                                    Cancelar
                                </button>
                                <button type="submit" style={{ flex: 1, padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
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
