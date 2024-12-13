import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../user/dto/registerUser.dto';
import { LoginUserDto } from '../user/dto/loginUser.dto';
import { sendErrorResponse, sendSuccessResponse } from 'src/helpers/commonHelper';
import { LOGIN_FAILED, PASSWORD_RESET_EMAIL_SENT_SUCCESSFULLY, SOMETHING_WENT_WRONG, USER_NOT_FOUND } from 'src/constants/userMessages';
import { ForgotPasswordDto } from '../user/dto/forgotPassword.dto';
import { ResetPasswordDto } from '../user/dto/resetPassword.dto';

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

            const loginResponse = await this.authService.login(user);

            return loginResponse;
        }

    }

    @Post('forgot-password')
    async forgotPassword(@Body() ForgotPasswordDto: ForgotPasswordDto) {
        try {
            const { email } = ForgotPasswordDto;
            const user = await this.authService.forgotPassword(email);

            if (user === null) {

                return sendErrorResponse(USER_NOT_FOUND, {});

            } else if (!user) {
                return sendErrorResponse(SOMETHING_WENT_WRONG, {});

            }

            return sendSuccessResponse(PASSWORD_RESET_EMAIL_SENT_SUCCESSFULLY, {});

        } catch (error) {
            return sendErrorResponse(error.message, {});

        }
    }

    @Post('reset-password')
    @UsePipes(new ValidationPipe())
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<any> {


        try {
            const { token, password } = resetPasswordDto;
            const isReset = await this.authService.resetPassword(token, password);

            return isReset;
        } catch (error) {
            return sendErrorResponse(error.message, {});

        }
    }
}
