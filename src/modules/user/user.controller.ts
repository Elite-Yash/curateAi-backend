import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('active-subscriptions')
    async getUserActiveSubscriptions(@Req() req) {
        return this.userService.getUserActiveSubscriptions(req['user'].id);
    }

    @Get('get-customer-portal-link')
    async getCustomerPortalLink(@Req() req) {
        return this.userService.getCustomerPortalLink(req['user'].id);
    }
}
