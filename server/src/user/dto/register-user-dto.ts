import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { File } from 'multer'; // Якщо ви хочете працювати з типом File від Multer


export class RegisterUserDto {
  @ApiProperty({ example: 'Yaromyr' })
  readonly firstName: string;

  @ApiProperty({ example: 'Kravtsov' })
  readonly lastName: string;

  @ApiProperty({ required: false, example: '+12121212' })
  @IsOptional()
  readonly phoneNumber?: string;

  @ApiProperty({ required: false, example: 'yaromirkr@gmail.com' })
  readonly email?: string;


  @ApiProperty({
    description: 'The avatar image',
    type: 'string',
    format: 'binary', 
    required: false,
  })
  profileImageUrl: any; 
  
  role: string

   @ApiProperty({
    description: 'The avatar image',
    type: 'string',
    format: 'binary', 
    required: false,
  })
  password: string
}
