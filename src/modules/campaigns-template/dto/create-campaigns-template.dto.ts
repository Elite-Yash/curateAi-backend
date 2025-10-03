
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCampaignsTemplateDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsNumber()
    @IsNotEmpty()
    user_id: number;
}