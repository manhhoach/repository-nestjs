import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from './user.entity';
import { RegisterUserDto } from './dto/user.register.dto';
import { LoginUserDto } from './dto/user.login.dto';
import * as jwt from 'jsonwebtoken';
import { MESSAGES } from './../constants/messages';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) { }

    async register(data: RegisterUserDto): Promise<User> {
        let user = await this.userService.findByEmail(data.email);
        if (user) {
            throw new BadRequestException(MESSAGES.EMAIL_IN_USE);
        }
        return this.userService.createAndSave(data);
    }

    async login(data: LoginUserDto) {
        let user = await this.userService.findByEmail(data.email);
        if (!user) {
            throw new NotFoundException(MESSAGES.EMAIL_NOT_FOUND);
        }
        let comparedPassword = user.comparePassword(data.password);
        if (!comparedPassword) {
            throw new BadRequestException(MESSAGES.WRONG_PASSWORD);
        }
        let token = this.generateToken({ id: user.id });
        return Object.assign(user, { token: token });
        return Object.assign(user, { token: token }, { password: undefined });
    }

    generateToken(data: any): string {
        let token = jwt.sign(data, process.env.SECRET_KEY, { expiresIn: '1d' });
        return token;
    }

    verifyToken(token: string): any {
        return jwt.verify(token, process.env.SECRET_KEY)
    }

}
