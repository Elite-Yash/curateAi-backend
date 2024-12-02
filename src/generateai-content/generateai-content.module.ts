import { Module } from '@nestjs/common';
import { GenerateaiContentController } from './generateai-content.controller';
import { GenerateaiContentService } from './generateai-content.service';
import { ConfigModule } from '@nestjs/config';
import { ChatgptService } from 'src/chatgpt/chatgpt.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    })
  ],
  controllers: [GenerateaiContentController],
  providers: [GenerateaiContentService, ChatgptService]
})
export class GenerateaiContentModule {}
