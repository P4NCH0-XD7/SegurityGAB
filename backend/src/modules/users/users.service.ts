// ===========================================
// Users Service
// ===========================================
// Business logic for user management operations.

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
// import { UsersRepository } from './users.repository'; // Ya no usamos el genérico, usamos el de TypeORM

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    /**
     * Retrieves all users from the database.
     * @returns {Promise<User[]>} A list of all users.
     */
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    // async findById(id: number) {}
    // async findByEmail(email: string) {}
    // async create(createUserDto: CreateUserDto) {}
    // async update(id: number, updateUserDto: UpdateUserDto) {}
    // async updateProfile(userId: number, profileData: any) {}
    // async changePassword(userId: number, oldPassword: string, newPassword: string) {}
    // async deactivate(id: number) {}
}
