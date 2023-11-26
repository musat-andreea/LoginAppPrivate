import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RemoveOptions, Repository, SaveOptions } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user when findOne is called with a valid email', async () => {
      const email = 'test@example.com';
      const hashedPassword = await bcrypt.hash('password123', 8);
      const expectedUser: User = new User();

      expectedUser.id = 1;
      expectedUser.email = 'testing@yahoo.com';
      expectedUser.name = 'User Test';
      expectedUser.location = 'Location Test';
      expectedUser.password = hashedPassword;
      expectedUser.updateAt = new Date();

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(expectedUser);

      const result = await usersService.findOne(email);

      expect(result).toEqual(expectedUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
    });

    it('should handle errors and throw an exception', async () => {
      const email = 'test@example.com';

      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error('Database error'));

      await expect(usersService.findOne(email)).rejects.toThrowError('Database error');
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
    });
  });

  describe('hashPassword', () => {
    it('should hash the password before inserting', async () => {
      const user = new User();
      user.password = 'password123';

      await user.hashPassword();

      expect(user.password).not.toBe('password123');
      expect(typeof user.password).toBe('string');
      expect(user.password.length).toBeGreaterThan(0);
    });
  });

  describe('validatePassword', () => {
    it('should return true for a valid password', async () => {
      const user = new User();
      user.password = await bcrypt.hash('password123', 8);

      const result = await user.validatePassword('password123');

      expect(result).toBe(true);
    });

    it('should return false for an invalid password', async () => {
      const user = new User();
      user.password = await bcrypt.hash('password123', 8);

      const result = await user.validatePassword('wrongpassword');

      expect(result).toBe(false);
    });
  });
});
