import { Type } from 'class-transformer';
import { IsNumber, IsNotEmpty, IsArray, ValidateNested, IsString, IsEnum, IsOptional } from 'class-validator';

class ProfileDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    profileLink: string;

    @IsOptional()
    @IsString()
    type?: 'message' | 'connect' | string;
}

export class CreateProcessActivityDto {
    @IsNumber()
    @Type(() => Number)
    campaignId: number;

    @IsNumber()
    @Type(() => Number)
    automation_id: number;

    @IsString()
    @IsEnum(['message', 'connect'])
    type: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProfileDto)
    profiles: ProfileDto[];
}
