import { NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from "@nestjs/common";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

class ValidateInterceptor implements NestInterceptor {
    constructor(private dto: any) { }
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> | Promise<Observable<any>> {
        return handler.handle().pipe(
            map((data: any) => {
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true,
                
                })
            })
        )
    }
}

interface ClassContructor{
    new (...args: any[]):{}
}

export function Serialize(dto: ClassContructor){
    return UseInterceptors(new ValidateInterceptor(dto))
}
