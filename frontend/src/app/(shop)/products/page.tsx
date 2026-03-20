'use client';

import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";

export default function ProductsPage() {
    const addItem = useCartStore((state) => state.addItem);

    const products = [
        { id: 1, title: "Cámara IP Domo 4K", price: "$129.000", image: "/products/camera_ip_domo_4k.png" },
        { id: 2, title: "Kit Alarma Premium", price: "$245.500", image: "/products/kit_alarma_premium.png" },
        { id: 3, title: "DVR Híbrido 16ch", price: "$189.000", image: "/products/dvr_recorder_pro.png" },
        { id: 4, title: "Cámara PTZ Exterior", price: "$79.990", image: "/products/camera_ptz_outdoor.png" },
    ];

    const handleAddToCart = (product: any) => {
        addItem(product);
        toast.success(`${product.title} añadido al carrito`);
    };

    return (
        <div style={{ background: 'var(--surface)' }}>
            <Navbar />
            <main className="container" style={{ padding: '80px 1.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Nuestro Catálogo</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                    {products.map(product => (
                        <div key={product.id} className="product-card" style={{ background: 'var(--surface-lowest)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                            <div style={{ height: '240px', background: 'var(--surface-high)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '60%', height: '60%', background: 'rgba(0,0,0,0.05)', borderRadius: '50%' }}></div>
                            </div>
                            <div style={{ padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>{product.title}</h3>
                                <p style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '1.5rem' }}>{product.price}</p>
                                <button 
                                    onClick={() => handleAddToCart(product)}
                                    className="btn btn-primary" 
                                    style={{ width: '100%', padding: '1rem', cursor: 'pointer' }}
                                >
                                    Comprar ahora
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
