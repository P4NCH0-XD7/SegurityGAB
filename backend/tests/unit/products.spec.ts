import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ProductsService } from '../../src/modules/products/products.service';
import { Product } from '../../src/modules/products/products_entity/product_entity';
import { testProducts } from '../fixtures/test-data';

describe('ProductsService (unit)', () => {
  let service: ProductsService;
  let repo: jest.Mocked<Partial<Repository<Product>>>;

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
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: repo,
        },
      ],
    }).compile();

    service = moduleRef.get(ProductsService);
  });

  it('findOne(): si no existe -> NotFoundException', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.findOne(123)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('create(): persiste producto con repo.save()', async () => {
    (repo.save as jest.Mock).mockResolvedValue({ id: 1, ...testProducts.camera1 });

    const created = await service.create(testProducts.camera1 as any);

    expect(repo.save).toHaveBeenCalledWith(testProducts.camera1);
    expect(created).toEqual({ id: 1, ...testProducts.camera1 });
  });

  it('update(): llama repo.update() y luego devuelve findOne()', async () => {
    (repo.update as jest.Mock).mockResolvedValue({ affected: 1 });
    (repo.findOne as jest.Mock).mockResolvedValue({ id: 1, ...testProducts.camera1, name: 'Updated' });

    const updated = await service.update(1, { name: 'Updated' });

    expect(repo.update).toHaveBeenCalledWith(1, { name: 'Updated' });
    expect(updated.name).toBe('Updated');
  });
});
