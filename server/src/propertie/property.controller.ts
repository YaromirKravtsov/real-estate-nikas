import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Put,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PropertyService } from './property.service';

import { Roles } from 'src/role/roles-auth-decorator';
import { RoleGuard } from 'src/role/role.gurard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { CreatePropertyDto } from './dto/create-property.dto';
@ApiTags('Properties')
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Roles(['admin', 'user'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create new property with images' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() dto: CreatePropertyDto,
    @UploadedFiles() images: File[]
  ) {
    return await this.propertyService.create(dto, images);
  }

  @Roles(['admin', 'user'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all properties' })
  async getAll() {
    return await this.propertyService.getAll();
  }

  @Roles(['admin', 'user'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get one property by ID' })
  @ApiParam({ name: 'id' })
  async getOne(@Param('id') id: string) {
    return await this.propertyService.getOne(+id);
  }

  @Roles(['admin'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update property by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id' })
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyDto,
    @UploadedFiles() images: File[]
  ) {
    return await this.propertyService.update(+id, dto, images);
  }

  @Roles(['admin'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete property by ID' })
  @ApiParam({ name: 'id' })
  async delete(@Param('id') id: string) {
    return await this.propertyService.delete(+id);
  }
}
