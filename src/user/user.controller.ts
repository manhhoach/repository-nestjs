import { Body, Controller, Post, Get, Patch, Res, UseGuards, UseInterceptors, HttpStatus, Req } from '@nestjs/common';
import { Response, Request } from 'express';

import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

import { UserDto } from './dto/user.dto';
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

    // @Get('/me')
    // @UseGuards(AuthGuard)
    // @UseInterceptors(CurrentUserInterceptor)
    // getMe(@CurrentUser() user: User, @Res() res: Response) {
    //     this.returnResponse(res, HttpStatus.OK, user)
    // }

    @Get('/me')
    getMe(@Req() req: Request, @Res() res: Response) {
        let user = UserDto.getUserDto(req.currentUser)
        this.returnResponse(res, HttpStatus.OK, user)
    }

    @Patch('/me')
    @Serialize(UpdateUserDto)
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    async updateMe(@CurrentUser() user: User, @Body() body: UpdateUserDto, @Res() res: Response) {
        let userSaved = Object.assign(user, body, {password: undefined});
        userSaved = await this.userService.save(userSaved);
        this.returnResponse(res, HttpStatus.OK, userSaved)
    }

    @Patch('/update-password')
    @Serialize(UpdatePasswordUserDto)
    async updatePassword(@Body() body: UpdatePasswordUserDto, @Req() req: Request, @Res() res: Response) {
        await this.userService.changePassword(req.currentUser, body.oldPassword, body.newPassword);
        this.returnResponse(res, HttpStatus.OK, MESSAGES.UPDATE_SUCCESSFULLY)

    }

}
