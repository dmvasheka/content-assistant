import { Module } from '@nestjs/common';
import { GenerateController } from './generate.controller';
import { GenerateService } from './generate.service';
import { DocumentsModule } from '../documents/documents.module';

@Module({
    imports: [DocumentsModule], // Импортируем для доступа к DocumentsService
    controllers: [GenerateController],
    providers: [GenerateService],
})
export class GenerateModule {}