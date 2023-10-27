import { Controller, Get, Post, Body, Param, Delete, Put, UnauthorizedException, NotFoundException, Res } from '@nestjs/common';
import { UsersService } from './user.service';
import { AuthService } from './auth.service';
import { User } from './user.model';
import { CreateUserDto } from './create-user.dto';
import { Response } from 'express';
import { LoginDto } from './login.dto';
import { WordSearchGameDto } from 'games/word-search-game/word-search-game.dto';
import { MemoryGame } from 'games/memory-game/memory-game.model';
import { PuzzleGameDto } from 'games/puzzle-game/puzzle-game.dto';
import { MemoryGameDto } from 'games/memory-game/memory-game.dto';

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

  @Get(':userId/word-search-games')
  getAllWordSearchGamesByUserId(@Param('userId') userId: string) {
    return this.usersService.getAllWordSearchGamesByUserId(userId);
  }

  @Get(':userId/word-search-games/:gameId')
  getWordSearchGameById(
    @Param('userId') userId: string,
    @Param('gameId') gameId: string,
  ) {
    return this.usersService.getWordSearchGameById(userId, gameId);
  }

  @Get(':userId/memory-games')
  getAllMemoryGamesByUserId(@Param('userId') userId: string) {
    return this.usersService.getAllMemoryGameByUserId(userId);
  }

  @Get(':userId/memory-games/:gameId')
  getMemoryGameById(
    @Param('userId') userId: string,
    @Param('gameId') gameId: string,
  ) {
    return this.usersService.getMemoryGameById(userId, gameId);
  }

  @Get(':userId/memory-games')
  getAllPuzzleGamesByUserId(@Param('userId') userId: string) {
    return this.usersService.getAllPuzzleGamesByUserId(userId);
  }

  @Get(':userId/puzzle-game/:gameId')
  getPuzzleGameById(
    @Param('userId') userId: string,
    @Param('gameId') gameId: string,
  ) {
    return this.usersService.getPuzzleGameById(userId, gameId);
  }

  @Post()
  async create(@Body() user: CreateUserDto, @Res() res: Response): Promise<void> {
    const createdUser: User = await this.usersService.createUser(user);
    const userWithoutMetadata = {
      id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
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

    const userId = await this.authService.login(email, password);

    if (userId) {
      return userId;
    } else {
      throw new UnauthorizedException('Invalid Credentials')
    }

  }

  @Post(':userId/word-search-games')
  async createWordSearchGame(
    @Param('userId') userId: string,
    @Body() gameDto: WordSearchGameDto,
  ) {
    return await this.usersService.createWordSearchGame(userId, gameDto);
  }

  @Post(':userId/memory-games')
  async createMemoryGame(
    @Param('userId') userId: string,
    @Body() gameDto: MemoryGameDto,
  ) {
    return await this.usersService.createMemoryGame(userId, gameDto);
  }

  @Post(':userId/puzzle-games')
  async createPuzzleGame(
    @Param('userId') userId: string,
    @Body() gameDto: PuzzleGameDto,
  ) {
    return await this.usersService.createPuzzleGame(userId, gameDto);
  }

}
