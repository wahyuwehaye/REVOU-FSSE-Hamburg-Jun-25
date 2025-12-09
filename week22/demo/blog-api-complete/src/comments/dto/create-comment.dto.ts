import { IsString, MinLength, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(3)
  content: string;

  @IsUUID()
  postId: string;
}
