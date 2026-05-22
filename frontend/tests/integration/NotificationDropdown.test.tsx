import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationDropdown from '../../src/components/dashboard/NotificationDropdown';
import { useAuthStore } from '../../src/store/useAuthStore';

// Mockeamos useAuthStore y fetch global
const unmockedFetch = global.fetch;

describe('NotificationDropdown (Prueba de Integración)', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    // Reiniciamos el estado del store de autenticación
    useAuthStore.setState({
      token: 'mock-token',
    });
  });

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  it('debería obtener las notificaciones, actualizar el número de la burbuja y mostrar los items al hacer click', async () => {
    // 1. Preparar: Mockeamos la respuesta de la API
    const mockApiResponse = {
      outOfStock: 2,
      lowStock: 5,
      pendingSales: 1,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    // 2. Actuar: Renderizamos el componente
    render(<NotificationDropdown />);

    // Verificamos que se haya hecho la llamada a la API
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/reports/dashboard'),
      expect.objectContaining({
        headers: { Authorization: 'Bearer mock-token' }
      })
    );

    // 3. Comprobar: Esperamos a que la burbuja roja muestre '3' (2 + 5 + 1 = 3 notificaciones principales)
    const unreadBadge = await screen.findByText('3');
    expect(unreadBadge).toBeInTheDocument();

    // El menú desplegable está cerrado inicialmente, por lo que el texto no debe ser visible
    expect(screen.queryByText('Productos Agotados')).not.toBeInTheDocument();

    // Actuar: Hacemos click en el icono de la campana para abrir el menú
    const bellIcon = screen.getByTestId('notification-bell');
    fireEvent.click(bellIcon);

    // Comprobar: Los contenidos del menú ahora deben ser visibles
    expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    expect(screen.getByText('Productos Agotados')).toBeInTheDocument();
    expect(screen.getByText('Stock Bajo')).toBeInTheDocument();
    expect(screen.getByText('Pedidos Pendientes')).toBeInTheDocument();
    
    // Verificamos un mensaje específico
    expect(screen.getByText('Hay 2 productos sin existencias.')).toBeInTheDocument();
  });

  it('debería mostrar el estado vacío cuando no hay notificaciones', async () => {
    // 1. Preparar: La API devuelve cero para todas las categorías
    const mockApiResponse = {
      outOfStock: 0,
      lowStock: 0,
      pendingSales: 0,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    // 2. Actuar
    render(<NotificationDropdown />);

    // Hacemos click en la campana
    const bellIcon = screen.getByTestId('notification-bell');
    fireEvent.click(bellIcon);

    // 3. Comprobar: verificamos que muestre el mensaje de vacío
    await waitFor(() => {
        expect(screen.getByText('No tienes notificaciones pendientes')).toBeInTheDocument();
    });
  });
});
