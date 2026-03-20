import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(Role)
        private readonly role_repository: Repository<Role>,
    ) {}

    // 🔥 SE EJECUTA AUTOMÁTICAMENTE AL INICIAR EL SISTEMA
    async onApplicationBootstrap() {
        await this.seed_roles();
    }

    // 🌱 FUNCIÓN QUE CREA LOS ROLES SI NO EXISTEN
    async seed_roles() {
        const default_roles = ['ADMIN', 'VENDEDOR', 'CLIENTE'];

        for (const role_name of default_roles) {
            const exists = await this.role_repository.findOne({
                where: { name: role_name },
            });

            if (!exists) {
                const role = this.role_repository.create({
                    name: role_name,
                });

                await this.role_repository.save(role);
            }
        }
    }
}