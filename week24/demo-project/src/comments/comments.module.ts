import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController, CommentsManagementController } from './comments.controller';

@Module({
  controllers: [CommentsController, CommentsManagementController],
  providers: [CommentsService],
})
export class CommentsModule {}
