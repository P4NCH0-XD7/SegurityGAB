// ===========================================
// Customer Service
// ===========================================
// Business logic for customers management.

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({ relations: ['user'] });
  }

  async findById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!customer) {
      throw new NotFoundException(`Cliente con ID "${id}" no encontrado.`);
    }
    return customer;
  }

  // Busca el perfil de cliente por userId (usado en GET /customers/me)
  async findByUserId(userId: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!customer) {
      throw new NotFoundException(
        `No tienes un perfil de cliente aún. Puedes crearlo con POST /customers.`,
      );
    }
    return customer;
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Verificar si ya existe un cliente para ese usuario
    const existingCustomer = await this.customerRepository.findOne({
      where: { userId: createCustomerDto.userId },
    });
    if (existingCustomer) {
      throw new ConflictException('Este usuario ya tiene un perfil de cliente asociado.');
    }

    const newCustomer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(newCustomer);
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findById(id);
    const updatedCustomer = this.customerRepository.merge(customer, updateCustomerDto);
    return this.customerRepository.save(updatedCustomer);
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findById(id);
    await this.customerRepository.remove(customer);
  }
}
