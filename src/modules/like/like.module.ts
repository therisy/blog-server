import { PostSchema } from '@modules/post/etc/post.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './etc/like.entities';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostSchema, Like]),
  ],
  controllers: [LikeController],
  providers: [LikeService]
})
export class LikeModule {}
