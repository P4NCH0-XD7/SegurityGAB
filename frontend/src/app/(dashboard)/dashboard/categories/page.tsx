"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTags, FaLayerGroup } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

interface Category {
    id: number;
    name: string;
    description: string;
    parentId?: number;
    createdAt?: string;
}

export default function CategoriesManagementPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
    const [formData, setFormData] = useState<Partial<Category>>({
        name: "",
        description: "",
        parentId: undefined,
    });

    const { token } = useAuthStore();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (currentCategory) {
            setFormData(currentCategory);
        } else {
            setFormData({
                name: "",
                description: "",
                parentId: undefined,
            });
        }
    }, [currentCategory]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/categories`);
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            } else {
                toast.error("Error al cargar categorías");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!token) {
            toast.error("Sesión no válida. Por favor, reintroduce tus credenciales.");
            return;
        }

        try {
            const url = currentCategory?.id 
                ? `${API_URL}/categories/${currentCategory.id}` 
                : `${API_URL}/categories`;
            
            const method = currentCategory?.id ? 'PATCH' : 'POST';

            const { ...dataToSend }: any = formData;
            
            delete dataToSend.id;
            delete dataToSend.createdAt;
            delete dataToSend.updatedAt;
            
            // Clean empty strings for parentId so it goes as null to backend
            if (!dataToSend.parentId || dataToSend.parentId === 0 || dataToSend.parentId === "") {
                delete dataToSend.parentId;
            }

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend)
            });

            if (res.ok) {
                toast.success(currentCategory?.id ? "Categoría actualizada" : "Categoría creada");
                setIsModalOpen(false);
                fetchCategories();
            } else {
                const err = await res.json().catch(() => ({ message: "Error en la petición" }));
                toast.error(err.message || "Error al procesar solicitud");
            }
        } catch (error) {
            toast.error("Error de conexión con el servidor");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta categoría? Si tiene productos, estos quedarán sin categoría asignada.")) return;
        
        if (!token) {
            toast.error("Error de autenticación");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                toast.success("Categoría eliminada");
                fetchCategories();
            } else {
                const err = await res.json().catch(() => ({ message: "" }));
                toast.error(err.message || "No se pudo eliminar la categoría");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    const getParentName = (parentId?: number) => {
        if (!parentId) return "Principal";
        const parent = categories.find(c => c.id === parentId);
        return parent ? parent.name : "Desconocido";
    };

    const filteredCategories = categories.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="dashboard-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>Tipos y Categorías</h2>
                    <p style={{ color: 'var(--on-surface-variant)' }}>Clasifica tu inventario de equipos y servicios</p>
                </div>
                <button 
                    onClick={() => { setCurrentCategory(null); setIsModalOpen(true); }}
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
                    <FaPlus /> Nueva Categoría
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
                        placeholder="Buscar categorías..." 
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
                            <th style={{ padding: '1.25rem', textAlign: 'left' }}>Nombre Categoría</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left' }}>Jerarquía</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left' }}>Creado el</th>
                            <th style={{ padding: '1.25rem', textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>Cargando categorías...</td></tr>
                        ) : filteredCategories.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>No se encontraron registros</td></tr>
                        ) : filteredCategories.map((cat) => (
                            <tr key={cat.id} style={{ borderBottom: '1px solid var(--surface-high)' }}>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', background: 'var(--surface-high)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FaTags color="var(--primary)" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '700', color: 'var(--on-surface)' }}>{cat.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                                                {cat.description ? (cat.description.length > 50 ? cat.description.substring(0, 50) + "..." : cat.description) : "Sin descripción"}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <span style={{ 
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        padding: '0.25rem 0.6rem', 
                                        borderRadius: '0.5rem', 
                                        fontSize: '0.75rem', 
                                        fontWeight: '700',
                                        background: 'var(--surface-low)',
                                        border: '1px solid var(--surface-high)',
                                        color: 'var(--on-surface)'
                                    }}>
                                        <FaLayerGroup size={10}/> {getParentName(cat.parentId)}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem', color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>
                                    {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                        <button 
                                            onClick={() => { setCurrentCategory(cat); setIsModalOpen(true); }}
                                            style={{ background: 'var(--surface-high)', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', color: 'var(--on-surface)' }}
                                            title="Editar"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(cat.id)}
                                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', color: '#ef4444' }}
                                            title="Eliminar"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
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
                        maxWidth: '500px', 
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid var(--surface-high)'
                    }}>
                        <h3 style={{ marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.5rem', color: 'var(--on-surface)' }}>
                            {currentCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                        </h3>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>Nombre de Categoría</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name || ""}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>Descripción (Opcional)</label>
                                <textarea 
                                    value={formData.description || ""}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)', minHeight: '80px', resize: 'vertical' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>Jerarquía de Dependencia</label>
                                <select 
                                    value={formData.parentId || ""}
                                    onChange={(e) => setFormData({...formData, parentId: e.target.value ? parseInt(e.target.value) : undefined})}
                                    style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)' }}
                                >
                                    <option value="">[ Ninguna ] Es la categoría principal</option>
                                    {categories
                                        .filter(c => c.id !== currentCategory?.id) // Para que no se dependa a sí misma
                                        .map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '1rem', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', background: 'none', color: 'var(--on-surface)', fontWeight: '700', cursor: 'pointer' }}>
                                    Cancelar
                                </button>
                                <button type="submit" style={{ flex: 1, padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
