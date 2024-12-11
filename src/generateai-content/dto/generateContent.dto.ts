import { IsString, IsNotEmpty, IsOptional, isNotEmpty, IsObject, IsArray } from 'class-validator';
export class GenerateContentDto {
    @IsString()
    @IsNotEmpty()
    postText: string;

    @IsString()
    @IsNotEmpty()
    authorName: string;

    @IsString()
    @IsNotEmpty()
    currentUserName: string;

    @IsString()
    @IsNotEmpty()
    tone: string;


    @IsString()
    @IsNotEmpty()
    language: string;

    @IsString()
    @IsNotEmpty()
    model: string;

    @IsString()
    @IsNotEmpty()
    platform: string;

    @IsString()
    @IsNotEmpty()
    command: string;

    @IsString()
    @IsNotEmpty()
    contentType: string;

    @IsString()
    @IsOptional()
    commentAuthorName: string;

    @IsString()
    @IsOptional()
    commentText: string;

    @IsString()
    @IsNotEmpty()
    goal: string;

    @IsObject()
    @IsOptional()
    articleInfo: Record<string, any>;

    @IsArray()
    @IsObject({ each: true }) // Ensures each item in the array is an object
    @IsOptional()
    lastMessages?: Record<string, any>[];
}
