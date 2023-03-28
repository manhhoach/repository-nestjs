import {
    Body,
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Query,
    NotFoundException,
    Res,
    UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { RegisterUserDto } from './dto/user.register.dto';
import { LoginUserDto } from './dto/user.login.dto';

import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { Serialize } from './../interceptors/validate.interceptor';
import { CustomResponse } from './../helpers/custom.response';


@Controller('users')
export class UserController {
    constructor(private userService: UserService, private authService: AuthService) { }

    @Serialize(RegisterUserDto)
    @Post('/register')
    async register(@Body() body: RegisterUserDto, @Res() res: Response) {
        let user = await this.authService.register(body);
        return CustomResponse.responseSuccess(res, 201, user)
    }

    @Post('/login')
    async login(@Body() body: LoginUserDto, @Res() res: Response) {
        await this.authService.login(body)
    }

}
