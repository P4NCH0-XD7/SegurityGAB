import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto'; // Agregado UpdateUserDto
// import { UsersRepository } from './users.repository'; // Ya no usamos el genérico, usamos el de TypeORM

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async create(createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
        const { name, email, password, phone, roleId, isActive } = createUserDto;

        //Verificar si el email ya existe
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('El email ya está registrado.');
        }

        //Hashear la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //Crear y guardar el nuevo usuario
        const newUser = this.userRepository.create({
            name,
            email,
            passwordHash: hashedPassword,
            phone,
            roleId: roleId || 2, //Asignamos un rol por defecto si no se proporciona. Ej: 1=admin, 2=cliente
            isActive: isActive !== undefined ? isActive : true,
        });

        await this.userRepository.save(newUser);

        //Devolver el usuario creado SIN la contraseña
        const { passwordHash, ...result } = newUser;
        return result;
    }

    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
        }
        return user;
    }

    /**
     * Updates an existing user in the database.
     * @param {number} id - The ID of the user to update.
     * @param {UpdateUserDto} updateUserDto - The data to update the user with.
     * @returns {Promise<Omit<User, 'passwordHash'>>} The updated user, without the password hash.
     * @throws {NotFoundException} If the user with the specified ID is not found.
     * @throws {ConflictException} If the email is being updated to an already existing one.
     */
    async update(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'passwordHash'>> {
        // Find the user first to ensure it exists
        const userToUpdate = await this.userRepository.findOneBy({ id });
        if (!userToUpdate) {
            throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
        }

        // Handle email update: check for conflicts if email is being changed
        if (updateUserDto.email && updateUserDto.email !== userToUpdate.email) {
            const existingUserWithEmail = await this.userRepository.findOne({
                where: { email: updateUserDto.email },
            });
            if (existingUserWithEmail && existingUserWithEmail.id !== id) {
                throw new ConflictException('El nuevo email ya está registrado por otro usuario.');
            }
        }

        // Hash password if provided
        if (updateUserDto.password) {
            const saltRounds = 10;
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
            // Assign to passwordHash in the entity
            userToUpdate.passwordHash = updateUserDto.password;
            delete updateUserDto.password; // Remove from DTO to prevent direct assignment
        }

        // Merge new data into the existing user entity
        const updatedUser = this.userRepository.merge(userToUpdate, updateUserDto);

        // Save the updated user
        await this.userRepository.save(updatedUser);

        // Return the updated user without the password hash
        const { passwordHash, ...result } = updatedUser;
        return result;
    }

    /**
     * Removes a user from the database.
     * @param {number} id - The ID of the user to remove.
     * @returns {Promise<void>}
     * @throws {NotFoundException} If the user with the specified ID is not found.
     */
    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async remove(id: number): Promise<void> {
        const userToRemove = await this.findById(id); // Reutiliza findById para verificar existencia y lanzar excepción
        await this.userRepository.remove(userToRemove);
    }
    // async findByEmail(email: string) {}
    // async updateProfile(userId: number, profileData: any) {}
    // async changePassword(userId: number, oldPassword: string, newPassword: string) {}
    // async deactivate(id: number) {}
}
