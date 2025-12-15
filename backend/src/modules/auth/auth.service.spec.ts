import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { findByEmail: jest.Mock };
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debe lanzar UnauthorizedException si el usuario no existe', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(service.login('noexiste@example.com', 'pass')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('debe lanzar UnauthorizedException si la contraseña es inválida', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      password: 'hashed',
      role: 'user',
    });

    (bcrypt.compare as unknown as jest.Mock).mockResolvedValue(false);

    await expect(service.login('user@example.com', 'badpass')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('debe retornar token y usuario cuando las credenciales son válidas', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      password: 'hashed',
      role: 'admin',
    });

    (bcrypt.compare as unknown as jest.Mock).mockResolvedValue(true);
    jwtService.sign.mockReturnValue('jwt-token');

    const result = await service.login('user@example.com', 'goodpass');

    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 1,
      email: 'user@example.com',
      role: 'admin',
    });

    expect(result).toEqual({
      message: 'Login successful',
      access_token: 'jwt-token',
      user: { id: 1, email: 'user@example.com', role: 'admin' },
    });
  });
});
