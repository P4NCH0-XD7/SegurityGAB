import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Carpeta donde están tus tests E2E
  testDir: './e2e',

  // Tiempo máximo de espera para cada test
  timeout: 30000,

  // Reintentos en caso de fallo
  retries: 1,

  // Configuración global de uso para todos los tests
  use: {
    headless: true, // Ejecutar sin abrir el navegador
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure', // Guarda video solo si falla
    screenshot: 'only-on-failure', // Captura pantalla solo si falla
    baseURL: 'http://localhost:3000', // URL base del frontend
  },

  // Configuración por navegador/proyecto
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  // Levantar el servidor del frontend antes de ejecutar los tests
  webServer: {
    command: 'npm run start', // Asegúrate de que este comando levante tu frontend
    url: 'http://localhost:3000', // Debe coincidir con baseURL
    reuseExistingServer: !process.env.CI,
    timeout: 60000, // Espera máximo 60s para que el servidor arranque
  },

  // Reportes opcionales
  reporter: [['list'], ['html', { open: 'never' }]],
});
