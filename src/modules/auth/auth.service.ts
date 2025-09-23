import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../user/dto/registerUser.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { generateVerificationToken, sendErrorResponse, sendSuccessResponse } from 'src/helpers/commonHelper';
import { JwtService } from '@nestjs/jwt';
import { sendForgotPasswordEmail } from 'src/helpers/mailhelper';
import { INVALID_TOKEN, PASSWORD_RESET_SUCCESSFUL, SOMETHING_WENT_WRONG } from 'src/constants/userMessages';
import { NotFoundException, UnauthorizedException, ForbiddenException } from "@nestjs/common";


@Injectable()
export class AuthService {

    constructor(
        private readonly UserService: UserService,
        private jwtService: JwtService,
    ) { }
    async registerUser(RegisterUserDto: RegisterUserDto): Promise<any> {
        return this.UserService.registerUser(RegisterUserDto);
    }

    // async validateUser(email: string, password: string): Promise<any> {
    //     const user = await this.UserService.findByEmail(email);
    //     if (!user) {
    //         return false;
    //     }
    //     const isMatch = await bcrypt.compare(password, user.password);
    //     if (!isMatch) {
    //         return false;
    //     }
    //     return user; // Return user details without the password
    // }

    // async login(user: User) {
    //     const payload = { id: user.id, email: user.email, subscription_status: user.subscription_status };
    //     const token = this.jwtService.sign(payload);
    //     const userData = await this.getUserByEmail(user.email)      
    //     const { password, ...safeUserData } = userData; // assuming userData has a password
    //     const respData = { ...safeUserData, auth_token: token };

    //     return sendSuccessResponse("Login successful", respData);
    // }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.UserService.findByEmail(email);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException("Invalid password");
        }

        if (!user.is_email_verified) {
            throw new ForbiddenException("Please verify your email");
        }

        return user;
    }


    async login(user: User) {
        const payload = {
            id: user.id,
            email: user.email,
            subscription_status: user.subscription_status
        };

        const token = this.jwtService.sign(payload);
        const userData = await this.getUserByEmail(user.email);
        const { password, ...safeUserData } = userData;

        const respData = { ...safeUserData, auth_token: token };

        return sendSuccessResponse("Login successful", respData);
    }


    async getUserByEmail(email: string) {
        return await this.UserService.findByEmail(email);
    }


    async forgotPassword(email: string): Promise<boolean> {
        const user = await this.UserService.findByEmail(email);
        if (!user) {
            return null;
        }

        const resetToken = generateVerificationToken();
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 24);

        const updatedUser = await this.UserService.updateUser(user.id, { email_verification_token: resetToken, email_verification_token_expiry: tokenExpiry });
        await sendForgotPasswordEmail(user.email, resetToken);

        if (updatedUser) {

            return true;
        } else {
            return false;
        }
    }

    async resetPassword(token: string, newPassword: string): Promise<any> {
        const user = await this.UserService.findByResetToken(token);

        if (!user) {
            return sendErrorResponse('User not found.', {});

        }

        const currentTime = new Date();
        if (user.email_verification_token_expiry < currentTime) {

            return sendErrorResponse(INVALID_TOKEN, {});

        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedPassword = await this.UserService.updatePassword(user.id, hashedPassword);
        if (updatedPassword) {
            await this.UserService.clearEmailResetToken(user.id);
            return sendSuccessResponse(PASSWORD_RESET_SUCCESSFUL, {});

        } else {

            return sendErrorResponse(SOMETHING_WENT_WRONG, {});

        }
    }

    async emailValidation(token: string): Promise<any> {
        const user = await this.UserService.findByResetToken(token);
        if (!user) {
            return sendErrorResponse('Invalid or expired verification token');
        }

        await this.UserService.updateUser(user.id, {
            is_email_verified: true,
            email_verification_token: null,
        });

        return sendSuccessResponse('Email successfully verified');
    }

}

