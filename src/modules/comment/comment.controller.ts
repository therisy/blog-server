import { User } from '@decorators/user.decorator';
import { JwtGuard } from '@guards/jwt.guard';
import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './etc/create-comment.dto';
import { UpdateCommentDto } from './etc/update-comment.dto';

@Controller('comment')
@ApiTags('Comment')
export class CommentController {
    constructor(
        private readonly service: CommentService,
    ) {}

    @Post(':id')
    @UseGuards(JwtGuard)
    async create(
        @Param('id') id: string,
        @Body() dto: CreateCommentDto,
        @User() user,
    ) {
        return this.service.create(id, dto, user);
    }

    @Patch(':id')
    @UseGuards(JwtGuard)
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateCommentDto,
        @User() user,
    ) {
        return this.service.update(id, dto, user);
    }

    @Delete(':id')
    @UseGuards(JwtGuard)
    async delete(
        @Param('id') id: string,
        @User() user,
    ) {
        return this.service.delete(id, user);
    }
}
