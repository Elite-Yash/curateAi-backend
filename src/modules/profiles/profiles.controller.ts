import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  Req,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ExportToGoogleSheetDto } from './dto/export-to-google-sheet.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Req() req: Request,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    const currentUser = req['user'];
    return await this.profilesService.create(currentUser.id, createProfileDto);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() req: Request,
  ) {
    const currentUser = req['user'];

    return this.profilesService.findAll(
      currentUser.id,
      Number(page),
      Number(limit),
    );
  }

  @Post('/export-to-google-sheet')
  async exporToGoogleSheet(
    @Req() req: Request,
    @Body() exportToGoogleSheetDto: ExportToGoogleSheetDto,
  ) {
    const currentUser = req['user'];
    return await this.profilesService.exporToGoogleSheet(
      currentUser.id,
      exportToGoogleSheetDto,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
