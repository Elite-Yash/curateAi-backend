import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../user/dto/registerUser.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { LoginUserDto } from '../user/dto/loginUser.dto';
import { sendSuccessResponse } from 'src/helpers/commonHelper';

@Injectable()
export class AuthService {

    constructor(
        private readonly UserService: UserService,
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

}

