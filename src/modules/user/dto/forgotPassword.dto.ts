import {
    IsEmail,
    IsNotEmpty,
} from 'class-validator'; // Import validation decorators from class-validator

export class ForgotPasswordDto {
    @IsEmail() // Ensure the email is in a valid email format
    @IsNotEmpty() // Ensure the email is not empty
    email: string;

}