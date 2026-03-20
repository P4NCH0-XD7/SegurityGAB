import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

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
    @ManyToOne(() => User, (user) => user.wishlistItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Product, (product) => product.wishlistInclusions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;
}
