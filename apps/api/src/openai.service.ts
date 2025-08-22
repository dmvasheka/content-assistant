import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
    private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    async createEmbedding(text: string) {
        const res = await this.client.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
        });
        return res.data[0].embedding;
    }

    async generateDraft(topic: string, docs: { title: string; content: string }[]) {
        const context = docs.map(d => `${d.title}: ${d.content}`).join("\n\n");
        const res = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a content assistant for blogs." },
                { role: "user", content: `Write a draft about: ${topic}\nUse context:\n${context}` }
            ]
        });
        return res.choices[0].message?.content ?? "";
    }
}
