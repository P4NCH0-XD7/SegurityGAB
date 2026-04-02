import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from '../../products/entities/product.entity';

@Entity({ name: 'sale_details' })
export class SaleDetail {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'sale_id', type: 'int' })
    saleId!: number;

    @Column({ name: 'product_id', type: 'int' })
    productId!: number;

    @Column({ type: 'int' })
    quantity!: number;

    @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
    unitPrice!: number; // Precio congelado al momento de la venta

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    subtotal!: number; // quantity * unitPrice

    // Relaciones
    @ManyToOne(() => Sale, (sale) => sale.details, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sale_id' })
    sale!: Sale;

    @ManyToOne(() => Product, (product) => product.saleDetails)
    @JoinColumn({ name: 'product_id' })
    product!: Product;
}
