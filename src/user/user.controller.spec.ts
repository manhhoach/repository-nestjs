import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { RegisterUserDto } from './dto/user.register.dto';
import { LoginUserDto } from './dto/user.login.dto';
import { MESSAGES } from './../constants/messages';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let userService: Partial<UserService>;
  let authService: Partial<AuthService>;
  const res: Response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any;

  beforeEach(async () => {
    userService = {
      findByEmail: jest.fn().mockImplementation((email: string) => {
        const user = new User();
        return Promise.resolve({
          email: 'registered@gmail.com', password: '123456', id: 1
        } as User);
      }),
    }
    authService = {
      register: (body: RegisterUserDto) => {
        let user = new User();
        user = Object.assign(user, body, { id: 1 })
        return Promise.resolve(user)
      },
      login: (body: LoginUserDto): any => {
        if (body.email === 'registered@gmail.com') {
          if (body.password === '123456') {
            let user: any = new User()
            user = Object.assign(user, body, { token: '123xxx' });
            return Promise.resolve(user)
          }
          return Promise.reject(new BadRequestException(MESSAGES.WRONG_PASSWORD));
        }
        else {
          return Promise.reject(new NotFoundException(MESSAGES.EMAIL_NOT_FOUND))
        }

      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userService
        },
        {
          provide: AuthService,
          useValue: authService
        }
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('return user if register successfully', async () => {
    const registerDto: RegisterUserDto = { name: 'google', email: 'john@example.com', password: 'password' };
    let user = new User();
    user = Object.assign(user, registerDto, { id: 1 });

    await controller.register(registerDto, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.CREATED,
      data: user,
      success: true
    });
  });

  it('throw error when login with unregistered email', async () => {
    const user: LoginUserDto = {
      email: 'unregistered@gmail.com',
      password: 'password'
    }
    await expect(controller.login(user, res)).rejects.toBeInstanceOf(NotFoundException)

  });

  it('throw error when login with wrong password', async () => {
    const user: LoginUserDto = {
      email: 'registered@gmail.com',
      password: 'password'
    }
    await expect(controller.login(user, res)).rejects.toBeInstanceOf(BadRequestException)
  });

  // it('return user and token when login successfully', async () => {
  //   const user: LoginUserDto = {
  //     email: 'registered@gmail.com',
  //     password: '123456'
  //   }
  //   let data: any = await controller.login(user, res);
  //   expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
  //   expect(res.json).toHaveBeenCalledWith({
  //     statusCode: HttpStatus.OK,
  //     data:  data,
  //     success: true
  //   });
  // });
});

