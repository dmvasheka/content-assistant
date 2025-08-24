import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { SupabaseService } from '../supabase/supabase.service';
import { EmbeddingService } from '../embedding/embedding.service';

@Module({
    controllers: [DocumentsController],
    providers: [DocumentsService, SupabaseService, EmbeddingService],
})
export class DocumentsModule {}