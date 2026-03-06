# 🗄️ SegurityGAB - Database Documentation

## Entity-Relationship Diagram

> El archivo `.mwb` (MySQL Workbench Model) debe colocarse en esta carpeta
> para versionar el modelo de datos gráfico.

## Tablas del Sistema

### Módulo de Usuarios
| Tabla | Descripción |
|---|---|
| `roles` | Roles del sistema (admin, manager, customer) |
| `users` | Usuarios registrados con referencia a rol |
| `password_resets` | Tokens de recuperación de contraseña |

### Módulo de Productos
| Tabla | Descripción |
|---|---|
| `categories` | Categorías de equipos de seguridad |
| `products` | Catálogo de productos |
| `product_images` | Imágenes múltiples por producto |

### Módulo de Inventario
| Tabla | Descripción |
|---|---|
| `inventory_movements` | Registro auditable de movimientos de stock |
| `stock_alerts` | Configuración de alertas por producto |

### Módulo de Entidades Externas
| Tabla | Descripción |
|---|---|
| `customers` | Clientes registrados |
| `suppliers` | Proveedores de equipos |

### Módulo de Ventas
| Tabla | Descripción |
|---|---|
| `sales` | Encabezado de ventas |
| `sale_details` | Líneas de detalle por venta |
| `sale_cancellations` | Justificaciones de anulación |

### Módulo de Carrito y Wishlist
| Tabla | Descripción |
|---|---|
| `carts` | Carrito por usuario |
| `cart_items` | Productos en carrito |
| `wishlists` | Lista de deseos |

### Auditoría
| Tabla | Descripción |
|---|---|
| `audit_logs` | Registro de acciones para seguridad |

## Orden de Ejecución

1. `schema/01_create_database.sql`
2. `schema/02_users_roles.sql`
3. `schema/03_products_categories.sql`
4. `schema/04_inventory.sql`
5. `schema/05_customers_suppliers.sql`
6. `schema/06_sales.sql`
7. `schema/07_cart_wishlist.sql`
8. `seeds/01_default_roles.sql`
9. `seeds/02_superadmin_user.sql`
10. `seeds/03_default_categories.sql`
11. `scripts/triggers/trg_stock_on_sale.sql`
12. `scripts/procedures/sp_sales_report.sql`
13. `scripts/functions/fn_cart_total.sql`

## Convenciones

- **Tablas**: `snake_case`, pluralizado (`users`, `products`)
- **Columnas**: `snake_case`, singular (`user_id`, `created_at`)
- **Foreign Keys**: `{tabla_singular}_id` (ej. `product_id`)
- **Índices**: `idx_{tabla}_{columna}` (ej. `idx_users_email`)
- **Triggers**: `trg_{acción}_{tabla}_{evento}` (ej. `trg_after_sale_detail_insert`)
- **Procedures**: `sp_{nombre}` (ej. `sp_sales_report`)
- **Functions**: `fn_{nombre}` (ej. `fn_cart_total`)
