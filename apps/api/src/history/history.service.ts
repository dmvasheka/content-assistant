import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export interface GenerationHistoryRecord {
    id?: number;
    topic: string;
    draft: string;
    citations: any[];
    created_at?: string;
}

@Injectable()
export class HistoryService {
    constructor(private readonly supabase: SupabaseService) {}

    async saveGeneration(topic: string, draft: string, citations: any[]): Promise<GenerationHistoryRecord> {
        console.log('[HistoryService] Saving generation:', topic);
        console.log('[HistoryService] Citations count:', citations?.length || 0);

        const { data, error } = await this.supabase.getClient()
            .from('generation_history')
            .insert([{
                topic,
                draft,
                citations: JSON.stringify(citations)
            }])
            .select()
            .single();

        if (error) {
            console.error('[HistoryService] Save error:', error);
            throw error;
        }

        console.log('[HistoryService] Generation saved with ID:', data.id);
        return data;
    }

    async getHistory(limit: number = 20): Promise<GenerationHistoryRecord[]> {
        console.log('[HistoryService] Fetching history, limit:', limit);

        const { data, error } = await this.supabase.getClient()
            .from('generation_history')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('[HistoryService] Fetch error:', error);
            throw error;
        }

        // Parse JSON citations
        const parsedData = data.map(record => ({
            ...record,
            citations: typeof record.citations === 'string' ?
                JSON.parse(record.citations) : record.citations
        }));

        console.log('[HistoryService] Retrieved', parsedData.length, 'records');
        return parsedData;
    }

    async getGenerationById(id: number): Promise<GenerationHistoryRecord | null> {
        console.log('[HistoryService] Fetching generation by ID:', id);

        const { data, error } = await this.supabase.getClient()
            .from('generation_history')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            console.error('[HistoryService] Fetch by ID error:', error);
            throw error;
        }

        // Parse JSON citations
        const parsedData = {
            ...data,
            citations: typeof data.citations === 'string' ?
                JSON.parse(data.citations) : data.citations
        };

        return parsedData;
    }

    async searchHistory(searchTerm: string, limit: number = 10): Promise<GenerationHistoryRecord[]> {
        console.log('[HistoryService] Searching history for:', searchTerm);

        const { data, error } = await this.supabase.getClient()
            .from('generation_history')
            .select('*')
            .or(`topic.ilike.%${searchTerm}%,draft.ilike.%${searchTerm}%`)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('[HistoryService] Search error:', error);
            throw error;
        }

        // Parse JSON citations
        const parsedData = data.map(record => ({
            ...record,
            citations: typeof record.citations === 'string' ?
                JSON.parse(record.citations) : record.citations
        }));

        console.log('[HistoryService] Search found', parsedData.length, 'records');
        return parsedData;
    }
}