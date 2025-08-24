import { Body, Controller, Post } from '@nestjs/common';
import { GenerateService } from './generate.service';

@Controller()
export class GenerateController {
    constructor(private readonly service: GenerateService) {}

    @Post('generate')
    async generate(@Body() body: { topic: string }) {
        return this.service.generate(body.topic);
    }
}