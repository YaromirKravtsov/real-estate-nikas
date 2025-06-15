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
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { PropertyService } from './property.service';
import { Roles } from 'src/role/roles-auth-decorator';
import { RoleGuard } from 'src/role/role.gurard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { CreatePropertyDto } from './dto/create-property.dto';
import { SearchPropertyDto } from './dto/search-property.dto';

@ApiTags('Properties')
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Roles(['admin', 'user'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({
    summary:
      'Create new property with optional images. For pages: Оголошення Item v2, Create Property',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePropertyDto })
  @ApiResponse({ status: 201, description: 'Property successfully created' })
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() dto: CreatePropertyDto,
    @UploadedFiles() images: File[],
  ) {
    return await this.propertyService.create(
      { ...dto, is_submission: false },
      images,
    );
  }

  @Get('search')
  @ApiOperation({
    summary:
      'Search properties by filters. For pages: Home Page(with limit = 6), Property Page, Properties Page, Оголошення List v2',
  })
  @ApiResponse({ status: 200, description: 'Filtered list of properties' })
  async search(@Query() query: SearchPropertyDto) {
    return await this.propertyService.search(query);
  }

  @Roles(['admin'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Get('user-submitted/:id')
  @ApiOperation({
    summary:
      'Get properties submitted by users (not agents). For pages: Співробітник v2',
  })
  @ApiResponse({
    status: 200,
    description: 'List of user-submitted properties',
  })
  @ApiParam({ name: 'id', type: Number })
  async getUserSubmitted(@Param('id') id: number) {
    return await this.propertyService.getUserSubmitted(id);
  }

  @Get('by-id/:id')
  @ApiOperation({ summary: 'Get property by ID For pages: Оголошення Item v2' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Property details' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async getOne(@Param('id') id: number) {
    return await this.propertyService.getOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all properties for listing' })
  @ApiResponse({ status: 200, description: 'List of all properties' })
  async getAll() {
    return await this.propertyService.getAll();
  }

  @Roles(['admin'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({
    summary:
      'Update property by ID with optional new images. For pages: Оголошення Item v2',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CreatePropertyDto })
  @ApiResponse({ status: 200, description: 'Property updated' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePropertyDto,
    @UploadedFiles() images: File[],
  ) {
    return await this.propertyService.update(id, dto, images);
  }

  @Roles(['admin'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete property by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.propertyService.delete(id);
  }
}
