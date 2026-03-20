"use client";
import { FaShieldAlt, FaBuilding, FaIndustry, FaHome, FaCheckCircle } from "react-icons/fa";
import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import Link from "next/link";

export default function SolutionsPage() {
    const solutions = [
        {
            title: "Seguridad Residencial",
            icon: <FaHome size={40} />,
            description: "Protegemos tu hogar con la mejor tecnología en CCTV y alarmas inteligentes.",
            features: ["Monitoreo 24/7", "Alertas al celular", "Cámaras con IA", "Domótica integrada"]
        },
        {
            title: "Seguridad Comercial",
            icon: <FaBuilding size={40} />,
            description: "Control total sobre tu negocio, empleados y activos con sistemas de última generación.",
            features: ["Control de acceso", "Conteo de personas", "Prevención de pérdidas", "Video analítica"]
        },
        {
            title: "Seguridad Industrial",
            icon: <FaIndustry size={40} />,
            description: "Soluciones robustas para grandes superficies y entornos industriales complejos.",
            features: ["Detección de incendio", "Perímetros inteligentes", "Cámaras térmicas", "Redes cableadas"]
        }
    ];

    return (
        <div style={{ background: 'var(--surface)', minHeight: '100vh', color: 'var(--on-surface)' }}>
            <Navbar />
            
            <section style={{ 
                padding: '100px 5%', 
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%)',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
                    Soluciones de Seguridad <span style={{ color: 'var(--primary)' }}>Inteligente</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--secondary)', maxWidth: '800px', margin: '0 auto 3rem' }}>
                    Diseñamos sistemas a medida que combinan hardware de alta gama con software de inteligencia artificial para garantizar tu tranquilidad.
                </p>
                <Link href="/support" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                    Consultar a un Experto
                </Link>
            </section>

            <section style={{ padding: '80px 5%' }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '2.5rem' 
                }}>
                    {solutions.map((sol, idx) => (
                        <div key={idx} style={{ 
                            background: 'var(--surface-low)', 
                            padding: '3rem', 
                            borderRadius: '2rem', 
                            border: '1px solid var(--surface-high)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            cursor: 'default',
                        }} className="solution-card">
                            <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>{sol.icon}</div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem' }}>{sol.title}</h2>
                            <p style={{ color: 'var(--secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>{sol.description}</p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {sol.features.map((feat, fIdx) => (
                                    <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                                        <FaCheckCircle color="var(--primary)" /> {feat}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ 
                padding: '100px 5%', 
                background: 'var(--surface-high)',
                textAlign: 'center',
                margin: '40px 0'
            }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <FaShieldAlt size={60} color="var(--primary)" style={{ marginBottom: '2rem' }} />
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>¿Por qué elegir SegurityGAB?</h2>
                    <p style={{ fontSize: '1.15rem', color: 'var(--secondary)', lineHeight: '1.8' }}>
                        No solo vendemos equipos; proporcionamos ecosistemas de seguridad completos. 
                        Nuestra integración vertical permite que todos tus dispositivos se comuniquen entre sí, 
                        creando una barrera infranqueable ante cualquier amenaza.
                    </p>
                </div>
            </section>

            <Footer />
            <style jsx>{`
                .solution-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                    border-color: var(--primary);
                }
            `}</style>
        </div>
    );
}
