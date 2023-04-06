import { Expose, plainToClass } from 'class-transformer';
import { User } from '../user.entity';

export class UserDto {

    @Expose()
    id: number;
    @Expose()
    name: string;
    @Expose()
    email: string;
    @Expose()
    type: number;
    @Expose()
    createdAt: Date;

    static getUserDto(user: User) {
        return plainToClass(this, user, { excludeExtraneousValues: true })
    }

}
