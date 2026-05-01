'use client';

import { useState, useEffect } from 'react';
import { FaShieldAlt, FaExternalLinkAlt, FaSyncAlt } from 'react-icons/fa';

interface NewsItem {
    title: string;
    pubDate: string;
    link: string;
    description: string;
    thumbnail: string;
}

export default function SecurityNews() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.feedburner.com/TheHackersNews');
            const data = await response.json();
            if (data.status === 'ok') {
                setNews(data.items.slice(0, 5));
            } else {
                setError('No se pudieron cargar las noticias');
            }
        } catch (err) {
            setError('Error de conexión con el servidor de noticias');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <div className="stat-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FaShieldAlt style={{ color: 'var(--primary)' }} /> Actualidad de Seguridad
                </h3>
                <button 
                    onClick={fetchNews}
                    disabled={loading}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        color: 'var(--on-surface-variant)',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'transform 0.3s ease'
                    }}
                    title="Actualizar noticias"
                    className={loading ? 'animate-spin' : ''}
                >
                    <FaSyncAlt size={14} />
                </button>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: '200px' }}>
                    <div className="loading-spinner" style={{ 
                        width: '30px', 
                        height: '30px', 
                        border: '3px solid var(--surface-high)', 
                        borderTop: '3px solid var(--primary)', 
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--on-surface-variant)' }}>
                    <p>{error}</p>
                    <button 
                        onClick={fetchNews}
                        style={{ marginTop: '1rem', background: 'var(--surface-high)', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', cursor: 'pointer' }}
                    >
                        Reintentar
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', flex: 1 }}>
                    {news.map((item, idx) => (
                        <div key={idx} style={{ 
                            paddingBottom: idx === news.length - 1 ? 0 : '1.25rem', 
                            borderBottom: idx === news.length - 1 ? 'none' : '1px solid var(--surface-high)',
                            transition: 'all 0.2s ease'
                        }}>
                            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--on-surface)', marginBottom: '0.25rem', lineHeight: '1.4' }}>
                                    {item.title}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>{new Date(item.pubDate).toLocaleDateString()}</span>
                                    <span style={{ fontSize: '10px', opacity: 0.5 }}>•</span>
                                    <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        Leer más <FaExternalLinkAlt size={10} />
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                                    {item.description.replace(/<[^>]*>?/gm, '')}
                                </p>
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
