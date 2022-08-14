import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSessionDto } from './etc/create-session.dto';
import { SessionService } from './session.service';

@Controller('session')
@ApiTags('Session')
export class SessionController {
    constructor(
        private readonly service: SessionService,
    ) {}

    @Post()
    async create(@Body() dto: CreateSessionDto) {
        return await this.service.create(dto);
    }
}
