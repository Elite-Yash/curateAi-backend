import { Injectable } from '@nestjs/common';
import { ChatgptService } from 'src/chatgpt/chatgpt.service';
import { GenerateCommentDto } from './dto/generateComment.dto';
import { POST_COMMENT_PROMPTS_1, POST_COMMENT_PROMPTS_2 } from 'src/constants/linkedinPrompts';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { TONE_GOAL_PROMPTS } from '../constants/tonePrompts';

@Injectable()
export class LinkedinService {
    constructor(
        private readonly chatgptService: ChatgptService
    ) { }

    async generateComment(generateCommentDto: GenerateCommentDto) {
        const postCommentPromts = [
            POST_COMMENT_PROMPTS_1,
            POST_COMMENT_PROMPTS_2,
        ];

        const randomPrompt = postCommentPromts[Math.floor(Math.random() * postCommentPromts.length)];

        let promptTemplate = await ChatPromptTemplate.fromMessages([
            ["system", randomPrompt],
            ["user", `Comment:`],
        ]).format({
            currentUserName: generateCommentDto.currentUserName,
            postText: generateCommentDto.postText,
            authorName: generateCommentDto.authorName,
            tonePrompt:  TONE_GOAL_PROMPTS[generateCommentDto.tone],
            command: "",
        });

        let selectedModel = generateCommentDto.model;
        

        let res = await this.chatgptService.generateContent(promptTemplate, selectedModel);
        return res;
    }
}
