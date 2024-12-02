import { ChatgptService } from 'src/chatgpt/chatgpt.service';
import { Injectable } from '@nestjs/common';
import { GenerateCommentDto } from 'src/generateai-content/dto/generateComment.dto';
import { POST_COMMENT_PROMPTS_1, POST_COMMENT_PROMPTS_2 } from 'src/constants/linkedinPrompts';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { TONE_GOAL_PROMPTS } from 'src/constants/tonePrompts';
import { POST_COMMENT_PROMPTS_X_1, POST_COMMENT_PROMPTS_X_2 } from 'src/constants/twitterPrompts';

@Injectable()
export class GenerateaiContentService {

    constructor(
        private readonly ChatgptService: ChatgptService
    ) { }
    async generateComment(generateCommentDto: GenerateCommentDto) {

        let postCommentPromts = [];
        if (generateCommentDto.type === 'linkedin') {
            postCommentPromts = [
                POST_COMMENT_PROMPTS_1,
                POST_COMMENT_PROMPTS_2,
            ];
        } else if (generateCommentDto.type === 'twitter') {
            postCommentPromts = [
                POST_COMMENT_PROMPTS_X_1,
                POST_COMMENT_PROMPTS_X_2,
            ];
        }

        const randomPrompt = postCommentPromts[Math.floor(Math.random() * postCommentPromts.length)];

        let promptTemplate = await ChatPromptTemplate.fromMessages([
            ["system", randomPrompt],
            ["user", `Comment:`],
        ]).format({
            currentUserName: (generateCommentDto.currentUserName) ? generateCommentDto.currentUserName : "X user",
            postText: generateCommentDto.postText,
            authorName: generateCommentDto.authorName,
            tonePrompt: TONE_GOAL_PROMPTS[generateCommentDto.tone],
            command: generateCommentDto.command ? generateCommentDto.command : "",
        });


        if (generateCommentDto.language && generateCommentDto.language != "") {
            promptTemplate += `\n\nThe output must be in the ${generateCommentDto.language} language.`;
    
        } else {
            promptTemplate += `\n\nThe output must be in the English language.`;
    
        }
        let selectedModel = generateCommentDto.model;

        let res = await this.ChatgptService.generateContent(promptTemplate, selectedModel);
        return res;
    }
}
