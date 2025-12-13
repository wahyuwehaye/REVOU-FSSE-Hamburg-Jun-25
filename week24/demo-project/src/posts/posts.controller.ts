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
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('posts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Public()
  @Get()
  findAll(@Query('published', new ParseBoolPipe({ optional: true })) published?: boolean) {
    return this.postsService.findAll(published);
  }

  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'AUTHOR')
  create(@CurrentUser('userId') userId: number, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(userId, createPostDto);
  }

  @Patch(':id')
  @Roles('ADMIN', 'AUTHOR')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser('userId') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    return this.postsService.update(id, updatePostDto, userId, userRole);
  }

  @Delete(':id')
  @Roles('ADMIN', 'AUTHOR')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    return this.postsService.remove(id, userId, userRole);
  }

  @Post(':postId/tags/:tagId')
  @Roles('ADMIN', 'AUTHOR')
  addTag(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('tagId', ParseIntPipe) tagId: number,
    @CurrentUser('userId') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    return this.postsService.addTag(postId, tagId, userId, userRole);
  }

  @Delete(':postId/tags/:tagId')
  @Roles('ADMIN', 'AUTHOR')
  removeTag(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('tagId', ParseIntPipe) tagId: number,
    @CurrentUser('userId') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    return this.postsService.removeTag(postId, tagId, userId, userRole);
  }
}
