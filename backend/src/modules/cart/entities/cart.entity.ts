import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @Column({ type: 'timestamp' })
  created_at!: Date;

  @Column({ type: 'timestamp' })
  updated_at!: Date;

  @OneToMany(() => CartItem, item => item.cart)
  items: CartItem[];

}