import { ChatgptService } from 'src/chatgpt/chatgpt.service';
import { Injectable } from '@nestjs/common';
import { GenerateContentDto } from 'src/generateai-content/dto/generateContent.dto';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { TONE_GOAL_PROMPTS } from 'src/constants/tonePrompts';
import { POST_COMMENT_PROMPTS_X_1, POST_COMMENT_PROMPTS_X_2 } from 'src/constants/twitterPrompts';
import { POST_COMMENT_PROMPTS_1, POST_COMMENT_PROMPTS_2 } from 'src/constants/linkedin/linkedinCommentPrompt';
import { POST_PROMPT_1, POST_PROMPT_2, POST_PROMPT_3 } from 'src/constants/linkedin/linkedinPostPrompt';
import { COMMENT_REPLY_PROMPT_1, COMMENT_REPLY_PROMPT_2, COMMENT_REPLY_PROMPT_3 } from 'src/constants/linkedin/linkedinCommentReplyPrompt';
import { COMMENT_GOAL_PROMPTS } from 'src/constants/commentGoalPrompts';
import { POSTINGS_GOAL_PROMPTS } from 'src/constants/postGoalPrompts';

@Injectable()
export class GenerateaiContentService {

    constructor(
        private readonly ChatgptService: ChatgptService
    ) { }
    async generateContent(generateContentDto: GenerateContentDto) {
        let promptTemplate = "";

        try {
            const { contentType, platform, tone, language, model, currentUserName, command, postText, authorName, commentAuthorName, commentText, goal } = generateContentDto;

            switch (contentType) {
                case "comment":
                    const postCommentPrompts =
                        platform === "linkedin"
                            ? [POST_COMMENT_PROMPTS_1, POST_COMMENT_PROMPTS_2]
                            : platform === "twitter"
                                ? [POST_COMMENT_PROMPTS_X_1, POST_COMMENT_PROMPTS_X_2]
                                : [];

                    if (!postCommentPrompts.length) {
                        throw new Error("Unsupported platform for comments");
                    }

                    const randomCommentPrompt = postCommentPrompts[Math.floor(Math.random() * postCommentPrompts.length)];

                    promptTemplate = await ChatPromptTemplate.fromMessages([
                        ["system", randomCommentPrompt],
                        ["user", `Comment:`],
                    ]).format({
                        currentUserName: currentUserName || "Linkedin User",
                        postText: postText || "",
                        authorName: authorName || "Author",
                        tonePrompt: TONE_GOAL_PROMPTS[tone] || "",
                        command: command || "",
                        goalPrompt: COMMENT_GOAL_PROMPTS[goal]                        
                    });
                    break;

                case "create-post":
                    const postPrompts = [POST_PROMPT_1, POST_PROMPT_2, POST_PROMPT_3];
                    const randomPostPrompt = postPrompts[Math.floor(Math.random() * postPrompts.length)];

                    console.log("TONE_GOAL_PROMPTS[tone]", TONE_GOAL_PROMPTS[tone]);
                    promptTemplate = await ChatPromptTemplate.fromMessages([
                        ["system", randomPostPrompt],
                        ["user", `Create a LinkedIn post:`],
                    ]).format({
                        currentUserName: currentUserName || "Linkedin User",
                        authorName: authorName ,
                        tonePrompt: TONE_GOAL_PROMPTS[tone] || "",
                        postCreationText: postText || postText.length === 0 ? "If no topics are specified, use one of these as your topic: discuss strategies for staying productive and efficient at work; share ideas on how to build and maintain a professional network, both online and offline; discuss how to foster an innovative mindset and encourage creative problem-solving in professional settings." : postText,
                        command: command || command.length === 0 ? "NOTE: Consider the [default-prompt] to guide the output but prioritize the [user-command] to help optimize the output." : command,
                        goalPrompt: POSTINGS_GOAL_PROMPTS[goal]
                    });
                    break;

                case "comment-reply":
                    const commentReplyPrompts = [
                        COMMENT_REPLY_PROMPT_1,
                        COMMENT_REPLY_PROMPT_2,
                        COMMENT_REPLY_PROMPT_3,
                    ];

                    const randomPrompt = commentReplyPrompts[Math.floor(Math.random() * commentReplyPrompts.length)];

                    promptTemplate = await ChatPromptTemplate.fromMessages([
                        ["system", randomPrompt],
                        ["user", `Reply:`],
                    ]).format({
                        authorName: authorName,
                        commentAuthorName: commentAuthorName,
                        commentText: commentText,
                        postText: postText,
                        currentUserName: currentUserName || "Linkedin User",
                        tonePrompt: tone,
                        command: command,
                        goalPrompt: COMMENT_GOAL_PROMPTS[goal]
                    });

                    break;

                default:
                    throw new Error("Invalid content type");
            }

            if (language && language.trim()) {
                promptTemplate += `\n\nThe output must be in the ${language.trim()} language.`;
            } else {
                promptTemplate += `\n\nThe output must be in the English language.`;
            }

            const res = await this.ChatgptService.generateContent(promptTemplate, model);
            return res;
        } catch (error) {
            console.error("Error generating content:", error.message);
            throw error;
        }
    }

}
