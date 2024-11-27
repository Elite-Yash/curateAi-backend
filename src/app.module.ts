import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinkedinModule } from './linkedin/linkedin.module';
import { ChatgptService } from './chatgpt/chatgpt.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [LinkedinModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, ChatgptService],
})
export class AppModule {}
