import { Controller, Get, Post, Body } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    @Get()
    async getAll() {
        return this.articlesService.getAll();
    }

    @Post()
    async create(@Body() dto: { title: string; content: string }) {
        return this.articlesService.create(dto.title, dto.content);
    }
}