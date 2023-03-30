import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import {MESSAGES} from './../constants/messages';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if(!token){
      throw new UnauthorizedException(MESSAGES.TOKEN_NOT_PROVIDED)
    }
    return true;
  }
}
