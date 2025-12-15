import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    console.log('Login attempt for email:', email);
    const user = await this.usersService.findByEmail(email);
    console.log('User found (or null):', user ? user.email : 'null');
    if (!user)
      throw new UnauthorizedException('Usuario o contraseña inválidos');

    console.log('Comparing provided password (first 5 chars):', password.substring(0,5), 'with stored hash (first 5 chars):', user.password.substring(0,5));
    const valid = await bcrypt.compare(password, user.password);
    console.log('Password comparison result (valid):', valid);
    if (!valid)
      throw new UnauthorizedException('Usuario o contraseña inválidos|');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      access_token: token,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await this.usersService.createUser({
      ...userData,
      password: hashedPassword,
    });

    // No devolver la contraseña en la respuesta
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}
