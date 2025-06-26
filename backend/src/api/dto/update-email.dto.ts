import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmailRequestDto {
  @ApiProperty({ description: 'The new email address' })
  email: string;
}
