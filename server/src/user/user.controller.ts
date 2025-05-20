import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Put,
  UseGuards,
  HttpCode,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Roles } from 'src/role/roles-auth-decorator';
import { RoleGuard } from 'src/role/role.gurard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegisterUserDto } from './dto/register-user-dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Roles(['admin', 'user'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get one user by ID' })
  @ApiParam({ name: 'id' })
  async getUser(@Param('id') id: string) {
    return await this.userService.getUser(Number(id));
  }

  @Roles(['admin'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Roles(['admin'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Create new user' })
  async createUser(@Body() dto: CreateUserDto, @UploadedFile() image: File) {
    return await this.userService.createUser(dto, image);
  }

  @Roles(['admin'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto, @UploadedFile() image: File) {

    return await this.userService.updateUser(Number(id), dto, image);
  }

  @Roles(['admin'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id' })
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(Number(id));
  }


  @Post('login')
  @ApiOperation({ summary: 'User logining' })
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const userData = await this.userService.login(dto);
    res.cookie('accessToken', userData.accessToken, { maxAge: 30 * 24 * 60 * 68 * 1000, httpOnly: true });
    return res.status(200).json(userData);
  }


  /* --- */


  @Post('/admin')
  @ApiOperation({ summary: 'Create a new user' })
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')  // Налаштовуємо Swagger на прийом файлів
  @ApiBody({
    description: 'Create a new user with an avatar',
    type: RegisterUserDto,
    required: true, // Вказуємо, що тіло обов’язкове
  })
  async createAdmin(
    @Body() dto: RegisterUserDto,
    @UploadedFile() avatar: File
  ) {
    return await this.userService.createAdmin();
  }
}
