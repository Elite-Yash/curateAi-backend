import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateSubscriptionDto } from './dto/createSubscription.dto';

@Controller('')
export class StripeController {
    constructor(
        private readonly stripeService: StripeService
    ) { }

    @Get('plans')
    async getAllPlans() {
        return this.stripeService.getAllPlans();
    }

    @Post('create-subscription')
    @UsePipes(ValidationPipe)
    async createSubscription(@Req() req, @Body() createSubscriptionDto: CreateSubscriptionDto) {
        return this.stripeService.createSubscription(req['user'].id, createSubscriptionDto);
    }
}
