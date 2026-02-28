import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('ListaDeseos')
export class ListaDeseos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cliente_id: number;

  @Column()
  producto_id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.listaDeseos)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Usuario;

  @ManyToOne(() => Producto, (producto) => producto.listasDeseos)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;
}

