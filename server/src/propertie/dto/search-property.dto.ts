import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchPropertyDto {
  @ApiPropertyOptional({ description: 'Місто', example: 'Marbella' })
  city?: string;

  @ApiPropertyOptional({ description: 'Тип оголошення', enum: ['sale', 'rent'], example: 'sale' })
  listingType?: 'sale' | 'rent';

  @ApiPropertyOptional({ description: 'Тип нерухомості', example: 'villa' })
  propertyType?: string;

  @ApiPropertyOptional({ description: 'Мінімальна ціна', example: 200000 })
  priceFrom?: number;

  @ApiPropertyOptional({ description: 'Максимальна ціна', example: 800000 })
  priceTo?: number;

  @ApiPropertyOptional({ description: 'Номер сторінки', example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: 'Кількість записів на сторінку', example: 10 })
  limit?: number;
}
