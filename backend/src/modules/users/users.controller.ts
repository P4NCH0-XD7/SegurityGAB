import { Controller, Get, Post, Body, HttpStatus, HttpCode, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Req() req: any) {
        return this.usersService.findById(req.user.id);
    }

    @Patch('profile')
    @UseGuards(AuthGuard('jwt'))
    async updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateUserDto) {
        return this.usersService.update(req.user.id, updateProfileDto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(1) // Admin only
    async findAll() {
        return this.usersService.findAll();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(1) // Admin only
    async findById(@Param('id') id: number) {
        return this.usersService.findById(+id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(1) // Admin only
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(1) // Admin only
    async remove(@Param('id') id: number) {
        await this.usersService.remove(+id);
    }
}
