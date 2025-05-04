const fs = require('fs');
const path = require('path');

const name = process.argv[2];

if (!name) {
    console.error('❌ Введи ім\'я сервісу');
    process.exit(1);
}

const lower = name.charAt(0).toLowerCase() + name.slice(1);
const upper = name.charAt(0).toUpperCase() + name.slice(1);
const dirPath = path.join(__dirname, 'src', lower);
const dtoPath = path.join(dirPath, 'dto'); // Шлях до папки DTO

// ✅ Создаём директории, если их нет
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

if (!fs.existsSync(dtoPath)) {
    fs.mkdirSync(dtoPath, { recursive: true });
}

const moduleContent = `
import { Module, forwardRef } from '@nestjs/common';
import { ${upper}Controller } from './${lower}.controller';
import { ${upper}Service } from './${lower}.service';
import { ${upper} } from './${lower}.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  controllers: [${upper}Controller],
  providers: [${upper}Service],
  imports: [SequelizeModule.forFeature([${upper}]), LoggerModule],
  exports: [${upper}Service]
  
})
export class ${upper}Module {}
`;

const modelContent = `
import {Model, Column, DataType, Table, HasMany } from "sequelize-typescript";

interface ${upper}CreationAttrs{
    title: string;
}

@Table({tableName:'${lower}s',createdAt:false, updatedAt:false})
export class ${upper} extends Model<${upper}, ${upper}CreationAttrs>{

    @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id:number;

    @Column({type:DataType.STRING, allowNull:false, field: 'title'})
    title:string;    
    
}
`;
const controllerContent = `
import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ${upper}Service } from './${lower}.service';
import { Roles } from 'src/role/roles-auth-decorator';
import { RoleGuard } from 'src/role/role.gurard';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ${upper} } from './${lower}.model';
import { ${upper}Dto } from './dto/${lower}.dto';
import { Search${upper}Dto } from './dto/search-${lower}.dto';
interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

@Controller('${lower}s')
export class ${upper}Controller {
    constructor(private ${lower}Service: ${upper}Service) { }

    @Roles(['admin'])
    @UseGuards(RoleGuard)
    @ApiBearerAuth()
    @Post('/')
    @ApiOperation({ summary: 'Create a new ${lower}' })
    @ApiBody({ type: ${upper}Dto })
    async create${upper}(@Body() dto: ${upper}Dto) {
        return await this.${lower}Service.create${upper}(dto);
    }


    @Roles(['admin', 'user'])
    @UseGuards(RoleGuard)
    @ApiBearerAuth()
    @Get(':id')
    @ApiOperation({ summary: 'Get one ${lower} by ID' })
    @ApiParam({ name: 'id' })
    async get${upper}(@Param() { id }) {
        return await this.${lower}Service.get${upper}(id);
    }


    @Roles(['admin', 'user'])
    @UseGuards(RoleGuard)
    @ApiBearerAuth()
    @Get('/')
    @ApiOperation({ summary: 'Search ${upper}s' })
    @ApiQuery({ name: 'title', type: String, required: false, description: 'Title of the ${upper}' })
    @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number', example: 1 })
    @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Number of items per page', example: 10 })
    async search${upper}(@Query() dto: Search${upper}Dto): Promise<PaginatedResult<${upper}>> {
        const { title, page = 1, limit = 10 } = dto;
        console.log(dto)
        const result = await this.${lower}Service.search${upper}s({
            ...dto,
            page: Number(page),
            limit: Number(limit),
        });

        return {
            data: result.${lower}s,
            total: result.total,
            page,
            limit,
        };
    }

    

    @Roles(['admin', 'user'])
    @UseGuards(RoleGuard)
    @ApiBearerAuth()
    @Put(':id')
    @ApiParam({ name: 'id' })
    @ApiOperation({ summary: 'Update ${lower} by ID' })
    @ApiBody({ type: ${upper}Dto })
    async edit${upper}(@Body() dto: ${upper}Dto, @Param() { id }) {
        return await this.${lower}Service.edit${upper}(dto, id)
    }



    @Roles(['admin', 'user'])
    @UseGuards(RoleGuard)
    @ApiBearerAuth()
    @Delete('/:id')
    @ApiOperation({ summary: 'Delete ${lower}' })
    @ApiParam({ name: 'id' })
    async delete${upper}(@Param() { id }) {
        return await this.${lower}Service.delete${upper}(id)
    }

}

`;
const serviceContent = `
import { HttpException, HttpStatus, Injectable, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ${upper} } from './${lower}.model';
import { Op } from 'sequelize';
import { ${upper}Dto } from './dto/${lower}.dto';
import { Search${upper}Dto } from './dto/search-${lower}.dto';
import { MyLogger } from 'src/logger/logger.service';

@Injectable()
export class ${upper}Service {
    constructor(
        @InjectModel(${upper}) private ${lower}Repository: typeof ${upper},
        private readonly logger: MyLogger
    ) { }

    async create${upper}(dto: ${upper}Dto) {
        try {
            this.logger.log('Creating ${lower}', dto);

            return await this.${lower}Repository.create({ ...dto });
        } catch (error) {
            this.logger.error('Error occurred while creating ${lower}', error.stack);
            throw new HttpException(
                error.message,
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async edit${upper}(dto: ${upper}Dto, id: number) {
        try {
            this.logger.log('Edit ${lower}: ' + id, dto);

            const ${lower} = await this.${lower}Repository.findByPk(Number(id));

            if (!${lower}) {
                throw new HttpException(
                    'Benutzername wurde nicht gefunden',
                    HttpStatus.NOT_FOUND,
                );
            }
            await ${lower}.update(dto);
            this.logger.log('Successfully edited ${lower} ' + id, dto);
            return;
        } catch (error) {
            this.logger.error('Error occurred while editing ${lower}', error.stack);
            throw new HttpException(
                error.message,
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async search${upper}s(dto: Search${upper}Dto) {
        try {
            const { title, page, limit } = dto;

            this.logger.log('Searching for ${lower}s',dto);

            const whereConditions: any = {};

            if (title) {
                whereConditions.title = { [Op.like]: \`%\${title}%\` };
            }
           

            const result = await this.${lower}Repository.findAndCountAll({
                where: whereConditions,
                limit,
                offset: (page - 1) * limit,
            });

            const ${lower}s = result.rows;
            const total = result.count;

            this.logger.log('Found  ${lower}s matching the search criteria',total);

            return {
                ${lower}s,
                total,
            };
        } catch (error) {
            this.logger.error('Error occurred while searching for ${lower}s', error.stack);
            throw new HttpException(
                error.message,
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async get${upper}(id: number) {
    try {
    this.logger.log('Start searching for ${lower} with id ' + id);
      const ${lower} = await this.${lower}Repository.findByPk(id);

      if (!${lower}) {
        throw new HttpException(
          '${upper} wurde nicht gefunden',
          HttpStatus.NOT_FOUND,
        );
      }
       this.logger.log('End searching for ${lower} with id ' + id, ${lower});
      return ${lower};
    } catch (error) {
      this.logger.error('Error occurred while editing ${lower}', error.stack);
            throw new HttpException(
                error.message,
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
    }
  }

  async delete${upper}(id: number) {
    try {
      const ${lower} = await this.${lower}Repository.findByPk(id);

      if (!${lower}) {
        throw new HttpException(
          '${lower} wurde nicht gerfunden',
          HttpStatus.NOT_FOUND,
        );
      }

      await ${lower}.destroy();
      return;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}

`;

