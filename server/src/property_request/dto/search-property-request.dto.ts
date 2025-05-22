import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchPropertyRequestDto {
  @ApiPropertyOptional({
    description: 'Тип запиту: true — заявка на публікацію, false — заявка на перегляд',
    example: 1,
  })
  requestType?: number;
}
