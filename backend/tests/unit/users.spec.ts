import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UsersService } from '../../src/modules/users/users.service';
import { User } from '../../src/modules/users/user_entity/user.entity';
import { testUsers } from '../fixtures/test-data';

// Mock bcrypt (UsersService uses bcrypt.hash)
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

describe('UsersService (unit)', () => {
  let service: UsersService;
  let repo: jest.Mocked<Partial<Repository<User>>>;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repo,
        },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
  });

  it('createUser(): hashea password y asigna role por defecto', async () => {
    // Arrange
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    (repo.create as jest.Mock).mockReturnValue({
      id: 1,
      name: testUsers.alice.name,
      email: testUsers.alice.email,
      password: 'hashed',
      role: 'user',
    });
    (repo.save as jest.Mock).mockImplementation(async (u) => u);

    // Act
    const created = await service.createUser({
      name: testUsers.alice.name,
      email: testUsers.alice.email,
      password: testUsers.alice.password,
    } as any);

    // Assert
    expect(bcrypt.hash).toHaveBeenCalledWith(testUsers.alice.password, 10);
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: testUsers.alice.name,
        email: testUsers.alice.email,
        password: 'hashed',
        role: 'user',
      }),
    );
    expect(created.role).toBe('user');
  });

  it('updateRole(): si el usuario no existe, lanza error', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.updateRole(123, 'admin')).rejects.toThrow('User not found');
  });

  it('updateRole(): actualiza el rol y persiste en repo.save()', async () => {
    const dbUser = { id: 1, role: 'user' } as any;
    (repo.findOne as jest.Mock).mockResolvedValue(dbUser);
    (repo.save as jest.Mock).mockImplementation(async (u) => u);

    const updated = await service.updateRole(1, 'admin');

    expect(updated.role).toBe('admin');
    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ id: 1, role: 'admin' }));
  });
});
