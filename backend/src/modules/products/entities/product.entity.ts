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
    BeforeInsert,
    BeforeUpdate,
    DeleteDateColumn,
    Relation
} from 'typeorm';
import type { Category } from './category.entity';
import type { CartItem } from '../../cart/entities/cart-item.entity';
import type { SaleDetail } from '../../sales/entities/sale-detail.entity';
import type { Inventory } from '../../inventory/entities/inventory.entity';
import type { Wishlist } from '../../wishlist/entities/wishlist.entity';

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'varchar', length: 150, unique: true, nullable: true })
    slug: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
    sku: string;

    @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
    imageUrl: string;

    @Column({ type: 'enum', enum: ['visible', 'hidden'], default: 'visible' })
    status: string;

    @Column({ name: 'stock', type: 'int', default: 0 })
    stock: number; 

    @Column({ name: 'category_id', type: 'int', nullable: true })
    categoryId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        if (this.name) {
            this.slug = this.name
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '') // remove special characters
                .replace(/[\s_-]+/g, '-') // replace spaces, underscores, and dashes with a single dash
                .replace(/^-+|-+$/g, ''); // remove leading or trailing dashes
        }
    }

    // Relaciones
    @ManyToOne('Category', (category: Category) => category.products, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'category_id' })
    category!: Relation<Category>;

    @OneToMany('CartItem', (cartItem: CartItem) => cartItem.product)
    cartItems!: Relation<CartItem[]>;

    @OneToMany('SaleDetail', (saleDetail: SaleDetail) => saleDetail.product)
    saleDetails!: Relation<SaleDetail[]>;

    @OneToMany('Inventory', (inventory: Inventory) => inventory.product)
    inventoryMovements!: Relation<Inventory[]>;

    @OneToMany('Wishlist', (wishlist: Wishlist) => wishlist.product)
    wishlistInclusions!: Relation<Wishlist[]>;
}
