import { Module } from '@nestjs/common';
import { PropertyRequestController } from './property_request.controller';
import { PropertyRequestService } from './property_request.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PropertyRequest } from './property_request.model';
import { PropertyModule } from 'src/propertie/property.module';
import { Property } from 'src/propertie/property.model';

@Module({
  providers: [PropertyRequestService],
  controllers: [PropertyRequestController],
  imports: [SequelizeModule.forFeature([PropertyRequest]), PropertyModule]
})
export class PropertyViewRequestsModule {}
