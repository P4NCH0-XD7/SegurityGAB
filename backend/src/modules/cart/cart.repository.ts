import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CartRepository {

  constructor(
    @InjectRepository(Cart)
    private readonly repository: Repository<Cart>,
  ) {}

  create(data: Partial<Cart>) {
    const cart = this.repository.create(data);
    return this.repository.save(cart);
  }

  findByUser(userId: number) {
    return this.repository.createQueryBuilder('cart')
      .where('cart.userId = :userId', { userId })
      .getMany();
  }

  remove(id: number) {
    return this.repository.delete(id);
  }

  clear(userId: number) {
    return this.repository.createQueryBuilder()
      .delete()
      .from(Cart)
      .where('userId = :userId', { userId })
      .execute();
  }

}