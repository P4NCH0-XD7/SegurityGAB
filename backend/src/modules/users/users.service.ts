import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user_entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const { role, password, ...rest } = dto;
    console.log('createUser: Received plain password (first 5 chars):', password.substring(0,5));
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('createUser: Generated hash (first 5 chars):', hashedPassword.substring(0,5));

    const user = this.usersRepository.create({
      ...rest,
      password: hashedPassword,
      role: role ?? 'user', // si no envían role, se asigna "user"
    });
    console.log('createUser: Saving user with hash (first 5 chars):', hashedPassword.substring(0,5));

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async updateRole(id: number, role: 'user' | 'admin'): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new Error('User not found');
    user.role = role;
    return this.usersRepository.save(user);
  }
}
