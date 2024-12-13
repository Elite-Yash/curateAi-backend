import { forwardRef, Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigModule } from '@nestjs/config';
import { StripeController } from './stripe.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UserModule)
  ],
  providers: [StripeService],
  exports: [StripeService],
  controllers: [StripeController],
})
export class StripeModule { }
