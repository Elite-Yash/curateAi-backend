import { Module } from '@nestjs/common';
import { UserSubscriptionController } from './user-subscription.controller';
import { UserSubscriptionService } from './user-subscription.service';
import { StripeModule } from 'src/stripe/stripe.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    StripeModule,
    UserModule
  ],
  controllers: [UserSubscriptionController],
  providers: [UserSubscriptionService]
})
export class UserSubscriptionModule {}
