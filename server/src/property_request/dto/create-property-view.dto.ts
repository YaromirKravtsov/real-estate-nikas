import { ApiProperty } from '@nestjs/swagger';

export class UserContactDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ required: false })
  message?: string;
}


export class CreatePropertyViewDto extends UserContactDto{
  @ApiProperty()
  propertyId: number;


}
