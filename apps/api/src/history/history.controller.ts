import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { HistoryService, GenerationHistoryRecord } from './history.service';

@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) {}

    @Get()
    async getHistory(@Query('limit') limit?: string): Promise<GenerationHistoryRecord[]> {
        const limitNum = limit ? parseInt(limit, 10) : 20;
        return this.historyService.getHistory(limitNum);
    }

    @Get('search')
    async searchHistory(
        @Query('q') searchTerm: string,
        @Query('limit') limit?: string
    ): Promise<GenerationHistoryRecord[]> {
        if (!searchTerm) {
            return [];
        }
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.historyService.searchHistory(searchTerm, limitNum);
    }

    @Get(':id')
    async getGenerationById(@Param('id') id: string): Promise<GenerationHistoryRecord | null> {
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            return null;
        }
        return this.historyService.getGenerationById(idNum);
    }

    @Post()
    async saveGeneration(@Body() body: {
        topic: string;
        draft: string;
        citations: any[];
    }): Promise<GenerationHistoryRecord> {
        return this.historyService.saveGeneration(body.topic, body.draft, body.citations);
    }
}