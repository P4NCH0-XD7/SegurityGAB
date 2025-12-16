import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Minimal Order entity.
 * - Intentionally simple: enough to support CRUD + load tests.
 * - `items` is stored as a JSON string to avoid extra relational tables.
 */
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  customerEmail: string;

  @Column({ default: 'created' })
  status: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;

  /** JSON string (e.g. [{productId, quantity, price}, ...]) */
  @Column({ type: 'text', nullable: true })
  items: string;
}
