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
}