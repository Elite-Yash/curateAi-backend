import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../user/dto/registerUser.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { sendSuccessResponse } from 'src/helpers/commonHelper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly UserService: UserService,
        private jwtService: JwtService,
    ) { }
    async registerUser(RegisterUserDto: RegisterUserDto): Promise<any> {
        return this.UserService.registerUser(RegisterUserDto);
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.UserService.findByEmail(email);
        if (!user) {
            return false;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return false;
        }
        return user; // Return user details without the password
    }

    async login(user: User) {
        const payload = { id: user.id, email: user.email, subscription_status: user.subscription_status};
        const token = this.jwtService.sign(payload);

        return sendSuccessResponse("Login successful", {auth_token: token});

    }
}

