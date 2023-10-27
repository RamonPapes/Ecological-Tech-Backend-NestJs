import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { CreateUserDto } from './create-user.dto';
import * as bcrypt from 'bcrypt';
import { WordSearchGameDto } from 'games/word-search-game/word-search-game.dto';
import { WordSearchGameModel } from 'games/word-search-game/word-search-game.model';
import { MemoryGameDto } from 'games/memory-game/memory-game.dto';
import { MemoryGameModel } from 'games/memory-game/memory-game.model';
import { Types } from 'mongoose';
import { PuzzleGameDto } from 'games/puzzle-game/puzzle-game.dto';
import { PuzzleGameModel } from 'games/puzzle-game/puzzle-game.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().lean();
  }

  async getUserById(id: string): Promise<User> {
    return this.userModel.findById(id).lean();
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).lean();
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userDto } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ ...userDto, password: hashedPassword });
    return newUser.save();
  }

  async updateUser(id: string, user: User): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, user, { new: true }).lean();
  }

  async deleteUser(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).lean();
  }

  async createWordSearchGame(userId: string, gameDto: WordSearchGameDto): Promise<User> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const wordSearchGame = new WordSearchGameModel({
      time: gameDto.time,
      erros: gameDto.erros,
    });

    const hasWordSearchGame = user.wordSearchGames.some((wordSearchGame) => {
      return wordSearchGame.time === gameDto.time && wordSearchGame.erros === gameDto.erros;
    })

    if (!hasWordSearchGame) {
      const achievement = {
        name: 'cacaPalavras',
        date: new Date()
      }
      user.achievements.push(achievement);
    }

    user.wordSearchGames.push(wordSearchGame);

    await user.save();

    return user;

  }

  async createMemoryGame(userId: string, gameDto: MemoryGameDto): Promise<User> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('ID de usuário inválido');
    }

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verifique se o usuário não tem nenhum outro jogo da memória na lista
    const hasMemoryGame = user.memoryGames.some((memoryGame) => {
      return memoryGame.time === gameDto.time && memoryGame.erros === gameDto.erros;
    });

    if (!hasMemoryGame) {
      // Adicione a conquista 'jogoMemoria' se o usuário não tiver nenhum outro jogo da memória
      const achievement = {
        name: 'jogoMemoria',
        date: new Date()
      }
      user.achievements.push(achievement);
    }

    const MemoryGame = new MemoryGameModel({
      time: gameDto.time,
      erros: gameDto.erros,
    });

    user.memoryGames.push(MemoryGame);

    await user.save();

    return user;
  }

  async createPuzzleGame(userId: string, gameDto: PuzzleGameDto): Promise<User> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('ID de usuário inválido');
    }

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verifique se o usuário não tem nenhum outro jogo da memória na lista
    const hasPuzzleGame = user.puzzleGames.some((puzzleGame) => {
      return puzzleGame.turns === gameDto.turns;
    });

    if (!hasPuzzleGame) {
      const achievement = {
        name: 'quebraCabeca',
        date: new Date()
      }
      user.achievements.push(achievement);
    }

    const PuzzleGame = new PuzzleGameModel({
      turns: gameDto.turns
    });

    user.puzzleGames.push(PuzzleGame);

    await user.save();

    return user;
  }

  async getAllPuzzleGamesByUserId(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user.puzzleGames;
  }

  async getPuzzleGameById(userId: string, gameId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const game = user.puzzleGames.find((game) => game.id === gameId);

    if (!game) {
      throw new NotFoundException('Jogo de caça-palavras não encontrado');
    }

    return game;
  }

  async getAllWordSearchGamesByUserId(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user.wordSearchGames;
  }

  async getWordSearchGameById(userId: string, gameId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const game = user.wordSearchGames.find((game) => game.id === gameId);

    if (!game) {
      throw new NotFoundException('Jogo de caça-palavras não encontrado');
    }

    return game;
  }

  async getAllMemoryGameByUserId(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user.memoryGames;
  }

  async getMemoryGameById(userId: string, gameId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const game = user.wordSearchGames.find((game) => game.id === gameId);

    if (!game) {
      throw new NotFoundException('Jogo de caça-palavras não encontrado');
    }

    return game;
  }

  private userHasAchievement(user: User, achievementName: string): boolean {
    return user.achievements.some((achievement) => achievement.name === achievementName);
  }

}
