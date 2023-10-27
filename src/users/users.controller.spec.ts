import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import mongoose, { Connection, Model, Types, connect } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User, UserSchema } from './user.model';
import { getModelToken } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


describe('UsersController', () => {
    let usersController: UsersController;
    let usersService: UsersService;
    let authService: AuthService;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let userModel: Model<User>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        userModel = mongoConnection.model('User', UserSchema);
        const module: TestingModule = await Test.createTestingModule({
            imports: [JwtModule],
            controllers: [UsersController],
            providers: [
                UsersService,
                AuthService,
                {
                    provide: getModelToken('User'),
                    useValue: userModel,
                }
            ],
        }).compile();

        usersController = module.get<UsersController>(UsersController);
        usersService = module.get<UsersService>(UsersService);
        authService = module.get<AuthService>(AuthService);

    })
    describe('findAll', () => {
        it('deve retornar uma lista de usuários', async () => {
            // Mock the necessary dependencies and set up your test
            const usersList: any[] = [
                {
                    _id: 'user_id_1',
                    name: 'User 1',
                    email: 'user1@example.com',
                    password: 'password1',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    achievements: [
                        { name: 'Achievement 1', date: new Date() },
                        { name: 'Achievement 2', date: new Date() },
                    ],
                    memoryGames: [
                        { _id: 'game_id_1', time: 60, erros: 2 },
                        { _id: 'game_id_2', time: 45, erros: 1 },
                    ],
                    wordSearchGames: [
                        { _id: 'game_id_3', time: 75, erros: 3 },
                        { _id: 'game_id_4', time: 90, erros: 0 },
                    ],
                },
                {
                    _id: 'user_id_2',
                    name: 'User 2',
                    email: 'user2@example.com',
                    password: 'password2',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    achievements: [
                        { name: 'Achievement 3', date: new Date() },
                    ],
                    memoryGames: [
                        { _id: 'game_id_5', time: 80, erros: 4 },
                    ],
                    wordSearchGames: [],
                },
            ];

            await jest.spyOn(usersService, 'getAllUsers').mockResolvedValue(usersList);

            // Execute the controller method
            const result = await usersController.getAll();

            // Verify the result and expectations
            expect(result).toEqual(usersList);
            expect(usersService.getAllUsers).toHaveBeenCalled();
        });
    });
    describe('getById', () => {
        it('deve retornar um usuário por ID', async () => {
            const userId = 'user_id';
            const user: any = {
                _id: 'user_id_1',
                name: 'User 1',
                email: 'user1@example.com',
                password: 'password1',
                createdAt: new Date(),
                updatedAt: new Date(),
                achievements: [
                    { name: 'Achievement 1', date: new Date() },
                    { name: 'Achievement 2', date: new Date() },
                ],
                memoryGames: [
                    { _id: 'game_id_1', time: 60, erros: 2 },
                    { _id: 'game_id_2', time: 45, erros: 1 },
                ],
                wordSearchGames: [
                    { _id: 'game_id_3', time: 75, erros: 3 },
                    { _id: 'game_id_4', time: 90, erros: 0 },
                ],
            };

            jest.spyOn(usersService, 'getUserById').mockResolvedValue(user);

            const result = await usersController.getById(userId);

            expect(result).toEqual(user);
            expect(usersService.getUserById).toHaveBeenCalledWith(userId);
        });

        it('deve lançar NotFoundException para usuário inexistente', async () => {
            const userId = 'non_existent_id';

            jest.spyOn(usersService, 'getUserById').mockResolvedValue(null);

            try {
                await usersController.getById(userId);
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
                expect(e.message).toBe('User not found');
            }
        });
    });

    describe('getAllWordSearchGamesByUserId', () => {
        it('deve retornar uma lista de jogos de Caça-Palavras para um usuário', async () => {
            const userId = 'user_id';
            const wordSearchGames: any[] = [
                {
                    time: 60, // Exemplo de tempo em segundos
                    erros: 2,  // Exemplo de erros na partida
                },
                {
                    time: 31, // Exemplo de tempo em segundos
                    erros: 5,  // Exemplo de erros na partida
                },
            ];

            jest.spyOn(usersService, 'getAllWordSearchGamesByUserId').mockResolvedValue(wordSearchGames);

            const result = await usersController.getAllWordSearchGamesByUserId(userId);

            expect(result).toEqual(wordSearchGames);
            expect(usersService.getAllWordSearchGamesByUserId).toHaveBeenCalledWith(userId);
        });
    });

    describe('getWordSearchGameById', () => {
        it('deve retornar um jogo de Caça-Palavras por usuário e ID do jogo', async () => {
            const userId = 'user_id';
            const gameId = 'game_id';
            const wordSearchGame: any = {
                time: 31, // Exemplo de tempo em segundos
                erros: 5,  // Exemplo de erros na partida
            };

            jest.spyOn(usersService, 'getWordSearchGameById').mockResolvedValue(wordSearchGame);

            const result = await usersController.getWordSearchGameById(userId, gameId);

            expect(result).toEqual(wordSearchGame);
            expect(usersService.getWordSearchGameById).toHaveBeenCalledWith(userId, gameId);
        });

        it('deve lançar NotFoundException para jogo inexistente', async () => {
            const userId = 'user_id';
            const gameId = 'non_existent_id';

            jest.spyOn(usersService, 'getWordSearchGameById').mockResolvedValue(null);

            try {
                await usersController.getWordSearchGameById(userId, gameId);
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
                expect(e.message).toBe('Word Search game not found');
            }
        });
    });

    describe('getAllMemoryGamesByUserId', () => {
        it('deve retornar uma lista de jogos de Memória para um usuário', async () => {
            const userId = 'user_id';
            const memoryGames: any[] = [
                {
                    time: 60, // Exemplo de tempo em segundos
                    erros: 2,  // Exemplo de erros na partida
                },
                {
                    time: 31, // Exemplo de tempo em segundos
                    erros: 5,  // Exemplo de erros na partida
                },
            ];

            jest.spyOn(usersService, 'getAllMemoryGameByUserId').mockResolvedValue(memoryGames);

            const result = await usersController.getAllMemoryGamesByUserId(userId);

            expect(result).toEqual(memoryGames);
            expect(usersService.getAllMemoryGameByUserId).toHaveBeenCalledWith(userId);
        });
    });

    describe('getMemoryGameById', () => {
        it('deve retornar um jogo de Memória por usuário e ID do jogo', async () => {
            const userId = 'user_id';
            const gameId = 'game_id';
            const memoryGame: any = {
                time: 60, // Exemplo de tempo em segundos
                erros: 2,  // Exemplo de erros na partida
            };

            jest.spyOn(usersService, 'getMemoryGameById').mockResolvedValue(memoryGame);

            const result = await usersController.getMemoryGameById(userId, gameId);

            expect(result).toEqual(memoryGame);
            expect(usersService.getMemoryGameById).toHaveBeenCalledWith(userId, gameId);
        });

        it('deve lançar NotFoundException para jogo inexistente', async () => {
            const userId = 'user_id';
            const gameId = 'non_existent_id';

            jest.spyOn(usersService, 'getMemoryGameById').mockResolvedValue(null);

            try {
                await usersController.getMemoryGameById(userId, gameId);
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
                expect(e.message).toBe('Memory game not found');
            }
        });
    });

    describe('create', () => {
        it('should create a user and return the user without metadata', async () => {
            const createUserDto: any = {
                name: 'User 1',
                email: 'user1@example.com',
                password: 'password1',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const createdUser: any = {
                _id: 'user_id_1',
                name: 'User 1',
                email: 'user1@example.com',
                password: 'password1',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(usersService, 'createUser').mockResolvedValue(createdUser);

            const responseMock = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await usersController.create(createUserDto, createdUser);
            responseMock.json = createdUser;

            expect(responseMock.status).toHaveBeenCalledWith(201);
            expect(responseMock.json).toHaveBeenCalledWith({
                id: createdUser._id,
                name: createdUser.name,
                email: createdUser.email,
                createdAt: createdUser.createdAt,
                updatedAt: createdUser.updatedAt,
            });
        });
    });

    describe('update', () => {
        it('deve atualizar o usuario e retornar o usuario atualizado', async () => {
            const userId = 'user_id';
            const updateUser: any = {
                name: 'Updated User Name', // Novo nome do usuário
                email: 'updated.user@example.com', // Novo endereço de e-mail
                password: 'newpassword123', // Nova senha
                createdAt: new Date(), // A data de criação permanece inalterada
                updatedAt: new Date(), // Atualize a data de atualização para a hora da atualização
                achievements: [
                    // Lista atualizada de conquistas, se necessário
                    { name: 'New Achievement 1', date: new Date() },
                    { name: 'New Achievement 2', date: new Date() },
                ],
                memoryGames: [
                    // Lista atualizada de jogos de memória, se necessário
                    { _id: 'new_game_id_1', time: 70, erros: 3 }, // Exemplo de um jogo atualizado
                    { _id: 'new_game_id_2', time: 55, erros: 2 }, // Exemplo de um jogo atualizado
                ],
                wordSearchGames: [
                    // Lista atualizada de jogos de caça-palavras, se necessário
                    { _id: 'new_game_id_3', time: 85, erros: 1 }, // Exemplo de um jogo atualizado
                    { _id: 'new_game_id_4', time: 95, erros: 0 }, // Exemplo de um jogo atualizado
                ],
            };
            const updatedUser: any = {
                _id: 'user_id_1', // Mantenha o mesmo ID do usuário
                name: 'Updated User Name', // Novo nome do usuário
                email: 'updated.user@example.com', // Novo endereço de e-mail
                password: 'newpassword123', // Nova senha
                createdAt: new Date(), // A data de criação permanece inalterada
                updatedAt: new Date(), // Atualize a data de atualização para a hora da atualização
                achievements: [
                    // Lista atualizada de conquistas, se necessário
                    { name: 'New Achievement 1', date: new Date() },
                    { name: 'New Achievement 2', date: new Date() },
                ],
                memoryGames: [
                    // Lista atualizada de jogos de memória, se necessário
                    { _id: 'new_game_id_1', time: 70, erros: 3 }, // Exemplo de um jogo atualizado
                    { _id: 'new_game_id_2', time: 55, erros: 2 }, // Exemplo de um jogo atualizado
                ],
                wordSearchGames: [
                    // Lista atualizada de jogos de caça-palavras, se necessário
                    { _id: 'new_game_id_3', time: 85, erros: 1 }, // Exemplo de um jogo atualizado
                    { _id: 'new_game_id_4', time: 95, erros: 0 }, // Exemplo de um jogo atualizado
                ],
            };

            jest.spyOn(usersService, 'updateUser').mockResolvedValue(updatedUser);

            const result = await usersController.update(userId, updateUser);

            expect(result).toEqual(updatedUser);
            expect(usersService.updateUser).toHaveBeenCalledWith(userId, updateUser);
        });
    });

    describe('delete', () => {
        it('Deve deletar um usuario', async () => {
            const userId = 'user_id';

            jest.spyOn(usersService, 'deleteUser').mockResolvedValue();

            const result = await usersController.delete(userId);

            expect(result).toBeUndefined();
            expect(usersService.deleteUser).toHaveBeenCalledWith(userId);
        });
    });

    describe('createWordSearchGame', () => {
        it('Deve criar um jogo caça palavras para o usuário', async () => {
            const userId = 'user_id';
            const gameDto: any = {
                time: 60, // Exemplo de tempo em segundos
                erros: 2,  // Exemplo de erros na partida
            };

            jest.spyOn(usersService, 'createWordSearchGame').mockResolvedValue({
                _id: 'new_word_search_game_id',
                time: 120,
                erros: 5, // Número de erros na partida
                // Outras propriedades do jogo de caça-palavras, se houver
            } as unknown as User); // Certifique-se de que o valor é do tipo User

            const result = await usersController.createWordSearchGame(userId, gameDto);

            expect(result).toBeDefined();
            expect(usersService.createWordSearchGame).toHaveBeenCalledWith(userId, gameDto);
        });
    });

    describe('createMemoryGame', () => {
        it('Deve criar um jogo da memoria para o usuario', async () => {
            const user: any = {
                _id: 'user_id',
                name: 'User 1',
                email: 'user1@example.com',
                password: 'password',
                createdAt: new Date(),
                updatedAt: new Date(),
                achievements: [
                    { name: 'Achievement 1', date: new Date() },
                    { name: 'Achievement 2', date: new Date() },
                ],
                memoryGames: [
                ]
            };
            const gameDto: any = {
                time: 60,
                erros: 2,
            };
            const newMemoryGame = {
                _id: 'new_memory_game_id',
                time: gameDto.time,
                erros: gameDto.erros,
            };

            user.memoryGames.push(newMemoryGame);

            jest.spyOn(usersService, 'createMemoryGame').mockResolvedValue(user); // Certifique-se de que o valor seja do tipo User

            const result = await usersController.createMemoryGame('user_id', gameDto);

            expect(result).toEqual(user);
            expect(usersService.createMemoryGame).toHaveBeenCalledWith('user_id', gameDto);
        });
    });

    describe('login', () => {
        it('deve retornar um ID de usuário quando as credenciais válidas são fornecidas', async () => {
            // Mock the login function of the AuthService to return a user ID
            const userId = 1;
            jest.spyOn(authService, 'login').mockResolvedValue(userId);

            const loginDto = { email: 'example@example.com', password: 'password' };
            const result = await usersController.login(loginDto);

            expect(result).toBe(userId);
        });

        it('deve lançar UnauthorizedException quando as credenciais inválidas são fornecidas', async () => {
            // Mock the login function of the AuthService to return null (invalid credentials)
            jest.spyOn(authService, 'login').mockResolvedValue(null);

            const loginDto = { email: 'invalid@example.com', password: 'invalid' };

            try {
                await usersController.login(loginDto);
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedException);
                expect(error.message).toBe('Invalid Credentials');
            }
        });
        it('deve lançar UnauthorizedException quando a senha é inválida', async () => {
            // Mock the getUserByEmail function of the UsersService to return a user object
            const user = { _id: 1, email: 'example@example.com', password: 'hashedPassword' };
            jest.spyOn(authService, 'login').mockResolvedValue(user);

            // Mock the bcrypt compare function to return false (invalid password)
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

            const loginDto = { email: 'example@example.com', password: 'invalid' };

            try {
                await usersController.login(loginDto);
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedException);
                expect(error.message).toBe('Invalid credentials');
            }
        });
    });
});