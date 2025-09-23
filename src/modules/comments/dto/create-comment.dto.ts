import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  post_url: string;

  @IsEnum([
    'comment-reply',
    'comment',
    'article-comment',
    'article-comment-reply',
    'message-reply',
    'create-post',
    'comment',
    'comment-reply',
  ])
  comment_type: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsOptional()
  user_id?: number;
}
