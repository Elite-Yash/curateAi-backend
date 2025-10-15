import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateWorkspaceGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  workspaceId: number;
}
