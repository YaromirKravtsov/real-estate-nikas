import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({
    description: 'Назва об’єкта нерухомості',
    example: 'Простора вілла біля моря',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'Ціна об’єкта у євро',
    example: 450000,
  })
  price: number;

  @ApiProperty({
    description: 'Повна адреса розташування об’єкта',
    example: 'Calle Marítimo 12, Marbella, Spain',
  })
  address: string;

  @ApiProperty({
    description: 'Місто, де знаходиться нерухомість',
    example: 'Marbella',
  })
  city: string;

  @ApiProperty({
    description: 'Тип оголошення: продаж або оренда',
    example: 'sale',
    enum: ['sale', 'rent'],
  })
  listingType: 'sale' | 'rent';

  @ApiProperty({
    description: 'Тип нерухомості',
    example: 'villa',
  })
  propertyType: string;

  @ApiProperty({
    description: 'Кількість спалень',
    example: 4,
  })
  bedrooms: number;

  @ApiProperty({
    description: 'Кількість ванних кімнат',
    example: 3,
  })
  bathrooms: number;

  @ApiProperty({
    description: 'Рік побудови будинку (необов’язково)',
    example: 2015,
    required: false,
  })
  yearBuilt?: number;

  @ApiProperty({
    description: 'Опис або додаткова інформація про об’єкт',
    example: 'Сучасна вілла з панорамним видом на море, великим садом і басейном.',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'ID агента, який відповідає за нерухомість',
    example: 1,
  })
  agentId: number;

  is_submission: boolean;
  @ApiProperty({
    description: 'Масив зображень об’єкта (файли JPG/PNG)',
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
  })
  images: any[];
}
