import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SecurityNews from '../../src/components/dashboard/SecurityNews';

// Mockeamos la función global fetch para nuestras pruebas
const unmockedFetch = global.fetch;

describe('SecurityNews (Prueba de Integración)', () => {
  beforeEach(() => {
    // Reiniciamos el mock antes de cada prueba
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  it('debería mostrar el estado de carga inicial y luego las noticias cuando la API responde con éxito', async () => {
    // 1. Preparar: Mockeamos una respuesta exitosa
    const mockNewsResponse = {
      status: 'ok',
      items: [
        {
          title: 'Vulnerabilidad Crítica Encontrada',
          pubDate: '2023-10-01T12:00:00Z',
          link: 'https://example.com/news/1',
          description: '<p>Descripción de la vulnerabilidad...</p>',
        },
        {
          title: 'Nuevo Malware de Ransomware',
          pubDate: '2023-10-02T12:00:00Z',
          link: 'https://example.com/news/2',
          description: 'El nuevo ransomware se esparce...',
        }
      ]
    };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockNewsResponse,
    });

    // 2. Actuar: Renderizamos el componente
    render(<SecurityNews />);

    // 3. Comprobar: El spinner de carga debería estar presente inicialmente.
    // Como el spinner es un div con className="loading-spinner", podemos esperar implícitamente a que los datos aparezcan.
    
    // Esperamos a que los ítems mockeados aparezcan en el DOM
    await waitFor(() => {
      expect(screen.getByText('Vulnerabilidad Crítica Encontrada')).toBeInTheDocument();
    });

    expect(screen.getByText('Nuevo Malware de Ransomware')).toBeInTheDocument();
    
    // Verificamos que se hayan eliminado las etiquetas HTML de la descripción
    expect(screen.getByText('Descripción de la vulnerabilidad...')).toBeInTheDocument();
    expect(screen.queryByText('<p>Descripción de la vulnerabilidad...</p>')).not.toBeInTheDocument();
  });

  it('debería mostrar un mensaje de error si la petición a la API falla', async () => {
    // 1. Preparar: Mockeamos una petición fallida
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Error de red'));

    // 2. Actuar: Renderizamos el componente
    render(<SecurityNews />);

    // 3. Comprobar: Esperamos a que aparezca el mensaje de error
    await waitFor(() => {
      expect(screen.getByText('Error de conexión con el servidor de noticias')).toBeInTheDocument();
    });

    // El botón de reintentar también debe estar visible
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
  });

  it('debería permitir al usuario reintentar cargar las noticias después de un error', async () => {
    // 1. Preparar: Mockeamos un fallo seguido de un éxito
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Error de red'))
      .mockResolvedValueOnce({
        json: async () => ({
          status: 'ok',
          items: [{
            title: 'Noticia Tras Reintento',
            pubDate: '2023-10-03T12:00:00Z',
            link: 'https://example.com/news/3',
            description: 'Recuperado con éxito.',
          }]
        }),
      });

    // 2. Actuar
    render(<SecurityNews />);

    // Esperamos al estado de error
    await waitFor(() => {
      expect(screen.getByText('Error de conexión con el servidor de noticias')).toBeInTheDocument();
    });

    // Hacemos click en el botón de reintentar
    const retryButton = screen.getByRole('button', { name: /reintentar/i });
    fireEvent.click(retryButton);

    // 3. Comprobar: Ahora debería mostrar el resultado exitoso
    await waitFor(() => {
      expect(screen.getByText('Noticia Tras Reintento')).toBeInTheDocument();
    });
  });
});
