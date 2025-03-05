import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  post_url: string;

  @IsEnum(["reply", "post", "message"])
  comment_type: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsOptional()
  user_id?: number;
}
