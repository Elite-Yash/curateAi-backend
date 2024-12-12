import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { config } from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './auth.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRES_IN || '1d' },
    }),
    TypeOrmModule.forFeature([ User]), // Ensure all necessary entities and repositories are included

  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService,JwtModule],
})
export class AuthModule { }
