import { Injectable } from '@nestjs/common';
import { generateVerificationToken, sendErrorResponse, sendSuccessResponse } from 'src/helpers/commonHelper';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/registerUser.dto';
import * as bcrypt from 'bcrypt';
import { USER_ALREADY_EXISTS, USER_REGISTRATION_SUCCESS } from 'src/constants/userMessages';
import { StripeService } from 'src/stripe/stripe.service';
import { SUBSCRIPTION_DETAILS_FETCHED_SUCCESSFULLY } from 'src/constants/stripeMessages';
import { sendVerificationEmail } from 'src/helpers/mailhelper';
import { emitWarning } from 'process';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { WorkspaceGroupsService } from '../workspace-groups/workspace-groups.service';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private stripeService: StripeService,
        private workspacesService: WorkspacesService,
        private workspaceGroupsService: WorkspaceGroupsService,
    ) { }

    async findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email } });
    }
    async registerUser(registerDto: RegisterUserDto): Promise<any> {
        const { name, email, password, confirmPassword } = registerDto;

        try {
            if (password !== confirmPassword) {
                return sendErrorResponse('Password and Confirm Password do not match', {});
            }

            const existingUser = await this.findByEmail(email);
            if (existingUser) {
                return sendErrorResponse(USER_ALREADY_EXISTS, existingUser);
            }

            // 1. Verify Email and create user
            const newUser = await this.verifyEmail(registerDto); 

            // 2. Create default workspace for this user
            const workspace = await this.workspacesService.create(
                { name: 'My Workspace' },
                newUser.id
            );

            // 3. Create default group under that workspace
            await this.workspaceGroupsService.create({
                name: 'My Group',
                workspaceId: workspace.data.id,
            });

            return sendSuccessResponse(USER_REGISTRATION_SUCCESS, newUser);

        } catch (error) {
            console.error('Error during user registration:', error);
            return sendErrorResponse('Something went wrong', {});
        }
    }


    async verifyEmail(registerDto: any): Promise<User> {
        const { name, email, password } = registerDto;
        const resetToken = generateVerificationToken();

        const customerDetails = await this.stripeService.createCustomer(email, name);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            stripe_customer_id: customerDetails.id,
            ai_token_balance: 20000,
            email_verification_token: resetToken,
            is_email_verified: true
        });

        const savedUser = await this.userRepository.save(newUser);

        await sendVerificationEmail(email, resetToken);

        return savedUser; // return the user
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


    async getUserActiveSubscriptions(userId: number) {
        return await this.stripeService.getActiveSubscriptions(userId);
    }

    async findByStripeCustomerId(stripe_customer_id: string): Promise<User> {
        return this.userRepository.findOne({ where: { stripe_customer_id } });
    }


    async updateUserSubscriptionStatus(userId: number, subscription_status: any) {
        return await this.userRepository.update(userId, { subscription_status: subscription_status });
    }

    async updateUserAiTokenBalance(userId: number, ai_token_balance: number) {
        const user = await this.findById(userId);

        const newAiBalance = user.ai_token_balance - ai_token_balance;
        return await this.userRepository.update(userId, { ai_token_balance: newAiBalance });
    }

}
