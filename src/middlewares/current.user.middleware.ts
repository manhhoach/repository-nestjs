import {Injectable, NestMiddleware, UnauthorizedException, NotFoundException} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import {AuthService }from './../user/auth.service';
import {UserService} from './../user/user.service';
import {User} from './../user/user.entity';
import {MESSAGES} from './../constants/messages';

declare global{
    namespace Express{
        interface Request{
            currentUser:User
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private authService: AuthService, private userService: UserService){}
    async use(req: Request, res: Response, next: NextFunction){
        console.log('middleware use');
        
        const token = req.headers.authorization?.split(' ')[1];
        if(!token){
            throw new UnauthorizedException(MESSAGES.TOKEN_NOT_PROVIDED)
        }
        const decoced = this.authService.verifyToken(token);
        let user = await this.userService.findById(decoced.id);
        if(user){
            req.currentUser = user;
            return next();
        }
        throw new NotFoundException(MESSAGES.USER_NOT_FOUND)

    }
}