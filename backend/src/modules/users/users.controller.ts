// ===========================================
// Users Controller
// ===========================================
// HTTP routes for user management:
// GET, POST, PUT, DELETE /users

import { Controller } from '@nestjs/common';
// import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    // constructor(private readonly usersService: UsersService) {}

    // @Get()
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    // async findAll() {}

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
