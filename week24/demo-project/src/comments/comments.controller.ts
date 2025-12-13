import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('posts/:postId/comments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Public()
  @Get()
  findByPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentsService.findByPost(postId);
  }

  @Post()
  @Roles('ADMIN', 'AUTHOR', 'READER')
  create(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser('userId') userId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(postId, userId, createCommentDto);
  }
}

@Controller('comments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommentsManagementController {
  constructor(private readonly commentsService: CommentsService) {}

  @Patch(':id')
  @Roles('ADMIN', 'AUTHOR', 'READER')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser('userId') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    return this.commentsService.update(id, updateCommentDto, userId, userRole);
  }

  @Delete(':id')
  @Roles('ADMIN', 'AUTHOR', 'READER')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    return this.commentsService.remove(id, userId, userRole);
  }
}
