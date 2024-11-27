import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateCommentDto {
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
}
