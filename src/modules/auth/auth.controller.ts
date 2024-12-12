import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../user/dto/registerUser.dto';
import { LoginUserDto } from '../user/dto/loginUser.dto';
import { sendErrorResponse } from 'src/helpers/commonHelper';
import { LOGIN_FAILED } from 'src/constants/userMessages';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('register')
    @UsePipes(new ValidationPipe()) // Automatically validate incoming data
    async register(@Body() RegisterUserDto: RegisterUserDto): Promise<any> {
        return this.authService.registerUser(RegisterUserDto);
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto): Promise<any> {


        const user = await this.authService.validateUser(loginUserDto.email, loginUserDto.password);
        if (!user) {
            return sendErrorResponse(LOGIN_FAILED, {});

        } else {

            return user;
        }

    }

}
