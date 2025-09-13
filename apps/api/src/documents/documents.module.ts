import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { SupabaseService } from '../supabase/supabase.service';
import { EmbeddingService } from '../embedding/embedding.service';
import {SupabaseModule} from "../supabase/supabase.module";

@Module({
    imports: [SupabaseModule],
    controllers: [DocumentsController],
    providers: [DocumentsService, EmbeddingService],
    exports: [DocumentsService], // Экспортируем для использования в других модулях
})
export class DocumentsModule {}