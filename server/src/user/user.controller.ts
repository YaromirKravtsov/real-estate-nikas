import { Body, Controller, Delete, ForbiddenException, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { Roles } from 'src/role/roles-auth-decorator';
import { RoleGuard } from 'src/role/role.gurard';
import { RegisterUserDto } from './dto/register-user-dto';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EditUserDto } from './dto/edit-user.dto';
import { ChangePasswordDto } from './dto/chage-password.dto';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'multer';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Roles(['admin', 'user'])
    @UseGuards(RoleGuard)
    @ApiBearerAuth()
    @Get(':id')
    @ApiOperation({ summary: 'Get one user by ID' })
    @ApiParam({ name: 'id' })
    async getUser(@Param() { id }) {
        return await this.userService.getUser(Number(id));
    }


    @Roles(['admin'])
    @UseGuards(RoleGuard)
    @ApiBearerAuth()
    @Post('/')
    @ApiOperation({ summary: 'Create a new user' })
    @UseInterceptors(FileInterceptor('avatar'))
    @ApiConsumes('multipart/form-data')  
    @ApiBody({
        description: 'Create a new user with an avatar',
        type: RegisterUserDto,
        required: true,
    })
    async createUser(
        @Body() dto: RegisterUserDto,
        @UploadedFile() avatar: File
    ) {
        return await this.userService.createUser(dto, avatar);
    }



    @Roles(['admin'])
    @UseGuards(RoleGuard)
    @ApiBearerAuth()
    @Get('/')
    @ApiOperation({ summary: 'Get all users' })
    async getAllUsers() {
        return await this.userService.getAllUsers();
    }



    @Roles(['admin', 'trainer'])
    @UseGuards(RoleGuard)
    @ApiBearerAuth()
    @Put(':id')
    @ApiOperation({ summary: 'Update user by ID' })
    @ApiBody({ type: EditUserDto })
    @UseInterceptors(FileInterceptor('avatar'))
    @ApiConsumes('multipart/form-data')
    async editUser(@Body() dto: EditUserDto, @Param() { id }, @UploadedFile() avatar: File) {
        return await this.userService.editUser(dto, id, avatar)
    }



    @Roles(['admin'])
    @UseGuards(RoleGuard)
    @ApiBearerAuth()
    @Delete('/:id')
    @ApiOperation({ summary: 'Delete user' })
    @ApiParam({ name: 'id' })
    async deletePlayer(@Param() { id }) {
        return await this.userService.deleteUser(id)
    }

    @Post('login')
    @ApiOperation({ summary: 'User logining' })
    @ApiBody({ type: LoginDto })
    async login(@Body() dto: LoginDto, @Res() res: Response) {
        const userData = await this.userService.login(dto);
        return res.status(200).json(userData);
    }

}
