import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from './token/token.module';
import { Token } from './token/token.model';
import { User } from './user/user.model';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Папка для сохранения файлов
    }),
    ConfigModule.forRoot({
      envFilePath:`.${process.env.NODE_ENV}.env`
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'static'), // Путь к папке для статики
      serveRoot: '/static', // URL-эндпоинт для доступа к файлам
  }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      models: [User, Token],
      autoLoadModels: process.env.AUTO_LOAD_MODELS == 'true'
    }),
    TokenModule,
    UserModule
  ],
})
export class AppModule { }
