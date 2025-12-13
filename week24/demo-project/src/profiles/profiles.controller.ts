import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('user/:userId')
  @Roles('ADMIN', 'AUTHOR', 'READER')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.profilesService.findByUserId(userId);
  }

  @Post()
  @Roles('ADMIN', 'AUTHOR', 'READER')
  create(@CurrentUser('userId') userId: number, @Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(userId, createProfileDto);
  }

  @Patch(':userId')
  @Roles('ADMIN', 'AUTHOR', 'READER')
  update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser('userId') currentUserId: number,
    @CurrentUser('role') currentUserRole: string,
  ) {
    return this.profilesService.update(userId, updateProfileDto, currentUserId, currentUserRole);
  }

  @Delete(':userId')
  @Roles('ADMIN', 'AUTHOR', 'READER')
  remove(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser('userId') currentUserId: number,
    @CurrentUser('role') currentUserRole: string,
  ) {
    return this.profilesService.remove(userId, currentUserId, currentUserRole);
  }
}
