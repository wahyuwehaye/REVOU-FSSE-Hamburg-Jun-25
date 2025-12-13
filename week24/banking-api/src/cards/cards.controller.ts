import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto, UpdateCardPinDto, ActivateCardDto } from './dto/card.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() dto: CreateCardDto, @CurrentUser() user: any) {
    return this.cardsService.create(dto, user.id, user.role);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.cardsService.findAll(user.id, user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.cardsService.findOne(+id, user.id, user.role);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string, @Body() dto: ActivateCardDto, @CurrentUser() user: any) {
    return this.cardsService.activate(+id, dto, user.id, user.role);
  }

  @Patch(':id/block')
  block(@Param('id') id: string, @CurrentUser() user: any) {
    return this.cardsService.block(+id, user.id, user.role);
  }

  @Patch(':id/pin')
  updatePin(@Param('id') id: string, @Body() dto: UpdateCardPinDto, @CurrentUser() user: any) {
    return this.cardsService.updatePin(+id, dto, user.id, user.role);
  }

  @Delete(':id')
  @Roles(Role.MANAGER, Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.cardsService.remove(+id, user.id, user.role);
  }
}
