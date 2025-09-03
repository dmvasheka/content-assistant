import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import {SupabaseModule} from "../supabase/supabase.module";

@Module({
    imports: [SupabaseModule],
    providers: [ArticlesService],
    controllers: [ArticlesController],
})
export class ArticlesModule {}