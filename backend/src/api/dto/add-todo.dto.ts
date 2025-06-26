import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddTodoRequestDto {
  @ApiProperty({ description: 'The title of the todo' })
  @IsNotEmpty()
  @IsString()
  title: string;
}
