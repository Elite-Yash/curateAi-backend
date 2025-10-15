import { IsEmail, IsOptional, IsString, MaxLength, IsArray } from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

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
  @MaxLength(255)
  companyUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsOptional()
  @IsString()
  education_institution?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skill?: string[];

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  profile?: string;

  @IsOptional()
  workspace_id?: number;

  @IsOptional()
  group_id?: number;
}
