import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, IsInt } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsOptional()
  url: string;

  @IsEnum(['message', 'connect', 'endorse', 'view'])
  type: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsEnum(['active', 'inactive'])
  @IsOptional()
  status?: string;

  @IsEnum(['csv', 'url'])
  import_type: string;

  @IsOptional()
  @IsInt()
  max_connections?: number;
}
