import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { EmbeddingService } from '../embedding/embedding.service';

@Injectable()
export class DocumentsService {
    constructor(
        private readonly supabase: SupabaseService,
        private readonly embedding: EmbeddingService,
    ) {}

    async addDocument(title: string, content: string) {
        const vector = await this.embedding.embedText(content);

        const { error } = await this.supabase.getClient()
            .from('documents')
            .insert([{ title, content, embedding: vector }]);

        if (error) throw error;
        return { success: true };
    }

    async searchDocuments(query: string) {
        // 1. Получаем embedding для запроса
        const queryEmbedding = await this.embedding.embedText(query);

        // 2. Делаем поиск по вектору в Supabase (cosine similarity)
        const { data, error } = await this.supabase.getClient().rpc('match_documents', {
            query_embedding: queryEmbedding,
            match_count: 5,
        });

        if (error) throw error;
        return data;
    }
}