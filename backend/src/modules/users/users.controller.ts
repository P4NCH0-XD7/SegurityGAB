import { Controller, Get, Post, Body, HttpStatus, HttpCode, Param, Patch, Delete } from '@nestjs/common'; // Agregado Delete
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED) //asegura que la respuesta tenga el codigo 201 en lugar de 200
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get(':id')
    async findById(@Param('id') id: number) {
        return this.usersService.findById(+id); //+id convierte el string a número
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content para indicar eliminación exitosa sin contenido
    async remove(@Param('id') id: number) {
        await this.usersService.remove(+id);
    }

    // @Put(':id/profile')
    // async updateProfile(@Param('id') id: number, @Body() profileData: any) {}
}
