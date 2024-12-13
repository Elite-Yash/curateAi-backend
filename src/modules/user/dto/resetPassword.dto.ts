import { IsString, IsNotEmpty, MinLength, Validate, IsOptional } from 'class-validator';
import { MatchPasswordConstraint } from './registerUser.dto';

export class ResetPasswordDto {
    @IsOptional()
    @IsString()
    token?: string;

    @IsString() 
    @IsNotEmpty({ message: 'Password is required.' }) 
    @MinLength(6, { message: 'Password must be at least 6 characters long.' }) 
    password: string;

    @IsString() 
    @IsNotEmpty({ message: 'Confirm password is required.' }) 
    @MinLength(6, { message: 'Confirm password must be at least 6 characters long.' }) 
    @Validate(MatchPasswordConstraint) 
    confirmPassword: string;
}
