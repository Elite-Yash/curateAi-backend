import { UserService } from 'src/modules/user/user.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { sendErrorResponse, sendSuccessResponse } from 'src/helpers/commonHelper';
import { CreateSubscriptionDto } from '../user-subscription/dto/createSubscription.dto';
import { CHECKOUT_SESSION_CREATED_SUCCESSFULLY, CUSTOMER_NOT_FOUND, INVALID_PLAN_ID, PLANS_FETCHED_SUCCESSFULLY, SUBSCRIPTION_DETAILS_FETCHED_SUCCESSFULLY } from 'src/constants/stripeMessages';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(
        private readonly configService: ConfigService,
        @Inject(forwardRef(() => UserService)) // Handle circular dependency
        private readonly userService: UserService,

        @InjectRepository(Plan)
        private planRepository: Repository<Plan>,
    ) {
        const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
        if (!stripeSecretKey) {
            throw new Error('Stripe secret key not found. Please check your environment variables.');
        }

        this.stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2024-11-20.acacia',
        });
    }

    async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
        return this.stripe.customers.create({
            email,
            name,
        });
    }

    async getAllPlans(): Promise<any> {
        try {

            const allPlans = await this.planRepository.find();
            return sendSuccessResponse(PLANS_FETCHED_SUCCESSFULLY, allPlans);
        } catch (error) {
            return sendErrorResponse('Failed to fetch plans', error);
        }
    }
    async createSubscription(userId: number, createSubscriptionDto: CreateSubscriptionDto): Promise<any> {
        try {
            const { planId } = createSubscriptionDto;
            const userDetails = await this.userService.findById(userId);
            const customerId = userDetails.stripe_customer_id;

            if (!customerId) {
                return sendErrorResponse(CUSTOMER_NOT_FOUND);
            }

            // Retrieve the Price ID
            const planDetails = await this.planRepository.findOneBy({ stripe_plan_id: planId });

            if (!planDetails) {
                return sendErrorResponse(INVALID_PLAN_ID);
            }
            // Explicitly type the session data
            const sessionData: Stripe.Checkout.SessionCreateParams = {
                mode: 'subscription',
                customer: customerId,
                line_items: [
                    {
                        price: planDetails.stripe_plan_id,
                        quantity: 1,
                    },
                ],
                allow_promotion_codes: true,
                success_url: `${process.env.FRONTEND_URL}/payment/success`,
                cancel_url: `${process.env.FRONTEND_URL}/payment/failure`,
            };

            const session = await this.stripe.checkout.sessions.create(sessionData);

            return sendSuccessResponse(CHECKOUT_SESSION_CREATED_SUCCESSFULLY, session.url);
        } catch (error) {
            console.error('Error creating checkout session:', error);
            return sendErrorResponse('Error creating subscription', error.message);
        }
    }

    async getActiveSubscriptions(customerId: string): Promise<any> {
        try {
            const subscriptions = await this.stripe.subscriptions.list({
                customer: customerId,
                status: 'active',
            });

            return sendSuccessResponse(SUBSCRIPTION_DETAILS_FETCHED_SUCCESSFULLY, subscriptions.data);
        } catch (error) {
            console.error('Error fetching active subscriptions:', error);
            return sendErrorResponse('Error fetching active subscriptions', error.message);
        }
    }

}
