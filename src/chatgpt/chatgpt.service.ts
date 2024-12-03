import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from "@langchain/openai";

@Injectable()
export class ChatgptService {
    async generateContent(prompt: string, selectedModel: string): Promise<any> {
        try {
            let llm = new ChatOpenAI({
                temperature: 0.8,
                maxTokens: 300,
                model: selectedModel,
                maxRetries: 2,
                apiKey : process.env.OPENAI_API_KEY
            });

            const llmResponse = await llm.invoke(prompt!);
            return llmResponse.content;
        } catch (error) {
            console.error('Error generating content:', error);
            throw error;
        }
    }
}