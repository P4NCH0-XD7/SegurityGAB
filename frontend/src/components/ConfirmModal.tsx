import React, { useEffect } from 'react';
import { FaExclamationTriangle, FaTrash, FaQuestionCircle } from 'react-icons/fa';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    type = 'danger'
}: ConfirmModalProps) {
    
    // Cerrar al presionar la tecla Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
        }
        
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'danger':
                return (
                    <div className="confirm-modal-icon-container danger-type">
                        <FaTrash size={26} />
                    </div>
                );
            case 'warning':
                return (
                    <div className="confirm-modal-icon-container warning-type">
                        <FaExclamationTriangle size={26} />
                    </div>
                );
            default:
                return (
                    <div className="confirm-modal-icon-container info-type">
                        <FaQuestionCircle size={26} />
                    </div>
                );
        }
    };

    const getConfirmButtonClassName = () => {
        if (type === 'danger') return 'confirm-btn confirm-btn-danger';
        if (type === 'warning') return 'confirm-btn confirm-btn-warning';
        return 'confirm-btn confirm-btn-info';
    };

    return (
        <div 
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
                padding: '1rem',
                animation: 'confirmModalFadeIn 0.2s ease-out'
            }}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'var(--surface-lowest)',
                    padding: '2.5rem 2rem',
                    borderRadius: '1.25rem',
                    width: '100%',
                    maxWidth: '420px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    border: '1px solid var(--surface-high)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    animation: 'confirmModalScaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
            >
                {getIcon()}
                
                <h3 style={{ 
                    fontSize: '1.35rem', 
                    fontWeight: '800', 
                    color: 'var(--on-surface)',
                    marginBottom: '0.75rem',
                    letterSpacing: '-0.02em',
                    fontFamily: 'var(--font-manrope), sans-serif'
                }}>
                    {title}
                </h3>
                
                <p style={{ 
                    fontSize: '0.95rem', 
                    color: 'var(--on-surface-variant)', 
                    lineHeight: '1.5',
                    marginBottom: '2rem',
                    fontFamily: 'var(--font-inter), sans-serif'
                }}>
                    {message}
                </p>
                
                <div style={{ display: 'flex', gap: '0.85rem', width: '100%' }}>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="confirm-btn confirm-btn-cancel"
                    >
                        {cancelText}
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }} 
                        className={getConfirmButtonClassName()}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

            {/* Inyectamos los estilos locales y animaciones para no ensuciar globals.css */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes confirmModalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes confirmModalScaleIn {
                    from { transform: scale(0.96); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes confirmPulse {
                    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
                @keyframes confirmIconPop {
                    from { transform: scale(0.7); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                
                .confirm-modal-icon-container {
                    width: 64px;
                    height: 64px;
                    border-radius: 50% !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    margin-bottom: 1.25rem !important;
                    animation: confirmIconPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                
                .confirm-modal-icon-container.danger-type {
                    background-color: rgba(239, 68, 68, 0.08) !important;
                    border: 1.5px solid rgba(239, 68, 68, 0.2) !important;
                    color: #ef4444 !important;
                    animation: confirmPulse 2s infinite, confirmIconPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                
                .confirm-modal-icon-container.warning-type {
                    background-color: rgba(245, 158, 11, 0.08) !important;
                    border: 1.5px solid rgba(245, 158, 11, 0.2) !important;
                    color: #f59e0b !important;
                }
                
                .confirm-modal-icon-container.info-type {
                    background-color: rgba(59, 130, 246, 0.08) !important;
                    border: 1.5px solid rgba(59, 130, 246, 0.2) !important;
                    color: #3b82f6 !important;
                }
                
                .confirm-btn {
                    flex: 1;
                    padding: 0.85rem 1.5rem;
                    border-radius: 0.75rem;
                    font-weight: 700;
                    font-size: 0.95rem;
                    cursor: pointer;
                    border: none;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    display: inline-flex;
                    align-items: center;
                    justifyContent: center;
                }
                .confirm-btn:active {
                    transform: scale(0.97);
                }
                
                .confirm-btn-cancel {
                    border: 1px solid var(--surface-high) !important;
                    background-color: var(--surface-low) !important;
                    color: var(--on-surface-variant) !important;
                }
                .confirm-btn-cancel:hover {
                    background-color: var(--surface-high) !important;
                    color: var(--on-surface) !important;
                }
                
                .confirm-btn-danger {
                    background-color: #ef4444 !important;
                    color: #ffffff !important;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2) !important;
                }
                .confirm-btn-danger:hover {
                    background-color: #dc2626 !important;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3) !important;
                }
                
                .confirm-btn-warning {
                    background-color: #f59e0b !important;
                    color: #ffffff !important;
                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2) !important;
                }
                .confirm-btn-warning:hover {
                    background-color: #d97706 !important;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(245, 158, 11, 0.3) !important;
                }
                
                .confirm-btn-info {
                    background-color: var(--primary) !important;
                    color: #ffffff !important;
                    box-shadow: 0 4px 12px rgba(17, 92, 185, 0.2) !important;
                }
                .confirm-btn-info:hover {
                    background-color: var(--primary-light) !important;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(17, 92, 185, 0.3) !important;
                }
            `}} />
        </div>
    );
}
