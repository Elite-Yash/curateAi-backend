import { Module } from '@nestjs/common';
import { TemplatesService } from './campaigns-template.service';
import { TemplatesController } from './campaigns-template.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './entities/campaigns-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Template])],
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [TemplatesService], 
})
export class CampaignsTemplateModule {}
