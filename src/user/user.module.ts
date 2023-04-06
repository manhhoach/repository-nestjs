import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { userProvider } from './user.provider';
import { UserController } from './user.controller';
import { DatabaseModule } from './../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CurrentUserMiddleware } from './../middlewares/current.user.middleware';

@Module({
    imports: [TypeOrmModule.forFeature([User]), DatabaseModule],
    providers: [userProvider, UserService, AuthService],
    controllers: [UserController]
})
export class UserModule {
    configure(consume: MiddlewareConsumer) {
        consume.apply(CurrentUserMiddleware).exclude(
            'users/login', 'users/register', { path: 'users/me', method: RequestMethod.PATCH }
        ).forRoutes(UserController)
    }
}