const dtoContent = `
import { ApiProperty } from "@nestjs/swagger";

export class ${upper}Dto {
    @ApiProperty()
    title:string;
}
`;

const seatchDtoContent = `
import { ${upper}Dto } from "./${upper}.dto";

export class Search${upper}Dto extends ${upper}Dto {
    page: number;
    limit: number;
}
`;



fs.writeFileSync(path.join(dirPath, `${lower}.model.ts`), modelContent);
fs.writeFileSync(path.join(dirPath, `${lower}.module.ts`), moduleContent);
fs.writeFileSync(path.join(dirPath, `${lower}.controller.ts`), controllerContent);
fs.writeFileSync(path.join(dirPath, `${lower}.service.ts`), serviceContent);
fs.writeFileSync(path.join(dtoPath, `${lower}.dto.ts`), dtoContent);
fs.writeFileSync(path.join(dtoPath, `search-${lower}.dto.ts`), seatchDtoContent);



const appModulePath = path.join(__dirname, 'src', 'app.module.ts');

// ✅ Перевіряємо, чи існує `app.module.ts`
if (!fs.existsSync(appModulePath)) {
    console.error('❌ app.module.ts не найден!');
    process.exit(1);
}

let appModuleContent = fs.readFileSync(appModulePath, 'utf8');

const moduleImport = `import { ${upper}Module } from './${lower}/${lower}.module';`;
const modelImport = `import { ${upper} } from './${lower}/${lower}.model';`;

// ✅ Додаємо модель у `models`, якщо її немає
if (!appModuleContent.includes(`, ${upper}`)) {
    console.log(`✅ Добавляем ${upper} в models`);
    appModuleContent = appModuleContent.replace(
        /(models:\s*\[[^\]]*)/,
        `$1, ${upper}`
    );
}

if (!appModuleContent.includes(`${upper}Module`)) {
    console.log(`✅ Добавляем ${upper}Module в imports`);
    appModuleContent = appModuleContent.replace(
        /(imports:\s*\[\s*)/,
        `$1${upper}Module,\n`
    );
}



if (!appModuleContent.includes(moduleImport)) {
    console.log(`✅ Добавляем импорт ${moduleImport}`);
    appModuleContent = appModuleContent.replace(
        /import { LoggerModule }.*?;/s,
        `$&\n${moduleImport}`
    );
}

if (!appModuleContent.includes(modelImport)) {
    console.log(`✅ Добавляем импорт ${modelImport}`);
    appModuleContent = appModuleContent.replace(
        /import { LoggerModule }.*?;/s,
        `$&\n${modelImport}`
    );
}

// ✅ Перезаписуємо `app.module.ts`
fs.writeFileSync(appModulePath, appModuleContent, 'utf8');

console.log(`✅ app.module.ts обновлен!`);
