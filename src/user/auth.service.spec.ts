import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { userProvider } from './user.provider';
import { databaseProvider } from './../database/database.provider';
import { User } from './user.entity';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { UserService } from './user.service';

describe('auth service', () => {
    let service: AuthService;
    let fakeUserService: Partial<UserService>;

    beforeEach(async () => {
        const users = [];
        fakeUserService = {
            createAndSave: (data: any): Promise<User> => {
                let user = new User();
                user = Object.assign(user, data, { password: hashSync(data.password, genSaltSync(10)) })
                users.push(user);
                return Promise.resolve(user)
            },
            findByEmail: (email: string) => {
                let userFilter = users.filter(user => user.email === email)
                return Promise.resolve(userFilter[0])
            }
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                userProvider,
                databaseProvider,
                AuthService,
                {
                    provide: UserService,
                    useValue: fakeUserService,
                }
            ],
        }).compile();
        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('throw error if user register with email that is in use', async () => {
        await service.register({ email: 'foo@bar.com', password: 'password', name: 'foo' });
        await expect(service.register({ email: 'foo@bar.com', password: 'password', name: 'foo' })).rejects.toThrow();
        // The .rejects method in Jest is used to test if a Promise is rejected with a specific error
        // toThrowError is used to check for a specific error type that extends the base Error class. 
        // toThrow is used to check for any type of error.
    })

    it('return user if register successfully', async () => {
        let data = await service.register({ email: 'foo@bar.com', password: 'password', name: 'foo' });
        expect(data).toBeDefined()
        expect(data).toBeInstanceOf(User)
    })

    it('return true if password is hashed after register', async () => {
        let data = await service.register({ email: 'foo@bar.com', password: 'password', name: 'foo' });
        expect(data.password).not.toEqual('password')
    })

    it('throw error if user login with an unregistered email', async () => {
        await expect(service.login({ email: 'unregistered@gmail.com', password: 'password' })).rejects.toThrow()
    })

    it('throw error if an wrong password is provided', async () => {
        await service.register({ email: 'foo@bar.com', password: 'password', name: 'foo' });
        await expect(service.login({ email: 'foo@bar.com', password: 'password123' })).rejects.toThrow();
    });

    it('return true if correct password is provided', async () => {
        let data = await service.register({ email: 'foo@bar.com', password: 'password', name: 'foo' });
        const user = await service.login({ email: 'foo@bar.com', password: 'password' });
        expect(user.password).toEqual(data.password);
    });

    it('return a user if correct email and password are provided', async () => {
        await service.register({ email: 'foo@bar.com', password: 'password', name: 'foo' });
        const user = await service.login({ email: 'foo@bar.com', password: 'password' });
        expect(user).toBeDefined();
        expect(user).toBeInstanceOf(User);
    });

    
});
