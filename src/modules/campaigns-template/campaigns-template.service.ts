import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Template } from './entities/campaigns-template.entity';
import { CreateCampaignsTemplateDto } from './dto/create-campaigns-template.dto';
import { UpdateCampaignsTemplateDto } from './dto/update-campaigns-template.dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepo: Repository<Template>,
  ) {}

  async create(createDto: CreateCampaignsTemplateDto) {
    const template = this.templateRepo.create(createDto);
    await this.templateRepo.save(template);
    return {
      message: 'Template created successfully',
      data: template,
    };
  }

  // Fetch all with pagination and search
  async findAll(userId: number, search?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [templates, total] = await this.templateRepo.findAndCount({
      where: search
        ? { user_id: userId, name: Like(`%${search}%`) }
        : { user_id: userId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      message: 'Templates fetched successfully',
      data: templates,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit,
      },
    };
  }

  async update(id: number, updateDto: UpdateCampaignsTemplateDto) {
    const template = await this.templateRepo.findOne({ where: { id } });
    if (!template) throw new NotFoundException('Template not found');

    Object.assign(template, updateDto);
    await this.templateRepo.save(template);

    return {
      message: 'Template updated successfully',
      data: template,
    };
  }

  async remove(id: number) {
    const template = await this.templateRepo.findOne({ where: { id } });
    if (!template) throw new NotFoundException('Template not found');

    await this.templateRepo.softRemove(template);
    return { message: 'Template deleted successfully' };
  }
}
