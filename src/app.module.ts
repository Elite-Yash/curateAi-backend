import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatgptService } from './chatgpt/chatgpt.service';
import { ConfigModule } from '@nestjs/config';
import { GenerateaiContentModule } from './generateai-content/generateai-content.module';

@Module({
  imports: [ConfigModule.forRoot(), GenerateaiContentModule],
  controllers: [AppController],
  providers: [AppService, ChatgptService],
})
export class AppModule {}
