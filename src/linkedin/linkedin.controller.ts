import { Body, Controller, Post } from '@nestjs/common';
import { LinkedinService } from './linkedin.service';
import { GenerateCommentDto } from './dto/generateComment.dto';

@Controller('linkedin')
export class LinkedinController {
    constructor(
        private readonly linkedinService: LinkedinService
    ) { }

    @Post('/generate-comment')
    async generateContent(@Body() generateCommentDto: GenerateCommentDto) {
        let res = {
            status: 500,
            message: "internal service error",
            data: {}
        };
        try {
            let response = await this.linkedinService.generateComment(generateCommentDto);

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
