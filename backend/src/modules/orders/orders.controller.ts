import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './orders_entity/order.entity';

/**
 * Orders endpoints.
 * NOTE: Currently unauthenticated (mirrors Products CRUD behavior) to keep tests simple. */
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Post()
  create(@Body() order: Partial<Order>): Promise<Order> {
    return this.ordersService.create(order);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() patch: Partial<Order>): Promise<Order> {
    return this.ordersService.update(id, patch);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ ok: true }> {
    await this.ordersService.remove(id);
    return { ok: true };
  }
}
