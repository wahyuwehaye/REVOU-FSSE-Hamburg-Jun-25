import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { LoansService } from './loans.service';
import { ApplyLoanDto, ApproveLoanDto, MakePaymentDto } from './dto/loan.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post('apply')
  @Roles(Role.CUSTOMER)
  apply(@Body() dto: ApplyLoanDto, @CurrentUser() user: any) {
    return this.loansService.apply(dto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.loansService.findAll(user.id, user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.loansService.findOne(+id, user.id, user.role);
  }

  @Patch(':id/approve')
  @Roles(Role.MANAGER, Role.ADMIN)
  approve(@Param('id') id: string, @Body() dto: ApproveLoanDto, @CurrentUser() user: any) {
    return this.loansService.approve(+id, dto, user.id, user.role);
  }

  @Post(':id/payment')
  makePayment(@Param('id') id: string, @Body() dto: MakePaymentDto, @CurrentUser() user: any) {
    return this.loansService.makePayment(+id, dto, user.id, user.role);
  }

  @Get(':id/schedule')
  getPaymentSchedule(@Param('id') id: string, @CurrentUser() user: any) {
    return this.loansService.getPaymentSchedule(+id, user.id, user.role);
  }
}
