import { Body, Controller, Post, Get, Patch, Delete, Param, Query, Res, UseGuards, UseInterceptors, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

import { RegisterUserDto } from './dto/user.register.dto';
import { LoginUserDto } from './dto/user.login.dto';
import { UpdateUserDto } from './dto/user.update.dto';
import { UpdatePasswordUserDto } from './dto/user.update.password.dto';

import { AuthGuard } from './../guards/auth.guard';
import { Serialize } from '../interceptors/validate.interceptor';
import { CurrentUserInterceptor } from './../interceptors/current.user.interceptor';
import { CurrentUser } from './../decorators/current.user.decorator';
import { CustomResponse } from './../response/success.response';

import { MESSAGES } from './../constants/messages';



@Controller('users')
export class UserController {
    constructor(private userService: UserService, private authService: AuthService) { }

    returnResponse(res: Response, statusCode: number, data: any) {
        const response = CustomResponse.responseSuccess(statusCode, data)
        res.status(response.statusCode).json(response.getResponse());
    }

    @Serialize(RegisterUserDto)
    @Post('/register')
    async register(@Body() body: RegisterUserDto, @Res() res: Response) {
        let user = await this.authService.register(body);
        this.returnResponse(res, HttpStatus.CREATED, user)
    }

    @Serialize(LoginUserDto)
    @Post('/login')
    async login(@Body() body: LoginUserDto, @Res() res: Response) {
        let data = await this.authService.login(body);
        this.returnResponse(res, HttpStatus.OK, data)
    }

    @Get('/me')
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    getMe(@CurrentUser() user: User, @Res() res: Response) {
        this.returnResponse(res, HttpStatus.OK, user)
    }

    @Patch('/me')
    @Serialize(UpdateUserDto)
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    async updateMe(@CurrentUser() user: User, @Body() body: UpdateUserDto, @Res() res: Response) {
        let userSaved = Object.assign(user, body);
        userSaved = await this.userService.save(userSaved);
        this.returnResponse(res, HttpStatus.OK, userSaved)
    }

    @Patch('/update-password')
    @Serialize(UpdatePasswordUserDto)
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    async updatePassword(@CurrentUser() user: User, @Body() body: UpdatePasswordUserDto, @Res() res: Response) {
        await this.userService.changePassword(user, body.oldPassword, body.newPassword);
        this.returnResponse(res, HttpStatus.OK, MESSAGES.UPDATE_SUCCESSFULLY)

    }

}
