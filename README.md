# 🛡️ SegurityGAB

> Plataforma web responsive para la comercialización de equipos de seguridad electrónica.

---

##  Tabla de Contenidos

- [Descripción](#descripción)
- [Arquitectura](#arquitectura)
- [Tech Stack](#tech-stack)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Base de Datos](#base-de-datos)
- [Scripts Disponibles](#scripts-disponibles)
- [Testing](#testing)
- [Despliegue](#despliegue)
- [Convenciones](#convenciones)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## Descripción

**SegurityGAB** es un sistema full-stack de comercio electrónico especializado en equipos de seguridad electrónica. Permite la gestión integral de productos, inventario, clientes, proveedores, ventas y usuarios con control de roles.

### Módulos Funcionales

| Módulo | Descripción |
|---|---|
| Autenticación | Login, registro, JWT, recuperación de contraseña |
| Usuarios y Roles | CRUD de usuarios con control de acceso por roles |
| Productos | Catálogo completo con imágenes y categorización |
| Categorías | Clasificación jerárquica de productos |
| Inventario | Control de stock con alertas automáticas |
| Clientes | Gestión de clientes registrados |
| Proveedores | Directorio de proveedores |
| Ventas | Proceso de venta con estados |
| Detalle de Ventas | Líneas de productos por venta |
| Carrito | Carrito de compras temporal |
| Wishlist | Lista de deseos por usuario |
| Perfil | Gestión de perfil personal |
| Carga de Imágenes | Upload y gestión de assets |
| Alertas de Stock | Notificaciones de inventario bajo |
| Reportes | Métricas de ventas e inventario |

---

## Arquitectura

El sistema sigue el patrón **MVC (Model-View-Controller)** tanto en frontend como en backend, con separación clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Frontend (Next.js / Vercel)              │  │
│  │  View ←→ Controller (Hooks) ←→ Model (State/Types)   │  │
│  └──────────────────────┬────────────────────────────────┘  │
│                         │ HTTP/HTTPS (REST API)             │
│  ┌──────────────────────▼────────────────────────────────┐  │
│  │              Backend (NestJS / AWS)                    │  │
│  │  Controller ←→ Service ←→ Repository ←→ Entity (DB)   │  │
│  └──────────────────────┬────────────────────────────────┘  │
│                         │ TypeORM                           │
│  ┌──────────────────────▼────────────────────────────────┐  │
│  │              Base de Datos (MySQL)                     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14+ (App Router), TypeScript, Zustand |
| Backend | NestJS 11, TypeScript, TypeORM |
| Base de Datos | MySQL 8.0 |
| Autenticación | JWT + Bcrypt + Cookies HttpOnly |
| Validación | class-validator, class-transformer |
| Testing | Jest, React Testing Library, Supertest |
| Deploy Frontend | Vercel |
| Deploy Backend | AWS (EC2 / ECS) |
| Almacenamiento | AWS S3 (imágenes) |

---

## Estructura del Proyecto

```
SegurityGAB/
├── frontend/          # Aplicación Next.js
├── backend/           # API REST NestJS
├── database/          # Scripts SQL para MySQL Workbench
├── docs/              # Documentación técnica
├── .gitignore
└── README.md
```

> Ver cada directorio para documentación específica.

---

## Requisitos Previos

- Node.js >= 18.x
- npm >= 9.x
- MySQL >= 8.0
- MySQL Workbench (para modelado)
- Git

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/SegurityGAB.git
cd SegurityGAB

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

---

## Variables de Entorno

### Backend (`backend/.env`)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=seguritygab
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h
CORS_ORIGIN=http://localhost:3000
AWS_S3_BUCKET=seguritygab-uploads
AWS_REGION=us-east-1
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_NAME=SegurityGAB
```

---

## Base de Datos

Los scripts SQL se encuentran en `/database` y deben ejecutarse en MySQL Workbench en el siguiente orden:

1. `schema/` — Creación de tablas y relaciones
2. `seeds/` — Datos iniciales (roles, admin)
3. `scripts/triggers/` — Triggers automáticos
4. `scripts/procedures/` — Procedimientos almacenados

---

## Scripts Disponibles

### Backend
```bash
npm run start:dev     # Desarrollo con hot-reload
npm run build         # Compilar para producción
npm run start:prod    # Ejecutar producción
npm run test          # Tests unitarios
npm run test:e2e      # Tests de integración
```

### Frontend
```bash
npm run dev           # Desarrollo con hot-reload
npm run build         # Compilar para producción
npm run start         # Ejecutar producción local
npm run test          # Tests unitarios
npm run lint          # Linting
```

---

## Testing

- **Unit Tests**: Ubicados junto a los archivos (`*.spec.ts`) o en `/tests/unit`
- **E2E Tests**: Ubicados en `/tests/e2e`
- **Coverage**: `npm run test:cov`

---

## Despliegue

| Componente | Plataforma | Método |
|---|---|---|
| Frontend | Vercel | Git push → Auto deploy |
| Backend | AWS EC2 | CI/CD con GitHub Actions |
| Base de Datos | AWS RDS / Local | Scripts SQL manuales |

---

## Convenciones

- **Archivos**: `kebab-case` (backend), `PascalCase` para componentes (frontend)
- **Clases**: `PascalCase`
- **Variables/Funciones**: `camelCase`
- **Tablas BD**: `snake_case` plural
- **Columnas BD**: `snake_case` singular
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)
- **Ramas**: `feature/`, `fix/`, `hotfix/`, `release/`

---

## Contribución

1. Fork el proyecto
2. Crear rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push (`git push origin feature/nueva-funcionalidad`)
5. Pull Request

---

