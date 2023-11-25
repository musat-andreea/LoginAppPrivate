import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/create-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);

        if (! (await user?.validatePassword(pass))) {
            throw new UnauthorizedException();
        }
            
        const payload = { sub: user.userId, email: user.email, location: user.location, name: user.name};
            
        return {
            access_token: await this.jwtService.signAsync(payload, {secret: process.env.SECRET})
        }
        
    }

    async signUp(createUserDto: CreateUserDto): Promise<any> {
        const {  password, email, name, location, repeatPassword } = createUserDto;

        if (password !== repeatPassword) {
            return {
                success: false
            } 
        }

        const user = await this.usersService.findOne(email);

        if(user) {
            return {
                success: false
            }
        }

        const userModel = new User();
        userModel.email = email;
        userModel.password = password;
        userModel.name = name;
        userModel.location = location;

        let savedUser = await userModel.save(user);

        if(savedUser.hasId()) {
            return {
                success: true,
            }
        }

        return {
            success: false
        }
    }
}
