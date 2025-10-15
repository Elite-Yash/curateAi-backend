import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  async create(@Req() req, @Body() dto: CreateWorkspaceDto) {
    const userId = req.user.id;
    return this.workspacesService.create(dto, userId);
  }

  @Get()
  async findAll(@Req() req) {
    const userId = req.user.id;
    return this.workspacesService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: number) {
    const userId = req.user.id;
    return this.workspacesService.findOne(userId, id);
  }

  @Patch(':id')
  async update(@Req() req, @Param('id') id: number, @Body() dto: UpdateWorkspaceDto) {
    const userId = req.user.id;
    return this.workspacesService.update(userId, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number) {
    const userId = req.user.id;
    return this.workspacesService.remove(userId, id);
  }
}
