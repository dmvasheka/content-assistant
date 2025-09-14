import { Injectable, Inject, Optional } from '@nestjs/common';
import OpenAI from 'openai';
import { DocumentsService } from '../documents/documents.service';
import { HistoryService } from '../history/history.service';

type Citation = { id: string; url?: string; quote: string; title: string };
type GenerateResponse = { draft: string; citations: Citation[] };

@Injectable()
export class GenerateService {
    private client: OpenAI | null = null;

    constructor(
        private readonly documentsService: DocumentsService,
        @Optional() private readonly historyService?: HistoryService
    ) {
        const key = process.env.OPENAI_API_KEY;
        if (key) this.client = new OpenAI({ apiKey: key });
    }

    async generate(topic: string): Promise<GenerateResponse> {
        // Шаг 1: Поиск релевантных документов по теме
        console.log(`[RAG] Поиск документов по теме: "${topic}"`);
        const relevantDocs = await this.documentsService.searchDocuments(topic);
        
        // Фоллбек без OpenAI — но с найденными документами
        if (!this.client) {
            const mockCitations = relevantDocs.slice(0, 3).map((doc, index) => ({
                id: String(index + 1),
                title: doc.title,
                quote: doc.content.substring(0, 100) + '...',
                url: `#doc-${doc.id}`,
            }));

            const fallbackResponse = {
                draft: `# ${topic}\n\nЭто мок-черновик с реальными источниками.\n\nНайдено документов: ${relevantDocs.length}\n\n${mockCitations.map(c => `[${c.id}] ${c.quote}`).join('\n\n')}\n\n## Источники\n${mockCitations.map(c => `[${c.id}] ${c.title}`).join('\n')}`,
                citations: mockCitations,
            };

            // Save fallback to history too
            try {
                if (this.historyService) {
                    await this.historyService.saveGeneration(topic, fallbackResponse.draft, fallbackResponse.citations);
                    console.log(`[RAG] Fallback генерация сохранена в историю`);
                }
            } catch (historyError) {
                console.error(`[RAG] Ошибка сохранения fallback в историю:`, historyError);
            }

            return fallbackResponse;
        }

        // Шаг 2: Подготовка контекста из найденных документов
        const context = relevantDocs.slice(0, 5).map((doc, index) => 
            `[Документ ${index + 1}] ${doc.title}\n${doc.content}`
        ).join('\n\n---\n\n');

        console.log(`[RAG] Найдено ${relevantDocs.length} релевантных документов`);

        // Шаг 3: Генерация статьи с использованием RAG
        const prompt = [
            { 
                role: 'system', 
                content: `Ты русскоязычный ассистент по контенту. Твоя задача — написать черновик статьи НА ОСНОВЕ ПРЕДОСТАВЛЕННЫХ ИСТОЧНИКОВ.

ОБЯЗАТЕЛЬНЫЕ ПРАВИЛА:
1. Используй ТОЛЬКО информацию из предоставленных документов
2. Каждое утверждение должно содержать ссылку на источник [1], [2], [3] и т.д.
3. НЕ выдумывай факты — если информации недостаточно, так и напиши
4. Формат ответа: JSON {"draft": "текст статьи", "citations": [{"id": "1", "title": "название документа", "quote": "цитата из документа"}]}
5. В draft используй Markdown форматирование
6. Максимум 3-5 цитат из самых релевантных частей документов`
            },
            { 
                role: 'user', 
                content: `Тема статьи: ${topic}

Доступные источники:
${context}

Напиши черновик статьи с обязательными ссылками на источники.`
            },
        ] as OpenAI.Chat.ChatCompletionMessageParam[];

        const res = await this.client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: prompt,
            response_format: { type: 'json_object' },
            temperature: 0.3, // Низкая температура для точности
            max_tokens: 2000,
        });

        const content = res.choices[0]?.message?.content || '{}';
        
        try {
            const parsed = JSON.parse(content) as GenerateResponse;
            
            // Валидация структуры ответа
            if (!parsed.draft) {
                throw new Error('Отсутствует поле draft');
            }
            
            // Обогащение цитат данными из реальных документов
            if (parsed.citations && Array.isArray(parsed.citations)) {
                parsed.citations = parsed.citations.map((citation, index) => ({
                    ...citation,
                    id: citation.id || String(index + 1),
                    title: citation.title || relevantDocs[index]?.title || 'Неизвестный источник',
                    url: `#doc-${relevantDocs[index]?.id || index}`,
                }));
            } else {
                // Fallback цитаты из найденных документов
                parsed.citations = relevantDocs.slice(0, 3).map((doc, index) => ({
                    id: String(index + 1),
                    title: doc.title,
                    quote: doc.content.substring(0, 150) + '...',
                    url: `#doc-${doc.id}`,
                }));
            }
            
            console.log(`[RAG] Сгенерирована статья с ${parsed.citations.length} цитатами`);

            // Save to generation history
            try {
                if (this.historyService) {
                    await this.historyService.saveGeneration(topic, parsed.draft, parsed.citations);
                    console.log(`[RAG] Генерация сохранена в историю`);
                }
            } catch (historyError) {
                console.error(`[RAG] Ошибка сохранения в историю:`, historyError);
                // Don't fail the generation if history save fails
            }

            return parsed;
            
        } catch (error) {
            console.error('[RAG] Ошибка парсинга JSON:', error);
            
            // Fallback при ошибке парсинга
            const fallbackCitations = relevantDocs.slice(0, 3).map((doc, index) => ({
                id: String(index + 1),
                title: doc.title,
                quote: doc.content.substring(0, 100) + '...',
                url: `#doc-${doc.id}`,
            }));

            return {
                draft: `# ${topic}\n\n${content}\n\n## Источники\n${fallbackCitations.map(c => `[${c.id}] ${c.title}`).join('\n')}`,
                citations: fallbackCitations,
            };
        }
    }
}