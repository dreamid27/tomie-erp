import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthDTO {
  @ApiProperty({
    description: 'username',
    example: 'sales123',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'password',
    example: 'sales123',
  })
  @IsString()
  password: string;
}
