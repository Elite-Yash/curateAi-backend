// create-automation-process.dto.ts
import { IsInt, IsString } from 'class-validator';

export class CreateAutomationProcessDto {
  @IsInt()
  campaign_id: number;

  @IsString()
  name: string;
}