import { Controller, Post, Body, UsePipes, ValidationPipe, Req } from '@nestjs/common';
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
}
