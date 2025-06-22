import { ApiAcceptedResponse, ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Yaromyr' })
  readonly firstName: string;

  @ApiProperty({ example: 'Kravtsov' })
  readonly lastName: string;

  @ApiProperty({ required: true, example: '+12121212' })
  @IsOptional()
  readonly phoneNumber?: string;

  @ApiProperty({ required: true, example: 'yaromirkr@gmail.com' })
  readonly email?: string;
  @ApiProperty({ required: true, example: '123' })
  password: string;
  @ApiProperty({
    description: 'The avatar image',
    type: 'string',
    format: 'binary', 
    required: false,
  })
  profileImageUrl: any; 

}
