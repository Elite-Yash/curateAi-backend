import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './entities/workspace.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { User } from '../user/entities/user.entity';
import { sendErrorResponse, sendSuccessResponse } from 'src/helpers/commonHelper';
import { WorkspaceGroupsService } from '../workspace-groups/workspace-groups.service';


@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private repo: Repository<Workspace>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

  ) {}

  async create(dto: CreateWorkspaceDto, userId: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) return sendErrorResponse('User not found', {});

      const workspace = this.repo.create({ ...dto, user });
      const saved = await this.repo.save(workspace);
      const { user:_, ...workspaceOnly } = saved;
      return sendSuccessResponse('Workspace created successfully', workspaceOnly);
    } catch (err) {
      return sendErrorResponse('Failed to create workspace', {});
    }
  }

  async findAll(userId: number) {
    try {
      const workspaces = await this.repo.find({ where: { user: { id: userId } } });
      return sendSuccessResponse('Workspaces fetched successfully', workspaces);
    } catch (err) {
      return sendErrorResponse('Failed to fetch workspaces', {});
    }
  }

  async findOne(userId: number, id: number) {
    try {
      const workspace = await this.repo.findOne({ where: { id, user: { id: userId } } });
      if (!workspace) return sendErrorResponse('Workspace not found', {});
      return sendSuccessResponse('Workspace fetched successfully', workspace);
    } catch (err) {
      return sendErrorResponse('Failed to fetch workspace', {});
    }
  }

  async update(userId: number, id: number, dto: UpdateWorkspaceDto) {
    try {
      const workspace = await this.repo.findOne({ where: { id, user: { id: userId } } });
      if (!workspace) return sendErrorResponse('Workspace not found', {});
      Object.assign(workspace, dto);
      const updated = await this.repo.save(workspace);
      return sendSuccessResponse('Workspace updated successfully', updated);
    } catch (err) {
      return sendErrorResponse('Failed to update workspace', {});
    }
  }

  async remove(userId: number, id: number) {
    try {
      const workspace = await this.repo.findOne({ where: { id, user: { id: userId } } });
      if (!workspace) return sendErrorResponse('Workspace not found', {});
      await this.repo.remove(workspace);
      return sendSuccessResponse('Workspace deleted successfully', { id });
    } catch (err) {
      return sendErrorResponse('Failed to delete workspace', {});
    }
  }
}
