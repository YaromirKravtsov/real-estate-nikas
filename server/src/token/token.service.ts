import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SaveTokenDto } from './dto/save-token.dto';
import { PayloadDto } from './dto/payload.dto';
import { UserService } from 'src/user/user.service';
import { Op } from 'sequelize';

import { JwtPayload, sign, verify } from 'jsonwebtoken';
import * as crypto from 'crypto';
@Injectable()
export class TokenService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService) { }

    generateToken(payload: PayloadDto): string {
        try {
            const accessToken = sign({ ...payload }, process.env.JWT_ACCESS_SECRET, { expiresIn: '30d' });
          
            return accessToken;
        } catch (error) {
            throw error;
        }
    }

    validateAccessToken(token) {
        try {

            const userData = verify(token, process.env.JWT_ACCESS_SECRET) as JwtPayload;
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = verify(token, process.env.JWT_REFRESH_SECRET) as JwtPayload;
            return userData;
        } catch (e) {
            throw e;
        }
    }

    async refresh(refreshToken, deviceId) {
        console.log(refreshToken, deviceId)
        if (!refreshToken) {
            throw new UnauthorizedException(HttpStatus.BAD_REQUEST);
        }
        const userData = this.validateRefreshToken(refreshToken);

        if (!userData) {
            throw new UnauthorizedException(HttpStatus.BAD_REQUEST);
        }

        const user = await this.userService.findByPk(userData.userId);

        const payload: PayloadDto = {
            userId: user.id,
            role: user.role,
            avatarLink: process.env.STATIC_URL + user.avatarLink,
            firstName: user.firstName,
            lastName: user.lastName,
        }
        const token = this.generateToken(payload);

        return token;
    }

    generateDeviceId(): string {
        return crypto.randomBytes(Math.ceil(20 / 2))
            .toString('hex')
            .slice(0, 20);
    }


}
