import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProfileDto {
    @IsString()
    @MaxLength(255)
    name: string;

    @IsEmail()
    @MaxLength(255)
    email: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    position?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    organization?: string;

    @IsOptional()
    @IsString()
    url?: string;

    @IsOptional()
    @IsString()
    profile?: string;
}