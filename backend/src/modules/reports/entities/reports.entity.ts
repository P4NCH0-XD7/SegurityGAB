// ===========================================
// SegurityGAB — Report Entity (Modelo de respuesta)
// ===========================================
// Reports NO tiene tabla propia en la base de datos.
// Este módulo solo LEE datos de otras tablas (sales, products, inventory, users).
//
// Las clases aquí definen la forma de las respuestas del service,
// lo que permite tipar correctamente los datos que se retornan al frontend.

// Modelo de respuesta del dashboard 
export class DashboardReport {
  totalSales!: number;        // Cantidad de ventas confirmadas (PAID+SHIPPED+DELIVERED)
  totalRevenue!: number;      // Ingreso total de ventas confirmadas
  pendingSales!: number;      // Ventas en estado PENDING pendientes de atender
  totalUsers!: number;        // Usuarios activos registrados
  totalProducts!: number;     // Productos visibles en el catálogo
  outOfStock!: number;        // Productos con stock = 0
  lowStock!: number;          // Productos con stock entre 1 y 9
  recentSales!: RecentSaleItem[];  // Últimas 5 ventas
}

export class RecentSaleItem {
  id!: number;
  userId!: number;
  totalAmount!: number;
  status!: string;
  createdAt!: Date;
  user?: {
    id?: number;
    name?: string;
    email?: string;
  };
}

//  Modelo de respuesta del reporte de ventas 
export class SalesReport {
  summary!: SalesSummary;
  byStatus!: SalesByStatus[];
  topProducts!: TopProduct[];
  byMonth!: SalesByMonth[];
}

export class SalesSummary {
  totalOrders!: number;    // Total de órdenes (excluyendo canceladas)
  totalRevenue!: number;   // Ingreso total
  averageOrder!: number;   // Ticket promedio por venta
}

export class SalesByStatus {
  status!: string;   // PENDING | PAID | SHIPPED | DELIVERED | CANCELLED
  count!: number;    // Cantidad de ventas en ese estado
  total!: number;    // Monto total de ventas en ese estado
}

export class TopProduct {
  productId!: number;
  productName!: string;
  totalQuantity!: number;  // Unidades vendidas en total
  totalRevenue!: number;   // Ingresos generados por este producto
}

export class SalesByMonth {
  month!: string;    // Formato: 'YYYY-MM'
  count!: number;    // Cantidad de ventas en ese mes
  total!: number;    // Monto total de ventas en ese mes
}

//  Modelo de respuesta del reporte de inventario 
export class InventoryReport {
  summary!: InventorySummary;
  outOfStockProducts!: StockAlertItem[];
  lowStockProducts!: StockAlertItem[];
  recentMovements!: InventoryMovementItem[];
  movementsSummary!: MovementSummary[];
}

export class InventorySummary {
  outOfStockCount!: number;  // Cantidad de productos sin stock
  lowStockCount!: number;    // Cantidad de productos con stock bajo
}

export class StockAlertItem {
  id!: number;
  name!: string;
  sku!: string | null;
  stock!: number;
  category!: string | null;
}

export class InventoryMovementItem {
  id!: number;
  productId!: number;
  type!: string;        // IN | OUT | ADJUSTMENT
  quantity!: number;
  reason!: string | null;
  referenceId!: number | null;
  createdAt!: Date;
  product?: {
    id?: number;
    name?: string;
    sku?: string | null;
  };
}

export class MovementSummary {
  type!: string;          // IN | OUT | ADJUSTMENT
  count!: number;         // Cantidad de movimientos de ese tipo
  totalQuantity!: number; // Suma de unidades movidas
}

