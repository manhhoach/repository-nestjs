import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { userProvider } from './user.provider';
import { databaseProvider } from './../database/database.provider';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, userProvider, databaseProvider],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    console.log('Testing')
    expect(service).toBeDefined();
  });

  it('throw error if email in use', async()=>{
    await service.create({email: 'foo@bar.com', password: 'password', name: 'foo'});
    let data=await service.create({email: 'foo@bar.com', password: 'password', name: 'foo'});
    console.log(data);
    
  })
});
