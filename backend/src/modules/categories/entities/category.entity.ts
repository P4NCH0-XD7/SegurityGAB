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
import type { Product } from '../../products/entities/product.entity';

@Entity({ name: 'categories' })
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'parent_id', type: 'int', nullable: true })
    parentId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relaciones
    @ManyToOne('Category', (category: Category) => category.children)
    @JoinColumn({ name: 'parent_id' })
    parent!: Relation<Category>;

    @OneToMany('Category', (category: Category) => category.parent)
    children!: Relation<Category[]>;

    @OneToMany('Product', (product: Product) => product.category)
    products!: Relation<Product[]>;
}
