import { IsNotEmpty, IsString } from 'class-validator';

export class addToCRM {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  title: string;

  @IsString()
  industry: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  crm_url: string;
}
