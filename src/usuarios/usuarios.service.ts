import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.password_hash, 10);
    const usuario = this.usuariosRepository.create({
      ...createUsuarioDto,
      password_hash: hashedPassword,
    });
    return this.usuariosRepository.save(usuario);
  }

  findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find();
  }

  findOne(id: number): Promise<Usuario> {
    return this.usuariosRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      return undefined;
    }
    if (updateUsuarioDto.password_hash) {
      updateUsuarioDto.password_hash = await bcrypt.hash(updateUsuarioDto.password_hash, 10);
    }
    this.usuariosRepository.merge(usuario, updateUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    await this.usuariosRepository.delete(id);
  }
}

