import { Controller, Post, Body, UsePipes, ValidationPipe, Req, Get } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/createSubscription.dto';
import { StripeService } from 'src/stripe/stripe.service';

@Controller('user-subscription')
export class UserSubscriptionController {
    constructor(
        private readonly stripeService: StripeService
    ) { }

    @Post('create-subscription')
    @UsePipes(ValidationPipe)
    async createSubscription(@Req() req, @Body() createSubscriptionDto: CreateSubscriptionDto) {
        return this.stripeService.createSubscription(req['user'].id, createSubscriptionDto);
    }

    @Post('upgrade-subscription')
    @UsePipes(ValidationPipe)
    async changeSubscription(@Req() req, @Body() createSubscriptionDto: CreateSubscriptionDto) {
        return this.stripeService.changeSubscription(req['user'].id, createSubscriptionDto);
    }

    @Get('check-subscription')
    @UsePipes(ValidationPipe)
    async checkSubscription(@Req() req) {
        return this.stripeService.checkSubscription(req['user'].id,);
    }

    @Get('get-customer-portal-link')
    async getCustomerPortalLink(@Req() req) {
        return this.stripeService.getCustomerPortalLink(req['user'].id);
    }

    @Get('cancel-subscription')
    async cancelSubscription(@Req() req) {
        return this.stripeService.cancelSubscription(req['user'].id);
    }
}
