import { Controller, Post, Body } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
    constructor(private readonly docs: DocumentsService) {}

    @Post()
    async create(
        @Body('title') title: string,
        @Body('content') content: string,
    ) {
        return this.docs.addDocument(title, content);
    }

    @Post('search')
    async search(@Body('query') query: string) {
        return this.docs.searchDocuments(query);
    }
}