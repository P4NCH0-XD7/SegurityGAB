import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';

@Entity('cart_items')
export class CartItem {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  cart_id!: number;

  @Column()
  product_id!: number;

  @Column()
  quantity!: number;

  @Column({ type: 'timestamp' })
  created_at!: Date;

  @Column({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => Cart, cart => cart.items)
  @JoinColumn({ name: 'cart_id' })
  cart!: Cart;

}