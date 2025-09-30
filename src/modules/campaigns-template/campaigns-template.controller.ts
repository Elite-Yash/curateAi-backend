import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { TemplatesService } from './campaigns-template.service';
import { CreateCampaignsTemplateDto } from './dto/create-campaigns-template.dto';
import { UpdateCampaignsTemplateDto } from './dto/update-campaigns-template.dto';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) { }

  @Post()
  create(@Body() createDto: CreateCampaignsTemplateDto) {
    return this.templatesService.create(createDto);
  }

  // GET with search and pagination
  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('search') search?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const userIdNum = userId ? parseInt(userId, 10) : undefined;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    return this.templatesService.findAll(userIdNum, search, pageNum, limitNum);
  }


  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCampaignsTemplateDto,
  ) {
    return this.templatesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.templatesService.remove(id);
  }
}
