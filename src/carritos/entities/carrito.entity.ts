import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { DetalleCarrito } from '../../detalles-carrito/entities/detalles-carrito.entity';

@Entity('Carrito')
export class Carrito {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cliente_id: number;

  @OneToOne(() => Usuario, (usuario) => usuario.carrito)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Usuario;

  @OneToMany(() => DetalleCarrito, (detalle) => detalle.carrito)
  detalles: DetalleCarrito[];
}

