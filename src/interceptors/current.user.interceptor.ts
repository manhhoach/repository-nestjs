import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { AuthService } from "./../user/auth.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private authService: AuthService, private userService: UserService) { }

    async intercept(context: ExecutionContext, handler: CallHandler) {
        console.log('interceptor use');
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization.split(' ')[1];
        const decoced = this.authService.verifyToken(token);
        let user = await this.userService.findById(decoced.id);
        request.currentUser = user;
        return handler.handle();
    }
}