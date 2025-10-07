import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Comment type ke liye enum
export enum CommentType {
  COMMENT_REPLY = 'comment-reply',
  COMMENT = 'comment',
  ARTICLE_COMMENT = 'article-comment',
  ARTICLE_COMMENT_REPLY = 'article-comment-reply',
  MESSAGE_REPLY = 'message-reply',
  CREATE_POST = 'create-post',
}

// Status ke liye enum
export enum CommentStatus {
  SAVED = 'saved',
  PUBLISHED = 'published',
}

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  post_url: string;

  @IsEnum(CommentType)
  comment_type: CommentType;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsOptional()
  user_id?: number;

  @IsOptional()
  @IsString()
  motive?: string;

  @IsOptional()
  @IsString()
  tone?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsEnum(CommentStatus)
  status?: CommentStatus = CommentStatus.PUBLISHED;

  @IsOptional()
  @IsString()
  genarateTitle?: string;
}