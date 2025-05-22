import { PartialType } from '@nestjs/swagger';
import { CreatePropertyViewDto } from './create-property-view.dto';

export class UpdatePropertyViewDto extends PartialType(CreatePropertyViewDto) {}
