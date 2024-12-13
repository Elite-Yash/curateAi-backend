import { Controller, Get, Post} from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('')
export class StripeController {
    constructor(
        private readonly stripeService: StripeService
    ) { }

    @Get('plans')
    async getAllPlans() {
        return this.stripeService.getAllPlans();
    }
}
