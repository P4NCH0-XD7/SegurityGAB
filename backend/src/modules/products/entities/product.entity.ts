import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { SaleDetail } from '../../sales/entities/sale-detail.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    slug: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    sku: string;

    @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
    imageUrl: string;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive: boolean;

    @Column({ name: 'stock_level', type: 'int', default: 0 })
    stockLevel: number; // Stock actual cacheado para lectura rápida

    @Column({ name: 'category_id', type: 'int' })
    categoryId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relaciones
    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @OneToMany(() => CartItem, (cartItem) => cartItem.product)
    cartItems: CartItem[];

    @OneToMany(() => SaleDetail, (saleDetail) => saleDetail.product)
    saleDetails: SaleDetail[];

    @OneToMany(() => Inventory, (inventory) => inventory.product)
    inventoryMovements: Inventory[];

    @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
    wishlistInclusions: Wishlist[];
}
