"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaBoxOpen } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    sku: string;
    status: 'visible' | 'hidden';
    imageUrl?: string;
    categoryId?: number;
}

interface Category {
    id: number;
    name: string;
}

export default function ProductsManagementPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        sku: "",
        status: "visible",
        categoryId: undefined,
        imageUrl: ""
    });

    const { token } = useAuthStore();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (currentProduct) {
            setFormData(currentProduct);
        } else {
            setFormData({
                name: "",
                description: "",
                price: 0,
                stock: 0,
                sku: "",
                status: "visible",
                categoryId: undefined,
                imageUrl: ""
            });
        }
    }, [currentProduct]);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/products`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Error al cargar productos");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/categories`);
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!token) {
            toast.error("Sesión no válida. Por favor, reintroduce tus credenciales.");
            return;
        }

        try {
            const url = currentProduct?.id 
                ? `${API_URL}/products/${currentProduct.id}` 
                : `${API_URL}/products`;
            
            const method = currentProduct?.id ? 'PATCH' : 'POST';

            // Preparar dataToSend excluyendo campos extra que envía el backend
            // para que no fallen al pasar por la validación del DTO (forbidNonWhitelisted).
            const { id, createdAt, updatedAt, deletedAt, slug, category, ...dataToSend }: any = formData;
            
            // Aseguramos que los tipos numéricos sean correctos
            dataToSend.price = Number(dataToSend.price);
            dataToSend.stock = Number(dataToSend.stock);
            
            // Manejo estricto de categoryId: si es 0 o indefinido lo removemos o enviamos null
            if (!dataToSend.categoryId || dataToSend.categoryId === 0) {
                delete dataToSend.categoryId;
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
                toast.success(currentProduct?.id ? "Producto actualizado correctamente" : "Producto creado exitosamente");
                setIsModalOpen(false);
                fetchProducts();
            } else {
                const err = await res.json().catch(() => ({ message: "Ocurrió un error inesperado" }));
                toast.error(err.message || "Error al procesar la solicitud");
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("Error de conexión con el servidor");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este producto permanentemente?")) return;
        
        if (!token) {
            toast.error("Error de autenticación");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                toast.success("Producto eliminado (Soft-delete aplicado)");
                fetchProducts();
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(err.message || "No se pudo eliminar el producto");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getDisplayImageUrl = (url?: string) => {
        if (!url) return "";
        // Detectar IDs de Google Drive en varios formatos (compartir, enlace directo, etc)
        const driveMatch = url.match(/(?:\/file\/d\/|id=)([a-zA-Z0-9_-]+)/);
        if (driveMatch && driveMatch[1]) {
            // Usamos drive.usercontent.google.com que suele ser más directo para incrustar
            return `https://drive.usercontent.google.com/download?id=${driveMatch[1]}&export=view`;
        }
        return url;
    };

    return (
        <div className="dashboard-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>Gestión de Productos</h2>
                    <p style={{ color: 'var(--on-surface-variant)' }}>Administra el catálogo de dispositivos de seguridad</p>
                </div>
                <button 
                    onClick={() => { setCurrentProduct(null); setIsModalOpen(true); }}
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
                    <FaPlus /> Nuevo Producto
                </button>
            </div>

            {/* Filters Bar */}
            <div style={{ 
                background: 'var(--surface-low)', 
                padding: '1rem', 
                borderRadius: '1rem', 
                display: 'flex', 
                gap: '1rem', 
                marginBottom: '2rem',
                alignItems: 'center'
            }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)' }} />
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre o SKU..." 
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
                <button style={{ padding: '0.75rem 1.25rem', background: 'var(--surface)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaFilter /> Filtros
                </button>
            </div>

            {/* Products Table */}
            <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--surface-low)', color: 'var(--on-surface-variant)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                            <th style={{ padding: '1.25rem', textAlign: 'left' }}>Producto</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left' }}>SKU</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left' }}>Precio</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left' }}>Stock</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left' }}>Estado</th>
                            <th style={{ padding: '1.25rem', textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>Cargando productos...</td></tr>
                        ) : filteredProducts.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>No se encontraron productos</td></tr>
                        ) : filteredProducts.map((product) => (
                            <tr key={product.id} style={{ borderBottom: '1px solid var(--surface-high)', transition: 'background 0.2s ease' }}>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '48px', height: '48px', background: 'var(--surface-high)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {product.imageUrl ? (
                                                <img 
                                                    src={getDisplayImageUrl(product.imageUrl)} 
                                                    alt={product.name} 
                                                    referrerPolicy="no-referrer"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "https://placehold.co/100x100?text=Error";
                                                    }}
                                                />
                                            ) : (
                                                <FaBoxOpen color="var(--on-surface-variant)" />
                                            )}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '700', color: 'var(--on-surface)' }}>{product.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>{product.description?.substring(0, 40)}...</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem', color: 'var(--on-surface-variant)', fontFamily: 'monospace' }}>{product.sku || 'N/A'}</td>
                                <td style={{ padding: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>${Number(product.price).toFixed(2)}</td>
                                <td style={{ padding: '1.25rem' }}>
                                    <span style={{ 
                                        color: product.stock < 10 ? 'var(--error)' : 'var(--on-surface)',
                                        fontWeight: '700'
                                    }}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <span style={{ 
                                        padding: '0.35rem 0.75rem', 
                                        borderRadius: '2rem', 
                                        fontSize: '0.75rem', 
                                        fontWeight: '700',
                                        background: product.status === 'visible' ? 'var(--secondary-container)' : 'rgba(100, 116, 139, 0.1)',
                                        color: product.status === 'visible' ? 'var(--secondary)' : 'var(--on-surface-variant)'
                                    }}>
                                        {product.status === 'visible' ? 'Visible' : 'Oculto'}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                        <button 
                                            onClick={() => { setCurrentProduct(product); setIsModalOpen(true); }}
                                            style={{ background: 'var(--surface-high)', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', color: 'var(--on-surface)' }}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(product.id)}
                                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', color: '#ef4444' }}
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

            {/* Product Form Modal */}
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
                        maxWidth: '600px', 
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid var(--surface-high)',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h3 style={{ marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.5rem', color: 'var(--on-surface)' }}>
                            {currentProduct ? 'Editar Producto' : 'Nuevo Producto'}
                        </h3>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>Nombre</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>SKU</label>
                                    <input 
                                        type="text" 
                                        value={formData.sku}
                                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                                        style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>Descripción</label>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)', minHeight: '100px', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>Precio</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value ? parseFloat(e.target.value) : 0})}
                                        style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>Stock</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={formData.stock}
                                        onChange={(e) => setFormData({...formData, stock: e.target.value ? parseInt(e.target.value) : 0})}
                                        style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>Categoría</label>
                                    <select 
                                        value={formData.categoryId || ""}
                                        onChange={(e) => setFormData({...formData, categoryId: e.target.value ? parseInt(e.target.value) : undefined})}
                                        style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)' }}
                                    >
                                        <option value="">Seleccionar...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>Estado</label>
                                    <select 
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                                        style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)' }}
                                    >
                                        <option value="visible">Visible</option>
                                        <option value="hidden">Oculto</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>Vista Previa</label>
                                <div style={{ 
                                    width: '100%', 
                                    height: '150px', 
                                    background: 'var(--surface-low)', 
                                    borderRadius: '0.75rem', 
                                    border: '1px dashed var(--surface-high)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    {formData.imageUrl ? (
                                        <img 
                                            src={getDisplayImageUrl(formData.imageUrl)} 
                                            alt="Preview" 
                                            referrerPolicy="no-referrer"
                                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} 
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "https://placehold.co/300x150?text=Error+de+Carga";
                                            }}
                                        />
                                    ) : (
                                        <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.8rem' }}>Sin imagen</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>URL de Imagen</label>
                                <input 
                                    type="text" 
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                                    style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-low)', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', color: 'var(--on-surface)' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '1rem', border: '1px solid var(--surface-high)', borderRadius: '0.75rem', background: 'none', color: 'var(--on-surface)', fontWeight: '700', cursor: 'pointer' }}>
                                    Cancelar
                                </button>
                                <button type="submit" style={{ flex: 1, padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                                    {currentProduct ? 'Actualizar Producto' : 'Crear Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
