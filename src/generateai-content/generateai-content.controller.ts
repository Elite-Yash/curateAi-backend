import { Body, Controller, Post } from '@nestjs/common';
import { GenerateaiContentService } from './generateai-content.service';
import { GenerateCommentDto } from 'src/generateai-content/dto/generateComment.dto';

@Controller('')
export class GenerateaiContentController {
    constructor(
        private readonly generateaiContentService: GenerateaiContentService
    ) { }

    @Post('/generate-comment')
    async generateContent(@Body() generateCommentDto: GenerateCommentDto) {
        let res = {
            status: 500,
            message: "internal service error",
            data: {}
        };
        try {
            let response = await this.generateaiContentService.generateComment(generateCommentDto);

            if (response) {
                res.status = 200;
                res.message = "Comment generated successfully";
                res.data = response;
            }
        } catch (error) {
            res.message = error.message;
        }
        return res;
    }
}
