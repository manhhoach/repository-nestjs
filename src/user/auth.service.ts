import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CONSTANTS_REPOSITORY } from './../constants/repository';
import { RegisterUserDto } from './dto/user.register.dto';
import { LoginUserDto } from './dto/user.login.dto';
import * as jwt from 'jsonwebtoken';
import { MESSAGES } from './../constants/messages';

@Injectable()
export class AuthService {
    constructor(@Inject(CONSTANTS_REPOSITORY.USER_REPOSITORY) private userRepository: Repository<User>) { }

    register(data: RegisterUserDto): Promise<User> {
        let user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }

    async login(data: LoginUserDto) {
        let user = await this.userRepository.createQueryBuilder('user')
            .where('user.email = :email', { email: data.email })
            .select(['user', 'user.password'])
            .getOne();
        if (!user) {
            throw new NotFoundException(MESSAGES.EMAIL_NOT_FOUND);
        }
        let comparedPassword = user.comparePassword(data.password);
        if (!comparedPassword) {
            throw new BadRequestException(MESSAGES.WRONG_PASSWORD);
        }
        let token = this.generateToken({ id: user.id });
        return Object.assign(user, { token: token }, { password: undefined });
    }

    generateToken(data: any): string {
        let token = jwt.sign(data, process.env.SECRET_KEY, { expiresIn: '7d' });
        return token;
    }

    verifyToken(token: string): any{
        return jwt.verify(token, process.env.SECRET_KEY)
    }

}
