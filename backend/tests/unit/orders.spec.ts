import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { OrdersService } from '../../src/modules/orders/orders.service';
import { Order } from '../../src/modules/orders/orders_entity/order.entity';
import { testOrders } from '../fixtures/test-data';

describe('OrdersService (unit)', () => {
  let service: OrdersService;
  let repo: jest.Mocked<Partial<Repository<Order>>>;

  beforeEach(async () => {
    repo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: repo,
        },
      ],
    }).compile();

    service = moduleRef.get(OrdersService);
  });

  it('create(): guarda una orden con repo.save()', async () => {
    (repo.save as jest.Mock).mockResolvedValue({ id: 1, ...testOrders.order1 });

    const created = await service.create(testOrders.order1);

    expect(repo.save).toHaveBeenCalled();
    expect(created).toEqual({ id: 1, ...testOrders.order1 });
  });

  it('findOne(): si no existe -> NotFoundException', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('update(): actualiza y devuelve la entidad final', async () => {
    (repo.update as jest.Mock).mockResolvedValue({ affected: 1 });
    (repo.findOne as jest.Mock).mockResolvedValue({ id: 1, ...testOrders.order1, status: 'paid' });

    const updated = await service.update(1, { status: 'paid' });

    expect(repo.update).toHaveBeenCalledWith(1, { status: 'paid' });
    expect(updated.status).toBe('paid');
  });
});
