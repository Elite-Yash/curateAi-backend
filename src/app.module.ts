import { JwtService } from '@nestjs/jwt';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatgptService } from './chatgpt/chatgpt.service';
import { GenerateaiContentModule } from './modules/generateai-content/generateai-content.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './modules/user/user.respository';
import { UserController } from './modules/user/user.controller';
import { JwtAuthMiddleware } from './modules/auth/middleware/jwt-auth-middleware';
import { StripeModule } from './stripe/stripe.module';
import { StripeController } from './stripe/stripe.controller';
import { UserSubscriptionModule } from './user-subscription/user-subscription.module';
import { UserSubscriptionController } from './user-subscription/user-subscription.controller';
import { GenerateaiContentController } from './modules/generateai-content/generateai-content.controller';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { ProfilesController } from './modules/profiles/profiles.controller';
import { CommentsModule } from './modules/comments/comments.module';
import { CommentsController } from './modules/comments/comments.controller';
import { CrmController } from './modules/crm/crm.controller';
import { CrmService } from './modules/crm/crm.service';
import { CrmModule } from './modules/crm/crm.module';
import { CampaignsController } from './modules/campaigns/campaigns.controller';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { TemplatesController } from './modules/campaigns-template/campaigns-template.controller';
import { CampaignsTemplateModule } from './modules/campaigns-template/campaigns-template.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as any) || 'mysql',
      host: process.env.DB_HOST,
      port: (process.env.DB_PORT as any) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: false,

    }),
    GenerateaiContentModule,
    UserModule,
    AuthModule,
    UserRepository,
    StripeModule,
    UserSubscriptionModule,
    ProfilesModule,
    CommentsModule,
    CrmModule,
    CampaignsModule,
    CampaignsTemplateModule,
  ],
  controllers: [
    AppController,
    UserController,
    StripeController,
    UserSubscriptionController,
    CrmController,
    TemplatesController,
  ],
  providers: [AppService, ChatgptService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes(
        UserController,
        UserSubscriptionController,
        GenerateaiContentController,
        ProfilesController,
        CommentsController,
        CrmController,
        CampaignsController,
        TemplatesController,
      );
  }
}
