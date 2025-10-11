import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePersonaDto {
  @IsNotEmpty({ message: 'Persona name is required' })
  @IsString()
  personas_name: string;

  @IsOptional()
  @IsString()
  personas_bio?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsString()
  @IsNotEmpty()
  user_id: number;

  @IsOptional()
  @IsBoolean()
  isdefault?: boolean;
}

