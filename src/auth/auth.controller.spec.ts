import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CreateUserDto } from '../users/create-user.dto';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('./auth.service');
jest.mock('./auth.guard');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, AuthGuard],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    it('should return an access token on successful sign-in', async () => {
      const signInDto: CreateUserDto = { name: 'Test', email: 'test@example.com', password: 'password123', location: 'Bucharest', repeatPassword: 'password123' };
      const mockedAccessToken = 'mockedAccessToken';
      jest.spyOn(authService, 'signIn').mockResolvedValueOnce({ access_token: mockedAccessToken });

      const result = await authController.signIn(signInDto);

      expect(result).toEqual({ access_token: mockedAccessToken });
    });

    it('should throw UnauthorizedException on failed sign-in', async () => {
      const signInDto: CreateUserDto = { name: 'Test', email: 'test@example.com', password: 'wrongPassword', location: 'Bucharest', repeatPassword: 'wrongPassword' };
      jest.spyOn(authService, 'signIn').mockRejectedValueOnce(new UnauthorizedException());

      await expect(authController.signIn(signInDto)).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('signUp', () => {
    it('should return the response from AuthService.signUp', async () => {
      const createUserDto: CreateUserDto = {
        email: 'newuser@example.com',
        password: 'password123',
        repeatPassword: 'password123',
        name: 'New User',
        location: 'New Location',
      };
      const signUpResponse = { success: true };
      jest.spyOn(authService, 'signUp').mockResolvedValueOnce(signUpResponse);

      const result = await authController.signUp(createUserDto);

      expect(result).toEqual(signUpResponse);
    });
  });

  describe('getProfile', () => {
    it('should return the user from the request object', () => {
      const user = { id: 1, email: 'test@example.com', name: 'Test User', location: 'Test Location' };
      const request = { user };

      const result = authController.getProfile(request);

      expect(result).toEqual(user);
    });
  });
});
