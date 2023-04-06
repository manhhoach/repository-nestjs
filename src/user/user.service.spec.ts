import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { userProvider } from './user.provider';
import { databaseProvider } from './../database/database.provider';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [databaseProvider, userProvider, UserService,
        {
          provide: 'USER_REPOSITORY',
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>('USER_REPOSITORY');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('return user if email is registered', async () => {
    let user = new User();
    user = Object.assign(user, { name: 'foo', email: 'foo@bar.com', password: 'password' });
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
    const result = await service.findByEmail('foo@bar.com');
    expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: 'foo@bar.com' });
    expect(result).toEqual(user);
  })


});
