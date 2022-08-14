import { User } from '@decorators/user.decorator';
import { JwtGuard } from '@guards/jwt.guard';
import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('like')
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
