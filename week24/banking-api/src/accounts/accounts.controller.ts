import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, UpdateAccountDto } from './dto/account.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @Roles(Role.TELLER, Role.MANAGER, Role.ADMIN)
  create(@Body() dto: CreateAccountDto, @CurrentUser() user: any) {
    return this.accountsService.create(dto, user.id, user.role);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.accountsService.findAll(user.id, user.role);
  }

  @Get('balance/:accountNumber')
  getBalance(@Param('accountNumber') accountNumber: string, @CurrentUser() user: any) {
    return this.accountsService.getBalance(accountNumber, user.id, user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.accountsService.findOne(+id, user.id, user.role);
  }

  @Patch(':id')
  @Roles(Role.MANAGER, Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateAccountDto, @CurrentUser() user: any) {
    return this.accountsService.update(+id, dto, user.id, user.role);
  }

  @Delete(':id')
  @Roles(Role.MANAGER, Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.accountsService.remove(+id, user.id, user.role);
  }
}
