import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ModifyTodoTitleRequestDto {
  @ApiProperty({ description: 'The unique identifier of the todo' })
  @IsUUID(4, { message: 'Invalid UUID format' })
  id: string;

  @ApiProperty({ description: 'The new title of the todo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Title must be less than 100 characters' })
  title: string;
}
