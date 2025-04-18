import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCrmDto {
  @IsString()
  @IsNotEmpty()
  crm_name: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  crm_url: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}
