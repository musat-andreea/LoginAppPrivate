import { Injectable } from '@nestjs/common';
import { User as UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export type User = any;

@Injectable()
export class UsersService {
    
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<User>,
    ) {}

    async findOne(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({where: {
            email: email,
        }});
    }
}