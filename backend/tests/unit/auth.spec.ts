import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '../../src/modules/auth/auth.service';
import { UsersService } from '../../src/modules/users/users.service';
import { testUsers } from '../fixtures/test-data';

// Mock bcrypt (AuthService uses bcrypt.compare)
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

describe('AuthService (unit)', () => {
  let authService: AuthService;
  let usersService: { findByEmail: jest.Mock; createUser: jest.Mock };
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
  });

  it('login(): credenciales válidas -> retorna token + user', async () => {
    // Arrange
    const dbUser = {
      id: 1,
      name: testUsers.alice.name,
      email: testUsers.alice.email,
      role: 'user',
      password: 'hashed',
    };

    usersService.findByEmail.mockResolvedValue(dbUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.sign.mockReturnValue('jwt-token');

    // Act
    const res = await authService.login(testUsers.alice.email, testUsers.alice.password);

    // Assert
    expect(usersService.findByEmail).toHaveBeenCalledWith(testUsers.alice.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(testUsers.alice.password, 'hashed');
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
    });

    expect(res).toEqual({
      message: 'Login successful',
      access_token: 'jwt-token',
      user: { id: 1, email: testUsers.alice.email, role: 'user' },
    });
  });

  it('register(): no expone password (caja negra de salida)', async () => {
    // Arrange
    usersService.createUser.mockResolvedValue({
      id: 99,
      name: testUsers.alice.name,
      email: testUsers.alice.email,
      role: 'user',
      password: 'hashed',
    });

    // Act
    const res = await authService.register({
      name: testUsers.alice.name,
      email: testUsers.alice.email,
      password: testUsers.alice.password,
    } as any);

    // Assert
    expect(res).toEqual({
      id: 99,
      name: testUsers.alice.name,
      email: testUsers.alice.email,
      role: 'user',
    });
    expect((res as any).password).toBeUndefined();
  });

  it('login(): usuario inexistente -> UnauthorizedException', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(authService.login('missing@example.com', 'x')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
