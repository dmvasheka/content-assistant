import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
    imports: [SupabaseModule],
    controllers: [HistoryController],
    providers: [HistoryService],
    exports: [HistoryService],
})
export class HistoryModule {}