import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
} from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
