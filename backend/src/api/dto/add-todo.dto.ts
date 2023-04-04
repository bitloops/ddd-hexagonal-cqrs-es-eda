import { IsString, IsNotEmpty } from 'class-validator';

export class AddTodoDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}
