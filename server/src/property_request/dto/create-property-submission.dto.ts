import { IntersectionType, PartialType } from '@nestjs/swagger';
import { CreatePropertyDto } from 'src/propertie/dto/create-property.dto';
import { UserContactDto } from './create-property-view.dto';

export class CreatePropertySubmissionDto extends IntersectionType(
  CreatePropertyDto,
  UserContactDto
) {}
