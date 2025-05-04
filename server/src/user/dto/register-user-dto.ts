import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { File } from 'multer'; // Якщо ви хочете працювати з типом File від Multer

export class RegisterUserDto {
  @IsString({ message: 'Der Name muss eine Zeichenfolge sein' })
  @ApiProperty({example: 'Mirjam'})
  readonly firstName: string;

  @IsString({ message: 'Der Name muss eine Zeichenfolge sein'  })
  @ApiProperty( {example: 'Wickel'})
  readonly lastName: string;

  @ApiProperty({ required: false, example: '+12121212'  })
  @IsString({ message: 'Telefon muss eine Zeichenfolge sein' })
  @IsOptional()
  @MinLength(7, { message: 'Das Telefonnummer darf nicht kleiner als 7 sein' })
  readonly phone?: string;

  @ApiProperty({ required: false, example: 'mirjam@gmail.com' })
  readonly email?: string;

  @ApiProperty({ required: false,example: 'Geschäftsführung' })
  readonly position?: string;

  @ApiProperty({
    description: 'The avatar image',
    type: 'string',
    format: 'binary', // Це налаштовує Swagger на тип файлу для завантаження
    required: false,
  })
  avatar: any; // Використовуємо any, щоб дозволити завантаження файлу
}
