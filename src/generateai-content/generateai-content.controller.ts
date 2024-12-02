import { Body, Controller, Post } from '@nestjs/common';
import { GenerateaiContentService } from './generateai-content.service';
import { GenerateContentDto } from 'src/generateai-content/dto/generateContent.dto';

@Controller('')
export class GenerateaiContentController {
    constructor(
        private readonly generateaiContentService: GenerateaiContentService
    ) { }

    @Post('/generate-content')
    async generateContent(@Body() generateContentDto: GenerateContentDto) {
        let res = {
            status: 500,
            message: "internal service error",
            data: {}
        };
        try {
            let response = await this.generateaiContentService.generateContent(generateContentDto);

            if (response) {
                res.status = 200;
                res.message = "Content generated successfully";
                res.data = response;
            }
        } catch (error) {
            res.message = error.message;
        }
        return res;
    }
    
}
