import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) { }

  async create(user_id: number, data: CreateProfileDto): Promise<any> {
    let res = {
      status: 200,
      message: "Profile saved successfully",
      data: {}
    };

    const existingProfile = await this.profileRepository.findOne({ where: { email: data.email, user_id: user_id } });
    if (existingProfile) {
      res.status = 400;
      res.message = "Profile with this email already exists";
      return res;
    }

    const updatedData = {
      ...data,
      user_id: user_id
    };
    const profile = this.profileRepository.create(updatedData);
    const savedProfileData = await this.profileRepository.save(profile);

    if (savedProfileData) {
      res.data = savedProfileData;
      return res;
    }
  }

  async findAll(user_id: number, page: number = 1, limit: number = 10): Promise<any> {
    const skip = (page - 1) * limit;

    const [profiles, total] = await this.profileRepository.findAndCount({
      take: limit,
      skip: skip,
      where: {
        deleted_at: IsNull(),  // Ensures only active profiles are retrieved
        user_id: user_id       // Filters by user ID
      },
      order: { created_at: "DESC" }
    });

    return {
      status: 200,
      message: "Profiles retrieved successfully",
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

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  async remove(id: number) {
    let res = {
      status: 200,
      message: "Saved profile removed successfully",
      data: {}
    };

    const currentDatetime = new Date();
    await this.profileRepository.update(id, { deleted_at: currentDatetime });
    return res;
  }
}
