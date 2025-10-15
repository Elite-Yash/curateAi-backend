import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessActivity } from './entities/process-activity.entity';
import { CreateProcessActivityDto } from './dto/create-process-activity.dto';
import { CsvProfile } from '../campaigns/entities/csv_profiles.entity';
import { getProfileId } from 'src/utils/csv-utils';

@Injectable()
export class ProcessActivitiesService {
  constructor(
    @InjectRepository(CsvProfile)
    private readonly csvProfileRepository: Repository<CsvProfile>,
    @InjectRepository(ProcessActivity)
    private readonly processActivityRepo: Repository<ProcessActivity>,
  ) { }

  async saveLinkedInProfiles(userId: number, dto: CreateProcessActivityDto) {
    const { campaignId, profiles, automation_id, type } = dto;
    console.log(". ~ saveLinkedInProfiles ~ type:", type)
    console.log(". ~ saveLinkedInProfiles ~ automation_id:", automation_id)
    console.log(". ~ saveLinkedInProfiles ~ profiles:", profiles)
    console.log(". ~ saveLinkedInProfiles ~ campaignId:", campaignId)

    if (!campaignId || !Array.isArray(profiles)) {
      throw new Error('Invalid data');
    }

    for (const profile of profiles) {
      const profileId = getProfileId(profile.profileLink);

      const existingProfile = await this.csvProfileRepository.findOne({
        where: { campaign_id: campaignId, profile_url: profile.profileLink },
      });

      let message = '';
      if (existingProfile) {
        await this.csvProfileRepository.update(existingProfile.id, {
          profile_name: profile.name,
          profile_url: profile.profileLink,
          profile_id: profileId,
          campaign_id: campaignId,
          user_id: userId,
        });

        message =
          type === 'message'
            ? `${profile.name} sent a message`
            : type === 'connect'
              ? `${profile.name} sent a connection request`
              : `${profile.name} updated their LinkedIn profile`;
      } else {
        await this.csvProfileRepository.save({
          campaign_id: campaignId,
          user_id: userId,
          profile_name: profile.name,
          profile_url: profile.profileLink,
          profile_id: profileId,
        });

        message =
          type === 'message'
            ? `${profile.name} sent a message`
            : type === 'connect'
              ? `${profile.name} sent a connection request`
              : `${profile.name} added a new LinkedIn profile`;
      }

      await this.processActivityRepo.save({
        user_id: userId,
        automation_id: automation_id,
        profile_id: profileId,
        status: 'completed',
        message: message,
      });
    }
  }
}
