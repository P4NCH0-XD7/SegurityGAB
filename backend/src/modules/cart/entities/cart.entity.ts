import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Relation,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity';
import type { CartItem } from './cart-item.entity';

@Entity({ name: 'carts' })
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id', type: 'int', nullable: true })
    userId: number; // Nullable para permitir carritos de invitados si fuera necesario

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive: boolean; // false cuando se convierte en venta

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relaciones
    @ManyToOne('User', (user: User) => user.carts)
    @JoinColumn({ name: 'user_id' })
    user!: Relation<User>;

    @OneToMany('CartItem', (item: CartItem) => item.cart, { cascade: true })
    items!: Relation<CartItem[]>;
}
