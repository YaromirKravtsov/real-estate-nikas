import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Property } from './property.model';
import { PropertyImage } from './property_images.model';
import { CreatePropertyDto } from './dto/create-property.dto';
import { FilesService } from 'src/files/files.service';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property) private readonly propertyRepo: typeof Property,
    @InjectModel(PropertyImage) private readonly imageRepo: typeof PropertyImage,
    private readonly filesService: FilesService
  ) {}

  async create(dto: CreatePropertyDto, images: File[]) {
    const property = await this.propertyRepo.create(dto as any);

    if (images && images.length > 0) {
      const fileNames = await Promise.all(
        images.map(img => this.filesService.createFile(img))
      );

      await Promise.all(
        fileNames.map((name, index) =>
          this.imageRepo.create({
            propertyId: property.id,
            imageUrl: name,
            isMain: index === 0,
          })
        )
      );
    }

    return await this.getOne(property.id);
  }

  async getAll() {
    const props = await this.propertyRepo.findAll({ include: [PropertyImage] });
    return props.map(p => this.formatProperty(p));
  }

  async getOne(id: number) {
    const property = await this.propertyRepo.findByPk(id, {
      include: [PropertyImage],
    });

    if (!property) {
      throw new HttpException('Обʼєкт не знайдено', HttpStatus.NOT_FOUND);
    }

    return this.formatProperty(property);
  }

  async update(id: number, dto: UpdatePropertyDto, images: File[]) {
    const property = await this.propertyRepo.findByPk(id);
    await property.update(dto as any);

    if (images && images.length > 0) {
      // Optionally: delete old images if required
      const fileNames = await Promise.all(
        images.map(img => this.filesService.createFile(img))
      );

      await Promise.all(
        fileNames.map((name, index) =>
          this.imageRepo.create({
            propertyId: property.id,
            imageUrl: name,
            isMain: index === 0,
          })
        )
      );
    }

    return await this.getOne(id);
  }

  async delete(id: number) {
    const property = await this.propertyRepo.findByPk(id);
    await property.destroy();
    await this.imageRepo.destroy({ where: { propertyId: id } });
    return { message: 'Обʼєкт видалено' };
  }

  private formatProperty(property: Property) {
    const obj = property.get({ plain: true });
    return {
      ...obj,
      images: obj.images?.map(img => ({
        ...img,
        fullUrl: process.env.STATIC_URL + img.imageUrl,
      })),
    };
  }
}
