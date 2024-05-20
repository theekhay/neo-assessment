import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
export class LoginDTO {
  @ApiProperty({
    example: 'user@test.com',
    description: 'user email',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd',
    description: 'user password',
    type: String,
    required: true,
  })
  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
