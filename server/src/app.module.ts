import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';

// Feature modules
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { PropertyModule } from './propertie/property.module';

// Sequelize models
import { User } from './user/user.model';
import { Property } from './propertie/property.model';
import { PropertyImage } from './propertie/property_images.model';
import { PropertyViewRequestsModule } from './property_request/property_request.module';
import { PropertyRequest } from './property_request/property_request.model';

@Module({
  imports: [
    // File upload handling
    MulterModule.register({
      dest: './uploads',
    }),

    // Environment variables loader
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),

    // Static file serving (e.g. uploaded images)
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'static'),
      serveRoot: '/static',
    }),

    // Sequelize database connection
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      models: [User, Property, PropertyImage, PropertyRequest],
      autoLoadModels: process.env.AUTO_LOAD_MODELS === 'true',
    }),

    // Application modules
    TokenModule,
    UserModule,
    PropertyModule,
    PropertyViewRequestsModule,
  ],
})
export class AppModule {}


// Відправка заявки по створенню оголошення 
// Прийняття та відхилення 
// Інфа по всім заявкам