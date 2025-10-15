import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkspaceGroup } from './entities/workspace-group.entity';
import { CreateWorkspaceGroupDto } from './dto/create-workspace-group.dto';
import { UpdateWorkspaceGroupDto } from './dto/update-workspace-group.dto';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { sendErrorResponse, sendSuccessResponse } from 'src/helpers/commonHelper';

@Injectable()
export class WorkspaceGroupsService {
  constructor(
    @InjectRepository(WorkspaceGroup)
    private groupRepo: Repository<WorkspaceGroup>,

    @InjectRepository(Workspace)
    private workspaceRepo: Repository<Workspace>,
  ) { }

  async create(dto: CreateWorkspaceGroupDto) {
    try {
      const workspace = await this.workspaceRepo.findOne({ where: { id: dto.workspaceId } });
      if (!workspace) return sendErrorResponse('Workspace not found', {});

      const group = this.groupRepo.create({ name: dto.name, workspace });
      const saved = await this.groupRepo.save(group);
      return sendSuccessResponse('Workspace group created successfully', saved);
    } catch (err) {
      return sendErrorResponse('Failed to create workspace group', {});
    }
  }

  async findAll(workspaceId: number) {
    try {
      const groups = await this.groupRepo.find({ where: { workspace: { id: workspaceId } } });
      return sendSuccessResponse('Workspace groups fetched successfully', groups);
    } catch (err) {
      return sendErrorResponse('Failed to fetch workspace groups', {});
    }
  }

  async findAllWorkspacesWithGroups(userId: number) {
    try {
      const workspaces = await this.workspaceRepo.find({
        where: { user: { id: userId } },
        relations: ['groups'],
      });
      return sendSuccessResponse('Workspaces with groups fetched successfully', workspaces);
    } catch (err) {
      console.error(err);
      return sendErrorResponse('Failed to fetch workspaces with groups', {});
    }
  }


  async findOne(id: number) {
    try {
      const group = await this.groupRepo.findOne({ where: { id } });
      if (!group) return sendErrorResponse('Workspace group not found', {});
      return sendSuccessResponse('Workspace group fetched successfully', group);
    } catch (err) {
      return sendErrorResponse('Failed to fetch workspace group', {});
    }
  }

  async update(id: number, dto: UpdateWorkspaceGroupDto) {
    try {
      const group = await this.groupRepo.findOne({ where: { id } });
      if (!group) return sendErrorResponse('Workspace group not found', {});
      Object.assign(group, dto);
      const updated = await this.groupRepo.save(group);
      return sendSuccessResponse('Workspace group updated successfully', updated);
    } catch (err) {
      return sendErrorResponse('Failed to update workspace group', {});
    }
  }

  async remove(id: number) {
    try {
      const group = await this.groupRepo.findOne({ where: { id } });
      if (!group) return sendErrorResponse('Workspace group not found', {});
      await this.groupRepo.remove(group);
      return sendSuccessResponse('Workspace group deleted successfully', { id });
    } catch (err) {
      return sendErrorResponse('Failed to delete workspace group', {});
    }
  }
}
