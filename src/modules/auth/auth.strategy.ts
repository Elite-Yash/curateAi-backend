import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'dotenv';
import { UserService } from 'src/modules/user/user.service';

config()
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
    constructor(private UserService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET, // Use your user-specific secret
        });
    }

    async validate(payload: any) {
        const user = await this.UserService.findByEmail(payload.email);
        return user;
    }
}
