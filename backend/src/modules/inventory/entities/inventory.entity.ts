import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

export enum InventoryType {
    IN = 'IN',
    OUT = 'OUT',
    ADJUSTMENT = 'ADJUSTMENT'
}

@Entity({ name: 'inventory_movements' })
export class Inventory {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column({ name: 'product_id', type: 'int' })
    productId: number | undefined;

    @Column({ type: 'enum', enum: InventoryType })
    type: InventoryType | undefined;

    @Column({ type: 'int' })
    quantity: number | undefined; // Siempre positivo, el tipo define si suma o resta

    @Column({ type: 'varchar', length: 255, nullable: true })
    reason: string | undefined; // Ej: "Venta #123", "Reabastecimiento", "Merma"

    @Column({ name: 'reference_id', type: 'int', nullable: true })
    referenceId: number | undefined; // ID de la Venta o Compra asociada

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date | undefined;

    // Relaciones
    @ManyToOne(() => Product, (product) => product.inventoryMovements)
    @JoinColumn({ name: 'product_id' })
    product: Product | undefined;
}
