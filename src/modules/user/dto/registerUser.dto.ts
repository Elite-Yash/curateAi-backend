import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    Validate,

} from 'class-validator'; // Import validation decorators from class-validator


import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'; // Import types for custom validation

// Custom validator to check if passwords match
@ValidatorConstraint({ name: 'matchPassword', async: false }) // Define a new validator constraint
export class MatchPasswordConstraint implements ValidatorConstraintInterface {
    // Method to validate the confirmPassword field
    validate(confirmPassword: string, args: ValidationArguments) {
        // Access the object being validated (i.e., the RegisterDto instance)
        const obj = args.object as any;
        // Check if the password and confirmPassword match
        return obj.password === confirmPassword;
    }

    // Message to return if validation fails
    defaultMessage(args: ValidationArguments) {
        return 'Passwords do not match!';
    }
}

// Data Transfer Object for user registration
export class RegisterUserDto {
    @IsString() // Ensure the name is a string
    @IsNotEmpty() // Ensure the name is not empty
    name: string;

    @IsEmail() // Ensure the email is in a valid email format
    @IsNotEmpty() // Ensure the email is not empty
    email: string;

    @IsString() // Ensure the password is a string
    @IsNotEmpty() // Ensure the password is not empty
    @MinLength(6, { message: 'Password must be at least 6 characters long' }) // Minimum length requirement
    password: string;

    @IsString() // Ensure confirmPassword is a string
    @IsNotEmpty() // Ensure confirmPassword is not empty
    @Validate(MatchPasswordConstraint) // Apply the custom password match validator
    confirmPassword: string;
}
