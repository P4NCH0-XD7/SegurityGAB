import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Carrito } from '../../carritos/entities/carrito.entity';
import { ListaDeseos } from '../../listas-deseos/entities/listas-deseo.entity';
import { Venta } from '../../ventas/entities/venta.entity';
import { JustificacionAnulacion } from '../../justificaciones-anulacion/entities/justificaciones-anulacion.entity';

@Entity('Usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  nombre: string;

  @Column({ length: 150, unique: true, nullable: false })
  correo: string;

  @Column({ length: 255, nullable: false })
  password_hash: string;

  @Column({ type: 'enum', enum: ['Admin', 'Cliente'], nullable: false })
  rol: string;

  @Column({ default: 0 })
  intentos_fallidos: number;

  @Column({ type: 'datetime', nullable: true })
  fecha_bloqueo: Date;

  @OneToOne(() => Carrito, (carrito) => carrito.cliente)
  carrito: Carrito;

  @OneToMany(() => ListaDeseos, (listaDeseos) => listaDeseos.cliente)
  listaDeseos: ListaDeseos[];

  @OneToMany(() => Venta, (venta) => venta.cliente)
  ventas: Venta[];

  @OneToMany(
    () => JustificacionAnulacion,
    (justificacion) => justificacion.admin,
  )
  justificacionesAnulacion: JustificacionAnulacion[];
}

