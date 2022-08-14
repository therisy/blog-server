import { PostSchema } from '@modules/post/etc/post.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './etc/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostSchema, Comment]),
  ],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
