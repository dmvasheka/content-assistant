import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { AiService } from "../ai/ai.service";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable()
export class ArticlesService {
    private supabase: SupabaseClient;
    
    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly aiService: AiService
    ) {
        this.supabase = this.supabaseService.getClient();
    }

    async getAll() {
        const { data, error } = await this.supabase.from('articles').select('*');
        if (error) throw error;
        return data;
    }

    async create(title: string, content: string) {
        const { data, error } = await this.supabase
            .from('articles')
            .insert([{ title, content }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async generateDraft(topic: string) {
        const content = await this.aiService.generateDraft(topic);

        const { data, error } = await this.supabase
            .from('articles')
            .insert([{ title: topic, content, status: 'draft' }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}