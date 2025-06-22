import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilesService } from 'src/files/files.service';
import { TokenService } from 'src/token/token.service';
import { PayloadDto } from 'src/token/dto/payload.dto';
import { hash, compare } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private readonly filesService: FilesService,
    @Inject(forwardRef(() => TokenService))
    private readonly tokenService: TokenService

  ) { }

  async getUser(id: number): Promise<any> {
    try {
      const user = await this.userRepository.findByPk(id);
      if (!user) {
        throw new HttpException('Користувача не знайдено', HttpStatus.NOT_FOUND);
      }
      console.log(this.buildUserWithFullImageUrl(user))
      return this.buildUserWithFullImageUrl(user);
    } catch (error) {
      throw new HttpException(
        error.message || 'Server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllUsers(searchQuery?: string) {
    let where = {};

    if (searchQuery) {
      where = {
        [Op.or]: [
          { firstName: { [Op.like]: `%${searchQuery}%` } },
          { lastName: { [Op.like]: `%${searchQuery}%` } },
          { email: { [Op.like]: `%${searchQuery}%` } },
          { phoneNumber: { [Op.like]: `%${searchQuery}%` } },
        ],
      };
    }

    return await this.userRepository.findAll({ where });
  }

  async createUser(dto: CreateUserDto, image?: File): Promise<any> {
    try {

      if (image) {
        const fileName = await this.filesService.createFile(image);
        dto['profileImageUrl'] = fileName;
      }
      dto['role'] = 'admin';
      const hashPassword = await hash('admin', 3);
      console.log({ ...dto, passwordHash: hashPassword })
      const user = await this.userRepository.create({ ...dto, passwordHash: hashPassword });
      try {
      const returnUser = this.buildUserWithFullImageUrl(user)
        console.log(returnUser)
        return returnUser;
      } catch (err) {
        console.log(err)
      }

    } catch (err) {
      throw new HttpException(
        err.message || 'Помилка створення користувача',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(id: number, dto: UpdateUserDto, image?: File): Promise<any> {
    const user = await this.userRepository.findByPk(id);

    if (image) {
      const fileName = await this.filesService.createFile(image);
      dto['profileImageUrl'] = fileName;
    }

    await user.update(dto as any);
    return this.buildUserWithFullImageUrl(user);
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findByPk(id);
    await user.destroy();
    return { message: 'Користувача видалено' };
  }

  private buildUserWithFullImageUrl(user: User) {
    const userObj = user.toJSON();
    return {
      ...userObj,
      profileImageUrl: userObj.profileImageUrl
        ? process.env.STATIC_URL + userObj.profileImageUrl
        : null,
    };
  }

  async login(dto: LoginDto) {
    try {
      console.log(dto)
      const user = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (!user) {
        console.log(new HttpException(
          `Ім'я користувача або пароль недійсні`,
          HttpStatus.BAD_REQUEST,
        ))
        throw new HttpException(
          `Ім'я користувача або пароль недійсні`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const isPassEquals = await compare(dto.password, user.passwordHash);

      if (!isPassEquals) {
        throw new HttpException(
          `Ім'я користувача або пароль недійсні`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const payload: PayloadDto = {
        userId: user.id,
        role: user.role,
        profileImageUrl: process.env.STATIC_URL + user.profileImageUrl,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      const accessToken = this.tokenService.generateToken(payload);


      return { accessToken };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByPk(pk: number) {
    try {
      const userData = await this.userRepository.findByPk(pk);
      return userData;
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }


  /* TEMP */

  async createAdmin() {
    const hashPassword = await hash('admin', 3);
    await this.userRepository.create({
      firstName: 'Admin firstName',
      lastName: 'Admin lastName',
      passwordHash: hashPassword,
      role: 'admin',
      phoneNumber: '+122',
      email: 'admin@gmail.com',
      profileImageUrl: ''

    })
  }
}
