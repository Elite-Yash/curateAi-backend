import { Injectable } from '@nestjs/common';
import { sendErrorResponse, sendSuccessResponse } from 'src/helpers/commonHelper';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/registerUser.dto';
import * as bcrypt from 'bcrypt';
import { USER_ALREADY_EXISTS, USER_REGISTRATION_SUCCESS } from 'src/constants/userMessages';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>

    ) { }

    async findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email } });
    }
    async registerUser(registerDto: RegisterUserDto): Promise<any> {
        const { name, email, password } = registerDto;

        try {
            const existingUser = await this.findByEmail(email);
            if (existingUser) {
                return sendErrorResponse(USER_ALREADY_EXISTS, existingUser);
            }

            // Create a new user
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = this.userRepository.create({
                name,
                email,
                password: hashedPassword,
            });

            await this.userRepository.save(newUser);

            return sendSuccessResponse(USER_REGISTRATION_SUCCESS, {});

        } catch (error) {
            console.error('Error during user registration:', error);

            return sendErrorResponse('Something went wrong', {});

        }
    }

    async findById(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id } });
    }

    async updateUser(id: number, updates: Partial<User>): Promise<User> {
        const user = await this.findById(id);
        Object.assign(user, updates);
        return this.userRepository.save(user);
    }

    async findByResetToken(email_verification_token: string): Promise<User> {
        return this.userRepository.findOne({ where: { email_verification_token } });
    }

    async updatePassword(userId: number, hashedPassword: string): Promise<any> {
        return await this.userRepository.update(userId, { password: hashedPassword });
    }

    async clearEmailResetToken(id: number): Promise<any> {
        return await this.userRepository.update(id, { email_verification_token: null });
    }

}
