import { Controller, Get, Post, Body, Param, Delete, Put, UnauthorizedException, NotFoundException, Res } from '@nestjs/common';
import { UsersService } from './user.service';
import { AuthService } from './auth.service';
import { User } from './user.model';
import { CreateUserDto } from './create-user.dto';
import { Response } from 'express';
import { LoginDto } from './login.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService,) { }

  @Get()
  async getAll(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Post()
  async create(@Body() user: CreateUserDto, @Res() res: Response): Promise<void> {
    const createdUser: User = await this.usersService.createUser(user);
    const userWithoutMetadata = {
      id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    };
    res.status(201).json(userWithoutMetadata);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() user: User): Promise<User> {
    return this.usersService.updateUser(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

}
