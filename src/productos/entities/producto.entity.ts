import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { DetalleCarrito } from '../../detalles-carrito/entities/detalles-carrito.entity';
import { ListaDeseos } from '../../listas-deseos/entities/listas-deseo.entity';

@Entity('Producto')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column({ default: 0 })
  stock: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  precio: number;

  @Column({ length: 255, nullable: true })
  imagen_url: string;

  @Column({
    type: 'enum',
    enum: ['visible', 'oculto'],
    default: 'visible',
  })
  estado: string;

  @Column()
  categoria_id: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @OneToMany(() => DetalleCarrito, (detalle) => detalle.producto)
  detallesCarrito: DetalleCarrito[];

  @OneToMany(() => ListaDeseos, (lista) => lista.producto)
  listasDeseos: ListaDeseos[];
}

