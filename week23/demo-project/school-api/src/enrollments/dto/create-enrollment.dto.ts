import { IsInt } from 'class-validator';

export class CreateEnrollmentDto {
  @IsInt()
  courseId: number;
}
