import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { STRIPE_WEBHOOK_EVENT_TYPES } from 'src/constants/stripeWebhookEventTypes';

@Controller('')
export class StripeController {
    constructor(
        private readonly stripeService: StripeService
    ) { }

    @Get('plans')
    async getAllPlans() {
        return this.stripeService.getAllPlans();
    }

    @Post('stripe-webhook')
    async stripeWebhook(@Req() req: any, @Body() body: any) {

        switch (body.type) {
            case STRIPE_WEBHOOK_EVENT_TYPES.CUSTOMER_SUBSCRIPTION_CREATED:
                    await this.stripeService.stripeCustomerSubscriptionCreatedWebhook(body);
                break;
            case STRIPE_WEBHOOK_EVENT_TYPES.CUSTOMER_SUBSCRIPTION_UPDATED:
                    await this.stripeService.stripeCustomerSubscriptionUpdatedWebhook(body);
                break;
            default:
                break;
        }


    }
}
