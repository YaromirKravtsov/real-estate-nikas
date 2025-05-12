// token.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TokenService } from './token.service';

import { User } from 'src/user/user.model';

import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { TokenController } from './token.controller';



@Module({
  providers: [TokenService],
  controllers:[TokenController],
  imports: [
    forwardRef(() => UserModule),
    SequelizeModule.forFeature([User]),
    JwtModule.register({}), 
  ],
  exports: [TokenService], 
})
export class TokenModule {}
