import { IsString, IsIn } from 'class-validator';

export class UpdateGradeDto {
  @IsString()
  @IsIn(['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'], {
    message: 'Grade must be a valid letter grade',
  })
  grade: string;
}
