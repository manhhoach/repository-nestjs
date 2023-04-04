import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { userProvider } from './user.provider';
import { databaseProvider } from './../database/database.provider';
import { User } from './user.entity';



describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [userProvider, databaseProvider, UserService],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('return user if email not in use', async () => {
    let data = await service.create({ email: 'foo@bar.com', password: 'password', name: 'foo' });
    expect(data).toBeDefined()
    expect(data.email).toEqual('foo@bar.com')
    expect(data.password).not.toEqual('password')
    expect(data).toBeInstanceOf(User)
  })
});
