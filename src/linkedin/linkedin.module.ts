import { Module } from '@nestjs/common';
import { LinkedinController } from './linkedin.controller';
import { LinkedinService } from './linkedin.service';
import { ConfigModule } from '@nestjs/config';
import { ChatgptService } from 'src/chatgpt/chatgpt.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    })
  ],
  controllers: [LinkedinController],
  providers: [LinkedinService, ChatgptService]
})
export class LinkedinModule { }
