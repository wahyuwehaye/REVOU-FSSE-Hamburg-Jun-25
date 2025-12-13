import { IsNumber, IsEnum, IsString, IsDateString, IsOptional, Min, Length } from 'class-validator';
import { CardType } from '@prisma/client';

export class CreateCardDto {
  @IsNumber()
  accountId: number;

  @IsEnum(CardType)
  cardType: CardType;

  @IsString()
  @Length(4, 4)
  pin: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  dailyLimit?: number;
}

export class UpdateCardPinDto {
  @IsString()
  @Length(4, 4)
  oldPin: string;

  @IsString()
  @Length(4, 4)
  newPin: string;
}

export class ActivateCardDto {
  @IsString()
  @Length(4, 4)
  pin: string;
}
