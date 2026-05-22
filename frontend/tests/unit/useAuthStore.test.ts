import { useAuthStore } from '../../src/store/useAuthStore';

// Mockeamos localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useAuthStore (Hook Personalizado / Store)', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Reiniciamos el estado del store de Zustand antes de cada prueba
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,
    });
  });

  it('debería inicializar con los valores por defecto', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('debería iniciar sesión y guardar en localStorage', () => {
    const mockUser = { id: '1', name: 'Usuario Prueba', email: 'test@test.com' };
    const mockToken = 'mock-jwt-token';

    useAuthStore.getState().login(mockUser, mockToken);

    const state = useAuthStore.getState();
    
    // Verificamos que el estado global se actualiza
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(state.isAuthenticated).toBe(true);

    // Verificamos que se guarden los datos físicos en el navegador (localStorage)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', mockToken);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
  });

  it('debería cerrar sesión y borrar los datos de localStorage', () => {
    // Preparamos un estado de usuario "logueado" inicialmente
    const mockUser = { id: '1', name: 'Usuario Prueba' };
    const mockToken = 'mock-jwt-token';
    useAuthStore.setState({ user: mockUser, token: mockToken, isAuthenticated: true });

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();

    // Verificamos que el estado global vuelve a estar vacío
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);

    // Verificamos la limpieza física de los datos
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
  });

  it('debería ejecutar checkAuth y restaurar la sesión guardada', () => {
    const mockUser = { id: '1', name: 'Usuario Prueba' };
    const mockToken = 'mock-jwt-token';
    
    // Rellenamos el localStorage con datos pre-existentes
    localStorageMock.setItem('access_token', mockToken);
    localStorageMock.setItem('user', JSON.stringify(mockUser));

    useAuthStore.getState().checkAuth();

    const state = useAuthStore.getState();

    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(state.isInitialized).toBe(true);
  });
});
