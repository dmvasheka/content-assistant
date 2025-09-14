import { Module } from '@nestjs/common';
import { GenerateController } from './generate.controller';
import { GenerateService } from './generate.service';
import { DocumentsModule } from '../documents/documents.module';
import { HistoryModule } from '../history/history.module';

@Module({
    imports: [DocumentsModule, HistoryModule],
    controllers: [GenerateController],
    providers: [GenerateService],
})
export class GenerateModule {}