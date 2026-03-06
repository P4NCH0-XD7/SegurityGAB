// ===========================================
// Users Repository
// ===========================================
// Data access layer for user-related database operations.
// Abstracts TypeORM queries from the service layer.

import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersRepository {
    // constructor(
    //   @InjectRepository(UserEntity)
    //   private readonly userRepo: Repository<UserEntity>,
    // ) {}

    // async findAll(): Promise<UserEntity[]> {}
    // async findById(id: number): Promise<UserEntity | null> {}
    // async findByEmail(email: string): Promise<UserEntity | null> {}
    // async create(userData: Partial<UserEntity>): Promise<UserEntity> {}
    // async update(id: number, userData: Partial<UserEntity>): Promise<UserEntity> {}
    // async delete(id: number): Promise<void> {}
}
