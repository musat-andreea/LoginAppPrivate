import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {

    // async create(createUserDto: User){
    //     const user = User.create(createUserDto);
    //     await user.save();

    //     delete user.password;
    //     return user;
    // }

    // async showById(id: number): Promise<User>{
    //     const user = await this.findById(id);

    //     delete user.password;
    //     return user;
    // }

    // async findById(id: number) {
    //     return await User.findOne(id);
    // }
}
