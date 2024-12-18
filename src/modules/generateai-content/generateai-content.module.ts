import { Module } from '@nestjs/common';
import { GenerateaiContentController } from './generateai-content.controller';
import { GenerateaiContentService } from './generateai-content.service';
import { ConfigModule } from '@nestjs/config';
import { ChatgptService } from 'src/chatgpt/chatgpt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forFeature([
      User,
    ]),
    UserModule
  ],
  controllers: [GenerateaiContentController],
  providers: [GenerateaiContentService, ChatgptService]
})
export class GenerateaiContentModule { }
