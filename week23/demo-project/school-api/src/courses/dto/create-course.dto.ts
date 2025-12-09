import { IsString, IsInt, Min, Max, MinLength } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsInt()
  @Min(1)
  @Max(6)
  credits: number;

  @IsString()
  @MinLength(3)
  instructor: string;
}
