import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUrl, IsInt, Min, Max } from 'class-validator';

export class UpdateCampaignDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsEnum(['message', 'connect', 'endorse', 'view'])
  type?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: string;

  @IsOptional()
  @IsEnum(['csv', 'url'])
  import_type?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  @Transform(({ value }) => {
    const num = parseInt(value, 10);
    return isNaN(num) ? undefined : num;
  })
  max_connections?: number;
}
