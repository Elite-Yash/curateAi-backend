import { forwardRef, Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigModule } from '@nestjs/config';
import { StripeController } from './stripe.controller';
import { UserModule } from 'src/modules/user/user.module';
import { Plan } from './entities/plan.entity';
import { PlanRepository } from './plan.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscription } from 'src/user-subscription/entities/user-subscription.entity';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([
      Plan,
      UserSubscription
    ]), // Import the Plan entity here],
  ],
  providers: [StripeService, PlanRepository],
  exports: [StripeService],
  controllers: [StripeController],
})
export class StripeModule { }
