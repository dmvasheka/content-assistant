import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ArticlesService {
    constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

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
}