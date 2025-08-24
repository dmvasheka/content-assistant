import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

type Citation = { id: string; url?: string; quote: string };
type GenerateResponse = { draft: string; citations: Citation[] };

@Injectable()
export class GenerateService {
    private client: OpenAI | null = null;

    constructor() {
        const key = process.env.OPENAI_API_KEY;
        if (key) this.client = new OpenAI({ apiKey: key });
    }

    async generate(topic: string): Promise<GenerateResponse> {
        // Фоллбек без OpenAI — полезно на раннем этапе
        if (!this.client) {
            return {
                draft: `# ${topic}\n\nЭто мок-черновик. Добавьте ключ OPENAI_API_KEY, чтобы получать реальный контент.\n\n[1]`,
                citations: [
                    { id: '1', quote: 'Пример факта из документа.', url: 'https://example.com' },
                ],
            };
        }

        const prompt = [
            { role: 'system', content: 'Ты русскоязычный ассистент по контенту. Пиши кратко, в Markdown. Всегда добавляй факт-ссылки вида [1], [2] и верни JSON {draft, citations}.' },
            { role: 'user', content: `Тема: ${topic}\nНапиши краткий черновик (6–10 абзацев) и 2–4 цитаты-источника.` },
        ] as OpenAI.Chat.ChatCompletionMessageParam[];

        const res = await this.client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: prompt,
            response_format: { type: 'json_object' },
            temperature: 0.7,
        });

        const content = res.choices[0]?.message?.content || '{}';
        // Ожидаем JSON вида { draft: string, citations: [{id, quote, url?}] }
        try {
            const parsed = JSON.parse(content) as GenerateResponse;
            if (!parsed.draft) throw new Error('bad shape');
            return parsed;
        } catch {
            // если модель вернула не-JSON — оборачиваем вручную
            return {
                draft: content,
                citations: [],
            };
        }
    }
}