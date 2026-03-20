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
import { User } from '../../users/entities/user.entity';
import { SaleDetail } from './sale-detail.entity';

export enum SaleStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

@Entity({ name: 'sales' })
export class Sale {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ name: 'user_id', type: 'int' })
    userId: number;

    @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2 })
    totalAmount: number;

    @Column({ type: 'enum', enum: SaleStatus, default: SaleStatus.PENDING })
    status: SaleStatus;

    @Column({ name: 'shipping_address', type: 'text' })
    shippingAddress: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relaciones
    @ManyToOne(() => User, (user) => user.sales)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => SaleDetail, (detail) => detail.sale, { cascade: true })
    details: SaleDetail[];
}
