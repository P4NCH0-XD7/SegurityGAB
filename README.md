# SegurityGAB


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
git clone 
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
DB_PASSWORD=
DB_NAME=seguritygab
JWT_SECRET=y
JWT_EXPIRATION=

```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=SegurityGAB
```

---

## Base de Datos

Los scripts SQL se encuentran en `/database` y deben ejecutarse en MySQL Workbench en el siguiente orden:

1. `schema/` — Creación de tablas y relaciones
2. `seeds/` — Datos iniciales (roles, admin)

---

## Scripts Disponibles

### Backend
```bash
npm run start:dev     # Desarrollo 
npm run build         # Compilar para producción
npm run start:prod    # Ejecutar producción
```

### Frontend
```bash
npm run dev           # Desarrollo 
npm run build         # Compilar para producción
npm run start         # Ejecutar producción local
```


## Despliegue

| Componente | Plataforma | Método |
|---|---|---|
| Frontend | Vercel | Git push → Auto deploy |
| Backend | AWS EC2 | CI/CD con GitHub Actions |
| Base de Datos | AWS RDS / Local | Scripts SQL manuales |

---

