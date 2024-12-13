import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { sendErrorResponse, sendSuccessResponse } from 'src/helpers/commonHelper';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private readonly configService: ConfigService) {
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
        const productId = process.env.STRIPE_PRODUCT_ID; // Retrieve product ID from environment
        if (!productId) {
            return sendErrorResponse('STRIPE_PRODUCT_ID not set in the environment variables');
        }

        const plans = await this.stripe.plans.list({
            product: productId,
            limit: 10,
        });

        return sendSuccessResponse('Plans fetched successfully', plans);
    }

}
