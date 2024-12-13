import { JwtService } from '@nestjs/jwt';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any || 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT as any || 3306,
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
    StripeModule
  ],
  controllers: [AppController, UserController],
  providers: [AppService, ChatgptService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes(UserController);
  }
}