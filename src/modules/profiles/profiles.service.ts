import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { ExportToGoogleSheetDto } from './dto/export-to-google-sheet.dto';
import { getSheetsClient } from '../../helpers/google-sheets.helper';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(user_id: number, data: CreateProfileDto): Promise<any> {
    let res = {
      status: 200,
      message: 'Profile saved successfully',
      data: {},
    };

    // const existingProfile = await this.profileRepository.findOne({
    //   where: { email: data.email, user_id: user_id },
    // });
    // if (existingProfile) {
    //   res.status = 400;
    //   res.message = 'Profile with this email already exists';
    //   return res;
    // }

    const updatedData = {
      ...data,
      user_id: user_id,
    };
    const profile = this.profileRepository.create(updatedData);
    const savedProfileData = await this.profileRepository.save(profile);

    if (savedProfileData) {
      res.data = savedProfileData;
      return res;
    }
  }

  async findAll(
    user_id: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const [profiles, total] = await this.profileRepository.findAndCount({
      take: limit,
      skip: skip,
      where: {
        deleted_at: IsNull(), // Ensures only active profiles are retrieved
        user_id: user_id, // Filters by user ID
      },
      order: { created_at: 'DESC' },
    });

    return {
      status: 200,
      message: 'Profiles retrieved successfully',
      data: {
        profiles,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  async exporToGoogleSheet(
    user_id: number,
    data: ExportToGoogleSheetDto,
  ): Promise<any> {
    const { google_sheet_url } = data;

    const [profiles] = await this.profileRepository.findAndCount({
      where: {
        deleted_at: IsNull(),
        user_id: user_id,
      },
    });

    const headers = [
      'Name',
      'Email',
      'Position',
      'Organization',
      'URL',
      'Created At',
    ];

    const rows = profiles.map((profile) => [
      profile.name,
      profile.email,
      profile.position,
      profile.organization ?? '',
      profile.url,
      new Date(profile.created_at).toLocaleString(),
    ]);

    const { spreadsheetId } = this.extractSheetInfo(google_sheet_url);

    if (!spreadsheetId) {
      throw new BadRequestException('Invalid Google Sheet URL.');
    }

    const sheets = await getSheetsClient();

    try {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Sheet1!A1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers, ...rows],
        },
      });
    } catch (err: any) {
      if (err.code === 403 || err.code === 401) {
        throw new BadRequestException(
          'Permission denied: Make sure the Google Sheet is shared with the permsissions required.',
        );
      }
      console.error('Google Sheets API error:', err.message);
      throw new InternalServerErrorException(
        'Failed to export data to Google Sheet.',
      );
    }

    return {
      status: 200,
      message: 'Profiles exported successfully.',
      data: {
        total: profiles.length,
      },
    };
  }

  private extractSheetInfo(sheetUrl: string) {
    const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)(?:\/.*gid=([0-9]+))?/;
    const match = sheetUrl.match(regex);

    if (!match) {
      throw new Error('Invalid Google Sheet URL');
    }

    const spreadsheetId = match[1];
    // Optional: sheetId = match[2];
    return { spreadsheetId };
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  async remove(id: number) {
    let res = {
      status: 200,
      message: 'Saved profile removed successfully',
      data: {},
    };

    const currentDatetime = new Date();
    await this.profileRepository.update(id, { deleted_at: currentDatetime });
    return res;
  }
}
