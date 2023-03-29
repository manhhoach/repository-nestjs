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
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';

import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

import { RegisterUserDto } from './dto/user.register.dto';
import { LoginUserDto } from './dto/user.login.dto';

import { AuthGuard } from './../guards/auth.guard';
import { Serialize } from '../interceptors/validate.interceptor';
import { CurrentUserInterceptor } from './../interceptors/current.user.interceptor';
import { CurrentUser } from 'src/decorators/current.user.decorator';

import { CustomResponse } from './../helpers/custom.response';
import { CustomError } from './../helpers/custom.error';


@Controller('users')
export class UserController {
    constructor(private userService: UserService, private authService: AuthService) { }

    @Serialize(RegisterUserDto)
    @Post('/register')
    async register(@Body() body: RegisterUserDto, @Res() res: Response) {
        let user = await this.authService.register(body);
        return CustomResponse.responseSuccess(res, 201, user)
    }

    @Serialize(LoginUserDto)
    @Post('/login')
    async login(@Body() body: LoginUserDto, @Res() res: Response) {
        let data: any = await this.authService.login(body);
        if (data instanceof CustomError)
            return CustomResponse.responseFailure(res, data);
        return CustomResponse.responseSuccess(res, 200, data);
    }

    @Get('/me')
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    async getMe(@CurrentUser() user: User, @Res() res: Response) {
        return CustomResponse.responseSuccess(res, 200, user);
    }

}
