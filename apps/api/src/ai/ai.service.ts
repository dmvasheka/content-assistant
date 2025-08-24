import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
    private client: OpenAI;

    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async generateDraft(topic: string): Promise<string> {
        const response = await this.client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a writing assistant. Generate blog drafts with structured paragraphs.' },
                { role: 'user', content: `Write a blog draft about: ${topic}` },
            ],
        });

        return response.choices[0].message.content ?? '';
    }
}