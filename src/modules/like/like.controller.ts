import { User } from '@decorators/user.decorator';
import { JwtGuard } from '@guards/jwt.guard';
import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LikeService } from './like.service';

@Controller('like')
@ApiTags('Like')
export class LikeController {
    constructor(
        private readonly service: LikeService,
    ) {}

    @Post(':id')
    @UseGuards(JwtGuard)
    async like(
        @Param('id') id: string,
        @User() user,
    ) {
        return this.service.like(id, user);
    }
}
