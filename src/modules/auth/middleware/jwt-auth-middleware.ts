import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService,
        private userService: UserService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header missing');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Unauthorised Request.Token missing');
        }

        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET
            });
            req['user'] = payload;
            next();
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
