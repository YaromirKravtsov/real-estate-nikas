import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePropertyViewDto } from './dto/create-property-view.dto';
import { UpdatePropertyViewDto } from './dto/update-property-view.dto';
import { SearchPropertyRequestDto } from './dto/search-property-request.dto';
import { PropertyRequest } from './property_request.model';
import { Property } from 'src/propertie/property.model';
import { User } from 'src/user/user.model';
import { PropertyService } from 'src/propertie/property.service';
import { CreatePropertySubmissionDto } from './dto/create-property-submission.dto';

@Injectable()
export class PropertyRequestService {
  constructor(
    @InjectModel(PropertyRequest)
    private readonly model: typeof PropertyRequest,
    private readonly propertyService: PropertyService,
  ) { }

  async createViewRequest(dto: CreatePropertyViewDto) {
    return await this.model.create({...dto,requestType: 1});
  }

  async createSubmissionRequest(dto: CreatePropertySubmissionDto, images: File[]) {
    const { name, phone, message,email, ...createPropertyDto } = dto;
    console.log(createPropertyDto)
    const property = await this.propertyService.create({
      ...createPropertyDto, is_submission: true
    }, images)

    return await this.model.create({name, phone, message, email,propertyId: property.id,requestType: 2 });
  }
  async search(query: SearchPropertyRequestDto) {
    const where: any = {};

    if (query.requestType !== undefined) {
      where.requestType = query.requestType;
    }


    return await this.model.findAll({
      where,
      include: { model: Property, include: [User] },
      order: [['createdAt', 'DESC']],
    });
  }


  async getOne(id: number) {
    const request = await this.model.findByPk(id, { include: { model: Property, include: [User] }, });
    if (!request) throw new NotFoundException('View request not found');
    return request;
  }

  async update(id: number, dto: UpdatePropertyViewDto) {
    const request = await this.getOne(id);
    return await request.update(dto as any);
  }

  async delete(id: number) {
    const request = await this.getOne(id);
    await request.destroy();
    return { message: 'Deleted successfully' };
  }
}
