import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// Main application module that configures all feature modules
import { SupabaseModule } from './supabase/supabase.module';
import { ArticlesModule } from './articles/articles.module';
import { GenerateModule } from './generate/generate.module';
import {ConfigModule} from "@nestjs/config";
import {DocumentsModule} from "./documents/documents.module";
import {AiModule} from "./ai/ai.module";
import {HistoryModule} from "./history/history.module";

@Module({
  imports: [SupabaseModule, ArticlesModule,ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
          '.env',
          '../../.env',
      ],
  }),
      GenerateModule,
      DocumentsModule,
      AiModule,
      HistoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
