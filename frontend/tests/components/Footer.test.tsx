import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../../src/components/shop/Footer';

describe('Componente Footer', () => {
  it('debería renderizar el nombre de la marca y la descripción', () => {
    render(<Footer />);
    
    // Comprueba si el título principal está presente
    expect(screen.getByText('SegurityGAB')).toBeInTheDocument();
    
    // Comprueba si la descripción de la marca está presente
    expect(screen.getByText(/Líderes en seguridad electrónica/i)).toBeInTheDocument();
  });

  it('debería renderizar la información de contacto', () => {
    render(<Footer />);
    
    expect(screen.getByText('Email: info@seguritygab.com')).toBeInTheDocument();
    expect(screen.getByText('Tel: +57 300 243 2182')).toBeInTheDocument();
  });

  it('debería tener un campo de entrada para email y un botón OK', () => {
    render(<Footer />);
    
    const emailInput = screen.getByPlaceholderText('Tu email');
    const submitButton = screen.getByRole('button', { name: /ok/i });

    expect(emailInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('debería permitir escribir dentro del campo de email', () => {
    render(<Footer />);
    
    const emailInput = screen.getByPlaceholderText('Tu email') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'prueba@ejemplo.com' } });
    
    expect(emailInput.value).toBe('prueba@ejemplo.com');
  });
});
