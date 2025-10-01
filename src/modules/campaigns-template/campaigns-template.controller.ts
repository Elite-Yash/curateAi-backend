import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, Query, Req } from '@nestjs/common';
import { TemplatesService } from './campaigns-template.service';
import { CreateCampaignsTemplateDto } from './dto/create-campaigns-template.dto';
import { UpdateCampaignsTemplateDto } from './dto/update-campaigns-template.dto';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) { }

  @Post()
  create(@Body() createDto: CreateCampaignsTemplateDto, @Req() req: any) {
    const currentUser = req['user'];
    return this.templatesService.create({ ...createDto, user_id: currentUser?.id });
  }


  // GET with search and pagination
  @Get()
  findAll(
    @Req() req: any,
    @Query('userId') userId?: string,
    @Query('search') search?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const currentUser = req['user'];
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    return this.templatesService.findAllByUser(currentUser?.id, search, pageNum, limitNum);
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
