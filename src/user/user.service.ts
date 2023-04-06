import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CONSTANTS_REPOSITORY } from './../constants/repository';
import { MESSAGES } from './../constants/messages';


@Injectable()
export class UserService {
    constructor(@Inject(CONSTANTS_REPOSITORY.USER_REPOSITORY) private userRepository: Repository<User>) { }

    findByEmail(email: string): Promise<User> {
        return this.userRepository.findOneBy({ email: email })
    }

    findById(id: number): Promise<User> {
        let query = this.userRepository.createQueryBuilder('user').where('user.id = :id', { id: id }).cache(5000)
        return query.getOne();
    }

    save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    createAndSave(data: Partial<User>): Promise<User> {
        let user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }

    changePassword(user: Partial<User>, oldPassword: string, newPassword: string) {
        let isEqual = user.comparePassword(oldPassword);
        if (!isEqual) {
            throw new BadRequestException(MESSAGES.WRONG_PASSWORD);
        }
        user.password = newPassword;
        return user.save();
    }
    
}
