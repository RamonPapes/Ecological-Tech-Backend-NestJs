import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { AuthService } from './auth.service'; // Importe o AuthService
import { UserSchema } from './user.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([{ 
            name: 'User', 
            schema: UserSchema 
        }]),
        JwtModule.register({
            secret: 'azeitona',
            signOptions: { expiresIn: '1h' },
        }),
    ],

    controllers: [UsersController],
    providers: [UsersService, AuthService], // Inclua o AuthService como provider
    exports: [UsersService], // Opcional: Exporte o UserService se você desejar usar em outros módulos
})
export class UserModule { }