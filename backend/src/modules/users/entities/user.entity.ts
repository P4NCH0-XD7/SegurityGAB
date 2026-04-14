import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import type { Cart } from '../../cart/entities/cart.entity';
import type { Sale } from '../../sales/entities/sale.entity';
import type { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'avatar_url', type: 'varchar', length: 500, nullable: true })
  avatarUrl: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ name: 'failed_attempts', type: 'int', default: 0 })
  failedAttempts: number;

  @Column({ name: 'locked_until', type: 'datetime', nullable: true })
  lockedUntil: Date;

  @Column({ name: 'last_login', type: 'datetime', nullable: true })
  lastLogin: Date;

  @Column({ name: 'reset_token', type: 'varchar', length: 255, nullable: true })
  resetToken: string;

  @Column({ name: 'reset_token_expires', type: 'datetime', nullable: true })
  resetTokenExpires: Date;

  // 🔥 MANTIENES EL ID (para no romper nada)
  @Column({ name: 'role_id', type: 'int' })
  roleId: number;

  // 🔥 RELACIÓN (para futuro y consultas)
  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // Relaciones
  @OneToMany('Cart', (cart: Cart) => cart.user)
  carts: Relation<Cart[]>;

  @OneToMany('Sale', (sale: Sale) => sale.user)
  sales: Relation<Sale[]>;

  @OneToMany('Wishlist', (wishlist: Wishlist) => wishlist.user)
  wishlistItems: Relation<Wishlist[]>;
}