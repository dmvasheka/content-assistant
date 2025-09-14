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

        console.log('[DocumentsService] Adding document:', title);
        console.log('[DocumentsService] Vector length:', vector.length);
        console.log('[DocumentsService] Vector type:', typeof vector);
        console.log('[DocumentsService] First 3 values:', vector.slice(0, 3));

        // Convert to pgvector string format: [1,2,3,...]
        const vectorString = `[${vector.join(',')}]`;
        console.log('[DocumentsService] Vector string preview:', vectorString.substring(0, 50) + '...');

        const { error } = await this.supabase.getClient()
            .from('documents')
            .insert([{
                title,
                content,
                embedding: vectorString // Send as pgvector formatted string
            }]);

        if (error) {
            console.error('[DocumentsService] Insert error:', error);
            throw error;
        }
        return { success: true };
    }

    async searchDocuments(query: string) {
        // 1. Получаем embedding для запроса
        const queryEmbedding = await this.embedding.embedText(query);

        console.log('[DocumentsService] Searching for:', query);
        console.log('[DocumentsService] Query embedding length:', queryEmbedding.length);

        // 2. Делаем поиск по вектору в Supabase (cosine similarity)
        // Convert query to pgvector string format
        const queryVectorString = `[${queryEmbedding.join(',')}]`;
        console.log('[DocumentsService] Query vector preview:', queryVectorString.substring(0, 50) + '...');

        const { data, error } = await this.supabase.getClient().rpc('match_documents', {
            query_embedding: queryVectorString, // Send as pgvector formatted string
            match_count: 5,
        });

        if (error) {
            console.error('[DocumentsService] Search error:', error);
            throw error;
        }

        console.log('[DocumentsService] Search found:', data?.length || 0, 'documents');
        return data;
    }
}