import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { TokenService } from './token.service';
import { Request, Response } from 'express';
@Controller('token')
export class TokenController {
    constructor(private tokenService: TokenService) { }

    @Get('refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        try {
            const { accessToken } = req.cookies;
            const userData = await this.tokenService.refresh(accessToken);
            return res.json(userData);
        } catch (error) {
            console.log(error)
            return res.status(500).send(error);
        }
    }




}
