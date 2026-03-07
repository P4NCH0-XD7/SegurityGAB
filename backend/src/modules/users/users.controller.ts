// ===========================================
// Users Controller
// ===========================================
// HTTP routes for user management:
// GET, POST, PUT, DELETE /users

import { Controller, Get } from '@nestjs/common'; // Agregado 'Get'
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    // La seguridad se añadirá en un paso posterior
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    async findAll() {
        return this.usersService.findAll();
    }

    // @Get(':id')
    // async findById(@Param('id') id: number) {}

    // @Post()
    // async create(@Body() createUserDto: CreateUserDto) {}

    // @Put(':id')
    // async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {}

    // @Delete(':id')
    // @Roles('admin')
    // async delete(@Param('id') id: number) {}

    // @Put(':id/profile')
    // async updateProfile(@Param('id') id: number, @Body() profileData: any) {}
}
