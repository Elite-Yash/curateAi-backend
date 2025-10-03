import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { User } from '../user/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { CsvProfile } from '../campaigns/entities/csv_profiles.entity';
import { AutomationProcess } from './entities/automation-process.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, User, Profile, CsvProfile, AutomationProcess])],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule { }
