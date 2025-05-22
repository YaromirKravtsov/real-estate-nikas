import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import { Property } from './property.model';
import { PropertyImage } from './property_images.model';
import { FilesModule } from 'src/files/files.module';

@Module({
  providers: [PropertyService],
  controllers: [PropertyController],
  imports: [SequelizeModule.forFeature([User, Property, PropertyImage]), FilesModule],
  exports: [PropertyService]
})
export class PropertyModule {}
