import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignsTemplateDto } from './create-campaigns-template.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCampaignsTemplateDto extends PartialType(CreateCampaignsTemplateDto) {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    message?: string;

    @IsNumber()
    @IsOptional()
    user_id?: number;
}
