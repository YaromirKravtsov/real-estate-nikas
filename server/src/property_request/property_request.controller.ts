import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { RoleGuard } from 'src/role/role.gurard';
import { PropertyRequestService } from './property_request.service';
import { Roles } from 'src/role/roles-auth-decorator';
import { CreatePropertyViewDto } from './dto/create-property-view.dto';
import { UpdatePropertyViewDto } from './dto/update-property-view.dto';
import { SearchPropertyRequestDto } from './dto/search-property-request.dto';
import { CreatePropertySubmissionDto } from './dto/create-property-submission.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Property View Requests. Customer requests to contact an agent')
@ApiBearerAuth()
@UseGuards(RoleGuard)
@Controller('property-views')
export class PropertyRequestController {
  constructor(private readonly service: PropertyRequestService) { }


  @Post('view')
  @ApiOperation({ summary: 'Create request for viewing a property. For page: Property Page' })
  async createViewRequest(@Body() dto: CreatePropertyViewDto) {
    return await this.service.createViewRequest(dto);
  }

  @Post('submit')
  @ApiOperation({ summary: 'Create request for submitting a property listing' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePropertySubmissionDto })
  @ApiResponse({ status: 201, description: 'Request for submitting successfully created. For page: Деталі заявки' })
  @UseInterceptors(FilesInterceptor('images'))
  async createSubmissionRequest(@Body() dto: CreatePropertySubmissionDto,@UploadedFiles() images: File[]) {
    return await this.service.createSubmissionRequest(dto, images);
  }

  @Put('submit/action/:id')
  @ApiOperation({ summary: 'Approve submit from user' })
  @ApiResponse({ status: 201, description: 'Request for submitting successfully created. For page: Деталі заявки' })

  async approveSumbit(@Param('id') id: number, @Body() {action}: {action: 'approve'}) {
    return await this.service.approveSumbit(id, action);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search property requests by type. For pages: "подані заявки"' })
  @ApiResponse({ status: 200, description: 'Filtered list of requests' })
  async search(@Query() query: SearchPropertyRequestDto) {
    return await this.service.search(query);
  }

  @Roles(['admin'])
  @Get(':id')
  @ApiOperation({ summary: 'Get a view request by ID. For pages: Деталі заявки' })
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.service.getOne(id);
  }

  @Roles(['admin'])
  @Put(':id')
  @ApiOperation({ summary: 'Update a view request by ID. For pages: Деталі заявки' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePropertyViewDto,
  ) {
    return await this.service.update(id, dto);
  }

  @Roles(['admin'])
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a view request by ID' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.service.delete(id);
  }
}
