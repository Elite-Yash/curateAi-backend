import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { WorkspaceGroupsService } from './workspace-groups.service';
import { CreateWorkspaceGroupDto } from './dto/create-workspace-group.dto';
import { UpdateWorkspaceGroupDto } from './dto/update-workspace-group.dto';

@Controller('workspace-groups')
export class WorkspaceGroupsController {
  constructor(private readonly workspaceGroupsService: WorkspaceGroupsService) { }

  @Post()
  async create(@Body() dto: CreateWorkspaceGroupDto) {
    return this.workspaceGroupsService.create(dto);
  }

  @Get('workspace/:workspaceId')
  async findAll(@Param('workspaceId') workspaceId: number) {
    return this.workspaceGroupsService.findAll(workspaceId);
  }

  @Get('with-groups')
  async findAllWithGroups(@Req() req) {
    const userId = req.user.id;
    return this.workspaceGroupsService.findAllWorkspacesWithGroups(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.workspaceGroupsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateWorkspaceGroupDto) {
    return this.workspaceGroupsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.workspaceGroupsService.remove(id);
  }
}
