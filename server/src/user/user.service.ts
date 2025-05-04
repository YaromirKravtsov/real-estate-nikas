import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user-dto';
import { hash, compare } from 'bcrypt';
import { PayloadDto } from 'src/token/dto/payload.dto';
import { TokenService } from 'src/token/token.service';
import { SaveTokenDto } from 'src/token/dto/save-token.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';

import { ChangePasswordDto } from './dto/chage-password.dto';
import { FilesService } from 'src/files/files.service';
import { MyLogger } from 'src/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @Inject(forwardRef(() => TokenService))
    private readonly tokenService: TokenService,
    private filesService: FilesService,
    private logger: MyLogger
  ) { }

  async createUser(dto: RegisterUserDto,avatar:File) {
    this.logger.log('Start create new user', {...dto,avatar});
    try {
      const candidate = await this.userRepository.findOne({
        where: { firstName: dto.firstName },
      });
      const hashPassword = await bcrypt.hash(dto.firstName, 3);
      if (candidate) {
        throw new HttpException(
          'Користувач із таким іменем уже зареєстрований',
          HttpStatus.FORBIDDEN,
        );
      }

      let fileIUrl ;
      if (avatar) {
        fileIUrl = await this.filesService.createFile(avatar);
      }
      const user = await this.userRepository.create({
        ...dto,
        password: hashPassword,
        role: 'user',
        avatarLink: fileIUrl
      });

      this.logger.log('End create new user', user);

      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editUser(dto: EditUserDto, id: number, avatar: File) {
    try {
      const user = await this.userRepository.findByPk(id);

      if (!user) {
        throw new HttpException(
          `Ім'я користувача або пароль недійсні`,
          HttpStatus.NOT_FOUND,
        );
      }
      
      if(avatar){
        await this.filesService.deleteFile(user.avatarLink);
        const fileName = await this.filesService.createFile(avatar);
        await user.update({...dto,avatarLink: fileName});
      }else await user.update(dto);


      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: number) {
    try {
      const player = await this.userRepository.findByPk(id);

      if (!player) {
        throw new HttpException(
          'Benutzername oder Passwort ist ungültig',
          HttpStatus.NOT_FOUND,
        );
      }


      await this.tokenService.removeAllTokensForUser(id);
      await player.destroy();
      return;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUsers() {
    try {
      const players = await this.userRepository.findAll({
        attributes: { exclude: ['password'] }, // Исключаем поле password из результата
      });

      return players;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchUsers(searchQuery?: string) {
    try {
      let whereConditions: any = {};

      
      if (searchQuery && searchQuery.trim() !== '') {
        whereConditions[Op.or] = [
          { username: { [Op.like]: `%${searchQuery}%` } },
          { phone: { [Op.like]: `%${searchQuery}%` } },
          { email: { [Op.like]: `%${searchQuery}%` } },
        ];
      }
      console.log(whereConditions);
      const players = await this.userRepository.findAll({
        where: whereConditions,
        attributes: { exclude: ['password'] },
      });

      return players;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(dto: LoginDto) {
    try {
      console.log(dto)
      const user = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (!user) {
        console.log('')
        throw new HttpException(
          `Ім'я користувача або пароль недійсні`,
          HttpStatus.NOT_FOUND,
        );
      }
      const isPassEquals = await compare(dto.password, user.password);

      if (!isPassEquals) {
        throw new HttpException(
          `Ім'я користувача або пароль недійсні`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const payload: PayloadDto = {
        userId: user.id,
        role: user.role,
        avatarLink: process.env.STATIC_URL +  user.avatarLink,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      const tokens = this.tokenService.generateTokens(payload);
      const tokenDto: SaveTokenDto = {
        userId: user.id,
        refreshToken: tokens.refreshToken,
      };
      const deviceId = this.tokenService.generateDeviceId();
      await this.tokenService.saveToken({ ...tokenDto, deviceId });

      return { ...tokens, deviceId };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changePassword(dto: ChangePasswordDto) {
    try {
      const { userId, password } = dto;
      console.log(userId, password);
      const user = await this.userRepository.findByPk(userId);
      const hashPassword = await bcrypt.hash(password, 3);
      await user.update({
        password: hashPassword,
      });
      return;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUser(id: number) {
    try {
      const player = await this.userRepository.findByPk(id);

      if (!player) {
        throw new HttpException(
          'Benutzername wurde nicht gefunden',
          HttpStatus.NOT_FOUND,
        );
      }

      return player;
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
}
