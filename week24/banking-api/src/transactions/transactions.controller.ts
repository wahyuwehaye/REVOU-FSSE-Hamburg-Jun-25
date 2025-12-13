import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { DepositDto, WithdrawDto, TransferDto, PaymentDto } from './dto/transaction.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  @Roles(Role.TELLER, Role.MANAGER, Role.ADMIN)
  deposit(@Body() dto: DepositDto, @CurrentUser() user: any) {
    return this.transactionsService.deposit(dto, user.id, user.role);
  }

  @Post('withdraw')
  withdraw(@Body() dto: WithdrawDto, @CurrentUser() user: any) {
    return this.transactionsService.withdraw(dto, user.id, user.role);
  }

  @Post('transfer')
  transfer(@Body() dto: TransferDto, @CurrentUser() user: any) {
    return this.transactionsService.transfer(dto, user.id, user.role);
  }

  @Post('payment')
  payment(@Body() dto: PaymentDto, @CurrentUser() user: any) {
    return this.transactionsService.payment(dto, user.id, user.role);
  }

  @Get()
  findAll(@CurrentUser() user: any, @Query('accountNumber') accountNumber?: string) {
    return this.transactionsService.findAll(user.id, user.role, accountNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.transactionsService.findOne(+id, user.id, user.role);
  }
}
