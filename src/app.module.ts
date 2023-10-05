import { Module } from '@nestjs/common';
import { MongoDatabaseModule } from './infra/mongo/mongo-database.module';
import { UserModule } from './users/user.module';
import * as cors from 'cors';

@Module({
  imports: [
    MongoDatabaseModule,
    UserModule,
  ],
})
export class AppModule {}