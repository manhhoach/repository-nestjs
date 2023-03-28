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
import { CreateUserDto } from './dto/user.register.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Serialize } from './../interceptors/validate.interceptor';
import { CustomResponse } from './../helpers/custom.response';


@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Serialize(CreateUserDto)
    @Post('/register')
    async register(@Body() body: CreateUserDto, @Res() res: Response) {
        let user = await this.userService.create(body);
        //return CustomResponse.responseSuccess(res, 201, user)
        return CustomResponse.responseFailure(res, 400, "EMAIL already used")

    }
}
