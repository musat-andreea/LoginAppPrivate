import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../users/create-user.dto';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('@nestjs/jwt');

class MockRepository<T> {
  createQueryBuilder = jest.fn();
  find = jest.fn();
  findOne = jest.fn();
  save = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let userRepository: MockRepository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: MockRepository,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mockedAccessToken'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    it('should sign in a user and return an access token', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = new User();
      user.email = email;
      user.password = password;
      jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(user, 'validatePassword').mockResolvedValueOnce(true);

      const result = await authService.signIn(email, password);

      expect(result.access_token).toEqual('mockedAccessToken');
    });

    it('should throw UnauthorizedException if user validation fails', async () => {
      const email = 'test@example.com';
      const password = 'wrongPassword';
      const user = new User();
      user.email = email;
      user.password = 'password123';
      jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(user, 'validatePassword').mockResolvedValueOnce(false);

      await expect(authService.signIn(email, password)).rejects.toThrowError(UnauthorizedException);
    });
  });
});
