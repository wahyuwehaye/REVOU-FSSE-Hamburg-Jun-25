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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('ADMIN', 'AUTHOR', 'READER')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'AUTHOR', 'READER')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @Roles('ADMIN', 'AUTHOR', 'READER')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser('userId') currentUserId: number,
    @CurrentUser('role') currentUserRole: string,
  ) {
    return this.usersService.update(id, updateUserDto, currentUserId, currentUserRole);
  }

  @Delete(':id')
  @Roles('ADMIN', 'AUTHOR', 'READER')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') currentUserId: number,
    @CurrentUser('role') currentUserRole: string,
  ) {
    return this.usersService.remove(id, currentUserId, currentUserRole);
  }
}
