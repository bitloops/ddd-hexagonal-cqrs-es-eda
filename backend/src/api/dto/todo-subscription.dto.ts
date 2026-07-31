import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class TodoSubscriptionDto {
  @ApiProperty({ example: 'tab-7f3a2c' })
  @IsString()
  subscriberId: string;

  @ApiProperty({
    type: [String],
    example: ['todo.added', 'todo.completed'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  events: string[];
}
