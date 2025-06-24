import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Property } from './property.model';
import { PropertyImage } from './property_images.model';
import { CreatePropertyDto } from './dto/create-property.dto';
import { FilesService } from 'src/files/files.service';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { SearchPropertyDto } from './dto/search-property.dto';
import { Op } from 'sequelize';
import { User } from 'src/user/user.model';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property) private readonly propertyRepo: typeof Property,
    @InjectModel(PropertyImage)
    private readonly imageRepo: typeof PropertyImage,
    private readonly filesService: FilesService,
  ) { }

  async create(dto: CreatePropertyDto, images: File[]) {
    console.log(dto, images)
    const property = await this.propertyRepo.create(dto);

    if (images && images.length > 0) {
      const fileNames = await Promise.all(
        images.map((img) => this.filesService.createFile(img)),
      );

      await Promise.all(
        fileNames.map((name, index) =>
          this.imageRepo.create({
            propertyId: property.id,
            imageUrl: name,
            isMain: index === 0,
          }),
        ),
      );
    }

    return await this.getOne(property.id);
  }

  async search(query: SearchPropertyDto) {
    const where: any = {};

    if (query.city) where.city = query.city;
    if (query.listingType) where.listingType = query.listingType;
    if (query.propertyType)
      where.propertyType = { [Op.like]: `%${query.propertyType}%` };

    if (query.priceFrom || query.priceTo) {
      where.price = {};
      if (query.priceFrom) where.price[Op.gte] = query.priceFrom;
      if (query.priceTo) where.price[Op.lte] = query.priceTo;
    }
    where.is_submission = false;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.propertyRepo.findAndCountAll({
      where,
      include: { all: true },
      limit,
      offset,
    });

    return {
      total: count,
      page,
      limit,
      data: rows.length <= 0 ? [] : rows.map(property => ({
        ...property.toJSON(), images: property.toJSON().images.map(image => ({
          ...image,
          imageUrl: process.env.STATIC_URL + image.imageUrl
        }))
      })),
    };
  }

  async getOne(id: number) {
    const property = await this.propertyRepo.findByPk(id, {
      include: [PropertyImage],
    });

    if (!property) {
      throw new HttpException('Обʼєкт не знайдено', HttpStatus.NOT_FOUND);
    }
    //process.env.STATIC_URL
    return this.formatProperty(property);
  }

  async getAll() {
    const properties = await this.propertyRepo.findAll({
      include: [PropertyImage, { model: User, as: 'agent' }], // Добавь сюда другие связанные модели, если нужно
    });

    return properties.map((property) => this.formatProperty(property));
  }

  async getUserSubmitted(id: number) {
    return await this.propertyRepo.findAll({
      where: { agentId: id },
      include: { all: true },
    });
  }

  async update(id: number, dto: UpdatePropertyDto, images: File[]) {
    const property = await this.propertyRepo.findByPk(id, {
      include: { all: true },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Оновлюємо всі прості поля
    const { deletedImages, ...updateData } = dto;
    await property.update(updateData as any);

    // 1) Видаляємо зазначені в DTO зображення
    // Обробка deletedImages як рядка або масиву
if (deletedImages) {
  // Нормалізуємо до масиву URL-ів
  const urls = Array.isArray(deletedImages) ? deletedImages : [deletedImages];

  // Витягуємо імена файлів
  const toDeleteNames = urls.map(url => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  });

  // Знаходимо записи в БД
  const imagesToDelete = await this.imageRepo.findAll({
    where: {
      propertyId: id,
      imageUrl: toDeleteNames,  // Sequelize автоматично згенерує IN (...)
    },
  });

  // Видаляємо файли з диску/сервісу
  await Promise.all(imagesToDelete.map(img =>
    this.filesService
      .deleteFile(img.imageUrl)
      .catch(() => console.warn(`Не вдалось видалити файл ${img.imageUrl}`))
  ));

  // Видаляємо записи з БД
  await this.imageRepo.destroy({
    where: {
      propertyId: id,
      imageUrl: toDeleteNames,
    },
  });
}


    // 2) Якщо прийшли нові файли — додаємо їх
    if (images && images.length > 0) {
      // Завантажуємо нові у файловий сервіс
      const fileNames = await Promise.all(
        images.map(img => this.filesService.createFile(img)),
      );

      // Створюємо записи в БД
      await Promise.all(
        fileNames.map((name, idx) =>
          this.imageRepo.create({
            propertyId: property.id,
            imageUrl: name,
            isMain: idx === 0,
          }),
        ),
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
      images: obj.images?.map((img) => ({
        ...img,
        fullUrl: process.env.STATIC_URL + img.imageUrl,
        imageUrl: process.env.STATIC_URL + img.imageUrl,
      })),
      agent: obj.agent
        ? {
          id: obj.agent.id,
          firstName: obj.agent.firstName,
          lastName: obj.agent.lastName,
        }
        : null,
    };
  }

  async approveSumbit(propertyId:number, val: boolean){
      const property =  await this.propertyRepo.findByPk(propertyId);
      await property.update({is_submission: val})
  }
}


