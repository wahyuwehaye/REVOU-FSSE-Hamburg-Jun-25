import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BeneficiariesService } from './beneficiaries.service';
import { CreateBeneficiaryDto } from './dto/beneficiary.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('beneficiaries')
export class BeneficiariesController {
  constructor(private readonly beneficiariesService: BeneficiariesService) {}

  @Post()
  create(@Body() dto: CreateBeneficiaryDto, @CurrentUser() user: any) {
    return this.beneficiariesService.create(dto, user.id, user.role);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.beneficiariesService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.beneficiariesService.findOne(+id, user.id, user.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.beneficiariesService.remove(+id, user.id, user.role);
  }
}
