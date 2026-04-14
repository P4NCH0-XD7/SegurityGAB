import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Relation,
} from 'typeorm';
import type { Cart } from './cart.entity';
import type { Product } from '../../products/entities/product.entity';

@Entity({ name: 'cart_items' })
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'cart_id', type: 'int' })
    cartId: number;

    @Column({ name: 'product_id', type: 'int' })
    productId: number;

    @Column({ type: 'int', default: 1 })
    quantity: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relaciones
    @ManyToOne('Cart', (cart: Cart) => cart.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cart_id' })
    cart!: Relation<Cart>;

    @ManyToOne('Product', (product: Product) => product.cartItems)
    @JoinColumn({ name: 'product_id' })
    product!: Relation<Product>;
}
