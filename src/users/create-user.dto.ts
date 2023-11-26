import { IsEmail, IsNotEmpty } from "class-validator";
import internal from "stream";

export class CreateUserDto{
    @IsEmail()
    email: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    location: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    repeatPassword: string;
}