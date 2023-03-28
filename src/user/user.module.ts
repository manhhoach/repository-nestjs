import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { userProvider } from './user.provider';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User]), DatabaseModule],
    providers: [userProvider, UserService],
    controllers: [UserController]
})
export class UserModule { }
