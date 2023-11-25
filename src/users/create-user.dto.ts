import { IsEmail, IsNotEmpty } from "class-validator";
import internal from "stream";

export class CreateUserDto{
    @IsEmail()
    email: string;

    @IsEmail()
    name: string;

    @IsEmail()
    location: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    repeatPassword: string;
}