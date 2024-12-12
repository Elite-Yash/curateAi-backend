import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator'; // Import validation decorators from class-validator

export class LoginUserDto {
    @IsEmail() // Ensure the email is in a valid email format
    @IsNotEmpty() // Ensure the email is not empty
    email: string;

    @IsString() // Ensure the password is a string
    @IsNotEmpty() // Ensure the password is not empty
    @MinLength(6, { message: 'Password must be at least 6 characters long' }) // Minimum length requirement
    password: string;

    @IsString() // Ensure the password is a string
    @IsNotEmpty() // Ensure the password is not empty
    type: string;

    @IsString()
    @IsOptional()
    device_name?: string;

    @IsString()
    @IsOptional()
    device_token?: string;

}