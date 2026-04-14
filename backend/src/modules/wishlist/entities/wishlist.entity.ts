import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
    Relation,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity';
import type { Product } from '../../products/entities/product.entity';

@Entity({ name: 'wishlists' })
@Unique(['userId', 'productId']) // Evitar duplicados del mismo producto para un usuario
export class Wishlist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id', type: 'int' })
    userId: number;

    @Column({ name: 'product_id', type: 'int' })
    productId: number;

    @CreateDateColumn({ name: 'added_at' })
    addedAt: Date;

    // Relaciones
    @ManyToOne('User', (user: User) => user.wishlistItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: Relation<User>;

    @ManyToOne('Product', (product: Product) => product.wishlistInclusions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product!: Relation<Product>;
}
