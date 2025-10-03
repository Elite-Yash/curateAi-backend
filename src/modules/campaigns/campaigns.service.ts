import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { UpdateCampaignDto } from './dto/update-campaign.dto'
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { User } from '../user/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';
import { CsvProfile } from './entities/csv_profiles.entity';
import { validateCsvFile } from 'src/utils/csv-utils';

import { AutomationProcess } from './entities/automation-process.entity';
import { CreateAutomationProcessDto } from './dto/create-automation-process.dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(CsvProfile)
    private csvProfileRepository: Repository<CsvProfile>,

     @InjectRepository(AutomationProcess)
    private automationProcessRepository: Repository<AutomationProcess>,
  ) { }

  /** Create campaign  */
  async createCampaign(userId: number, dto: CreateCampaignDto, file?: Express.Multer.File) {
    // Step 1: Verify user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Step 2: Create campaign entity
    const campaign = this.campaignRepository.create({
      name: dto.name,
      url: dto.url || '',
      type: dto.type,
      message: dto.message,
      status: dto.status || 'active',
      import_type: dto.import_type,
      max_connections: dto.max_connections,
      user,
    });

    const savedCampaign = await this.campaignRepository.save(campaign);

    // Step 3: Handle CSV import if applicable
    if (dto.import_type === 'csv') {
      const requiredFields = ['Name', 'URL',];

      const { validRows } = await validateCsvFile(file, requiredFields);

      // Transform rows before saving
      const rowsToSave = validRows.map((row: any) => ({
        profile_name: row['Name'],
        profile_id: row['profile_id'] || null,
        profile_url: row['URL'],
        email: row['Email'] || null, 
        position: row['Position'] || null,
        organization: row['Organization'] || null,
        created_at: new Date(),
        campaign_id: savedCampaign.id,
        user_id: user.id,
      }));

      if (rowsToSave.length) {
        await this.csvProfileRepository.save(rowsToSave);
      }

      return {
        statusCode: 200,
        message: `Campaign created successfully`,
        data: {
          campaignId: savedCampaign.id,
          profilesCount: rowsToSave.length,
        },
      };
    }

    // Step 4: Return success for non-CSV campaigns
    return {
      statusCode: 200,
      message: 'Campaign created successfully',
      data: {
        campaignId: savedCampaign.id,
      },
    };
  }


  /** Delete campaign only if it belongs to the given userId */
  async deleteCampaign(
    userId: number,
    campaignId: number,
  ): Promise<{ message: string; statusCode: number; deletedCampaignId: number }> {
    try {
      // ensure user exists
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // fetch campaign with its owner
      const campaign = await this.campaignRepository.findOne({
        where: { id: campaignId },
        relations: ['user'],
      });

      // not found or not owned by user
      if (!campaign || !campaign.user || campaign.user.id !== userId) {
        throw new NotFoundException(
          'Campaign not found or you do not have permission to delete it',
        );
      }

      // delete
      await this.campaignRepository.remove(campaign);

      return {
        message: 'Campaign deleted successfully',
        statusCode: 200,
        deletedCampaignId: campaignId,
      };
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(
        `Error while deleting campaign: ${err.message || err}`,
      );
    }

  }

  /** Get campaign by id */
  async getCampaignById(userId: number, campaignId: number): Promise<Campaign> {
    try {
      if (!campaignId) {
        throw new BadRequestException('Campaign ID is required');
      }

      const campaign = await this.campaignRepository.findOne({
        where: { id: campaignId },
        relations: ['user'],
      });

      if (!campaign || campaign.user.id !== userId) {
        throw new NotFoundException('Campaign not found or unauthorized');
      }

      return campaign;
    } catch (err) {
      if (err instanceof BadRequestException || err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException(`Error while fetching campaign: ${err.message || err}`);
    }
  }

  /** Get All campaign */
  async getAllCampaign(userId: number) {
    if (!userId) {
      throw new BadRequestException('Invalid user');
    }

    try {
      const campaigns = await this.campaignRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!campaigns || campaigns.length === 0) {
        throw new NotFoundException('Campaign not found');
      }

      return campaigns;
    } catch (err) {
      throw new InternalServerErrorException(err.message || 'Error while fetching campaigns');
    }
  }

  /** Update campaign */
  async updateCampaign(
    userId: number,
    campaignId: number,
    dto: UpdateCampaignDto,
    file?: Express.Multer.File
  ) {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find the campaign
    const campaign = await this.campaignRepository.findOne({
      where: {
        id: campaignId,
        user: { id: userId }
      }
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Update campaign fields
    const updatedCampaign = this.campaignRepository.merge(campaign, dto);

    // Handle CSV file if provided and import_type is csv
    if (dto.import_type === 'csv' && file) {
      if (!file.mimetype.includes('csv')) {
        throw new BadRequestException('Only CSV files allowed');
      }

      const csvData: any[] = [];

      await new Promise<void>((resolve, reject) => {
        Readable.from(file.buffer)
          .pipe(csvParser())
          .on('data', (row) => {
            csvData.push({
              ...row,
              campaign: campaign,
              user: user,
            });
          })
          .on('end', () => resolve())
          .on('error', (err) => reject(err));
      });

      if (csvData.length) {
        // Delete existing profiles for this campaign (optional)
        // await this.profileRepository.delete({ campaign: { id: campaignId } });

        // Save new profiles
        await this.csvProfileRepository.save(csvData);
      }
    }

    // Save the updated campaign
    await this.campaignRepository.save(updatedCampaign);

    return updatedCampaign;
  }


//** Create-Automation **/
async createAutomation(userId: number, dto: CreateAutomationProcessDto) {
  // Check if campaign exists
  const campaign = await this.campaignRepository.findOne({ where: { id: dto.campaign_id } });
  if (!campaign) {
    throw new NotFoundException(`Campaign with id ${dto.campaign_id} not found`);
  }

  // Check if automation process already exists
  const existing = await this.automationProcessRepository.findOne({
    where: { campaign_id: dto.campaign_id, user_id: userId },
  });

  if (existing) {
    return { automation_id: existing.id, message: 'Automation process already exists' };
  }

  // 3️Create new automation process
  try {
    const newProcess = this.automationProcessRepository.create({
      ...dto,
      user_id: userId,
    });

    await this.automationProcessRepository.save(newProcess);

    return { automation_id: newProcess.id, message: 'Automation process created successfully' };
  } catch (error) {
    console.error('Error creating automation process:', error);
    throw new InternalServerErrorException('Failed to create automation process');
  }
}




}
