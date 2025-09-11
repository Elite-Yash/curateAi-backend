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

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) { }

  /** Create campaign  */
  async createCampaign(userId: number, dto: CreateCampaignDto, file?: Express.Multer.File) {
    // ✅ Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // ✅ Create campaign
    const campaign = this.campaignRepository.create({
      ...dto,
      user, // Pass user entity instead of user_id
    });
    await this.campaignRepository.save(campaign);

    // ✅ Handle CSV upload
    if (dto.import_type === 'csv') {
      if (!file) throw new BadRequestException('CSV file required');
      if (!file.mimetype.includes('csv')) throw new BadRequestException('Only CSV allowed');

      const csvData: any[] = [];

      await new Promise<void>((resolve, reject) => {
        Readable.from(file.buffer)
          .pipe(csvParser())
          .on('data', (row) => {
            csvData.push({
              ...row,
              campaign: campaign, // associate campaign entity
              user,               // associate user entity
            });
          })
          .on('end', () => resolve())
          .on('error', (err) => reject(err));
      });

      if (csvData.length) {
        await this.profileRepository.save(csvData);
      }

      return { message: `Campaign created successfully with ${csvData.length} profiles` };
    }

    return { message: 'Campaign created successfully', statusCode: 200 };
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
        await this.profileRepository.save(csvData);
      }
    }

    // Save the updated campaign
    await this.campaignRepository.save(updatedCampaign);

    return updatedCampaign;
  }

}
