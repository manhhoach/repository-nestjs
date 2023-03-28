import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';


@Injectable()
export class UserService {
    constructor(@Inject('USER_REPOSITORY') private userRepository: Repository<User>) { }

    findByEmail(email: string): Promise<User> {
        return this.userRepository.findOneBy({ email: email })
    }

    create(data: Partial<User>): Promise<User> {
        let user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }
}
