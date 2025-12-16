import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './orders_entity/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return order;
  }

  create(order: Partial<Order>): Promise<Order> {
    // Keep controller payload flexible for black-box + load tests.
    return this.ordersRepository.save(order as Order);
  }

  async update(id: number, patch: Partial<Order>): Promise<Order> {
    await this.ordersRepository.update(id, patch);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.ordersRepository.delete(id);
  }
}
