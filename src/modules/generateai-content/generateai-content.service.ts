import { ChatgptService } from 'src/chatgpt/chatgpt.service';
import { Injectable } from '@nestjs/common';
import { GenerateContentDto } from 'src/modules/generateai-content/dto/generateContent.dto';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { TONE_GOAL_PROMPTS } from 'src/constants/tonePrompts';
import { POST_COMMENT_PROMPTS_X_1, POST_COMMENT_PROMPTS_X_2 } from 'src/constants/twitterPrompts';
import { POST_COMMENT_PROMPTS_1, POST_COMMENT_PROMPTS_2 } from 'src/constants/linkedin/linkedinCommentPrompt';
import { POST_PROMPT_1, POST_PROMPT_2, POST_PROMPT_3 } from 'src/constants/linkedin/linkedinPostPrompt';
import { COMMENT_REPLY_PROMPT_1, COMMENT_REPLY_PROMPT_2, COMMENT_REPLY_PROMPT_3 } from 'src/constants/linkedin/linkedinCommentReplyPrompt';
import { COMMENT_GOAL_PROMPTS } from 'src/constants/commentGoalPrompts';
import { POSTINGS_GOAL_PROMPTS } from 'src/constants/postGoalPrompts';
import { extractLinkedInArticleDetails } from 'src/helpers/commonHelper';
import { ARTICLE_COMMENT_PROMPT } from 'src/constants/articlePrompts';
import { ARTICLE_COMMENT_REPLY_PROMPT } from 'src/constants/articleReplyPrompts';
import { MESSAGE_REPLY_PROMPT } from 'src/constants/messageReplyPrompt';
import { UserService } from '../user/user.service';

@Injectable()
export class GenerateaiContentService {

    constructor(
        private readonly ChatgptService: ChatgptService,
        private userService: UserService
    ) { }

    async generateContent(generateContentDto: GenerateContentDto, currentUserId: number) {
        let promptTemplate = "";

        try {
            let {
                contentType, platform, tone, language, model, currentUserName,
                command, postText, authorName, commentAuthorName, commentText,
                goal, articleInfo, lastMessages
            } = generateContentDto;

            // ✅ Global topic/command normalization
            const fallbackPostText = "If no topics are specified, use one of these as your topic: discuss strategies for staying productive and efficient at work; share ideas on how to build and maintain a professional network, both online and offline; discuss how to foster an innovative mindset and encourage creative problem-solving in professional settings.";
            const fallbackCommand = "NOTE: Consider the [default-prompt] to guide the output but prioritize the [user-command] to help optimize the output.";

            postText = postText && postText.trim().length > 0 ? postText : fallbackPostText;
            command = command && command.trim().length > 0 ? command : fallbackCommand;

            switch (contentType) {
                case "comment": {
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
                        postText,
                        authorName: authorName || "Author",
                        tonePrompt: TONE_GOAL_PROMPTS[tone] || "",
                        command,
                        goalPrompt: COMMENT_GOAL_PROMPTS[goal]
                    });
                    break;
                }

                case "create-post": {
                    const postPrompts = [POST_PROMPT_1, POST_PROMPT_2, POST_PROMPT_3];
                    const randomPostPrompt = postPrompts[Math.floor(Math.random() * postPrompts.length)];

                    promptTemplate = await ChatPromptTemplate.fromMessages([
                        ["system", randomPostPrompt],
                        ["user", `Create a LinkedIn post:`],
                    ]).format({
                        currentUserName: currentUserName || "Linkedin User",
                        authorName: authorName || currentUserName,
                        tonePrompt: TONE_GOAL_PROMPTS[tone] || "",
                        postCreationText: postText,
                        command,
                        goalPrompt: POSTINGS_GOAL_PROMPTS[goal]
                    });
                    break;
                }

                case "comment-reply": {
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
                        authorName,
                        commentAuthorName,
                        commentText,
                        postText,
                        currentUserName: currentUserName || "Linkedin User",
                        tonePrompt: TONE_GOAL_PROMPTS[tone] || "",
                        command,
                        goalPrompt: COMMENT_GOAL_PROMPTS[goal]
                    });
                    break;
                }

                case 'article-comment': {
                    const { rawText } = articleInfo;

                    const articleInfoObj = extractLinkedInArticleDetails(rawText);
                    const { author, description: contentHTML, articleTitle } = articleInfoObj;

                    const articleCommentPrompts = [ARTICLE_COMMENT_PROMPT];
                    const randomPrompt = articleCommentPrompts[Math.floor(Math.random() * articleCommentPrompts.length)];

                    promptTemplate = await ChatPromptTemplate.fromMessages([
                        ["system", randomPrompt],
                        ["user", `Please write the article comment:`],
                    ]).format({
                        currentUserName,
                        articleTitle,
                        contentHTML,
                        author,
                        goal,
                        goalPrompt: goal,
                        tone,
                        tonePrompt: tone,
                        summaryText: command,
                        authorName,
                        postText
                    });
                    break;
                }

                case 'article-comment-reply': {
                    const { author, contentHTML, title: articleTitle } = articleInfo;

                    const articleCommentReplyPrompts = [ARTICLE_COMMENT_REPLY_PROMPT];
                    const randomPrompt = articleCommentReplyPrompts[Math.floor(Math.random() * articleCommentReplyPrompts.length)];

                    promptTemplate = await ChatPromptTemplate.fromMessages([
                        ["system", randomPrompt],
                        ["user", `Reply:`],
                    ]).format({
                        commentText,
                        commentAuthorName,
                        author,
                        postText,
                        authorName: author,
                        currentUserName,
                        articleTitle,
                        contentHTML,
                        goal,
                        goalPrompt: goal,
                        tone,
                        tonePrompt: tone,
                        summaryText: command,
                        type: contentType
                    });
                    break;
                }

                case 'message-reply': {
                    let lastMessagesString = "";
                    for (let i = lastMessages.length - 1; i >= 0; i--) {
                        lastMessagesString += `(${lastMessages[i].messageSpeaker === "self" ? currentUserName : authorName}): ${lastMessages[i].messageText}`;
                        if (i != lastMessages.length - 1) lastMessagesString += "\n\n";
                    }

                    promptTemplate = await ChatPromptTemplate.fromMessages([
                        ["system", MESSAGE_REPLY_PROMPT],
                        ["user", `Please provide a message reply:`],
                    ]).format({
                        currentUserName,
                        authorName,
                        goalPrompt: goal,
                        tonePrompt: tone,
                        command,
                        lastMessagesString,
                        postText
                    });
                    break;
                }

                default:
                    throw new Error("Invalid content type");
            }

            // ✅ Add language instruction
            if (language && language.trim()) {
                promptTemplate += `\n\nThe output must be in the ${language.trim()} language.`;
            } else {
                promptTemplate += `\n\nThe output must be in the English language.`;
            }

            const res = await this.ChatgptService.generateContent(promptTemplate, model);
            let gptResponse = res.content.trim();
            if (gptResponse.startsWith('"') && gptResponse.endsWith('"')) {
                gptResponse = gptResponse.slice(1, -1);
            }
            const totalTokensUsed = res.usage_metadata.total_tokens;

            await this.userService.updateUserAiTokenBalance(currentUserId, totalTokensUsed);

            return gptResponse;

        } catch (error) {
            console.error("Error generating content:", error.message);
            throw error;
        }
    }

}
