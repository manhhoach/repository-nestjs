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

    create(data: Partial<User>): Promise<User> {
        let user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }

    findById(id: number, requiredPassword = false): Promise<User> {
        let query = this.userRepository.createQueryBuilder('user').where('user.id = :id', { id: id }).cache(5000)
        if (requiredPassword)
            query.addSelect('user.password');
            
        return query.getOne();
    }

    save(data: Partial<User>, user: User): Promise<User> {
        let userSaved = Object.assign(user, data);
        return userSaved.save();
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
