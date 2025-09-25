import { Controller, Post, Body, UseGuards, Req, UploadedFile, UseInterceptors, Delete, Param, Get, Put, UsePipes, ValidationPipe, ParseIntPipe, Query } from '@nestjs/common';
import { CampaignService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) { }

  //** Create campaign  */
  @Post("create-campaign")
  @UseInterceptors(FileInterceptor('csvFile'))
  async create(
    @Req() req,
    @Body() createCampaignDto: CreateCampaignDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    return this.campaignService.createCampaign(userId, createCampaignDto, file);
  }

  /** Delete campaign only if it belongs to the given userId */
  @Delete(':id')
  async deleteCampaign(
    @Req() req: any,
    @Param('id') campaignId: number
  ) {
    const userId = req.user.id;
    return this.campaignService.deleteCampaign(userId, campaignId);
  }

  /** Get campaign by id */
  @Get(':campaignId')
  async getCampaignById(@Req() req, @Param('campaignId') campaignId: number) {
    const userId = req.user?.id;

    if (!userId) {
      return {
        statusCode: 400,
        message: 'Invalid user',
        data: null,
      };
    }

    try {
      const campaign = await this.campaignService.getCampaignById(userId, campaignId);
      return {
        statusCode: 200,
        message: 'Campaign fetched successfully',
        data: campaign,
      };
    } catch (err) {
      return {
        statusCode: err.getStatus ? err.getStatus() : 500,
        message: err.message || 'Error while fetching campaign',
        data: null,
      };
    }
  }

  /** Get All campaign */
  @Get('')
  async getAllCampaign(@Req() req) {
    const userId = req.user?.id;

    try {
      const campaigns = await this.campaignService.getAllCampaign(userId);

      return {
        statusCode: 200,
        message: 'Campaign fetched successfully',
        data: campaigns,
      };
    } catch (err) {
      return {
        statusCode: err.getStatus ? err.getStatus() : 500,
        message: err.message || 'Error while fetching campaigns',
        data: null,
      };
    }
  }

  /** Update campaign */
  @Put(':campaignId')
  @UseInterceptors(FileInterceptor('file')) // ← Extracts file from FormData
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateCampaign(
    @Param('campaignId', ParseIntPipe) campaignId: number,
    @Body() dto: UpdateCampaignDto, // ← Handles regular fields
    @UploadedFile() file: Express.Multer.File, // ← Handles file separately
    @Req() req: any,
    @Query('userId') userIdQuery?: string,
  ) {
    const userId =
      (req && req.user && typeof req.user.id === 'number' && req.user.id) ||
      (userIdQuery ? parseInt(userIdQuery, 10) : undefined) ||
      1;

    try {
      const updatedCampaign = await this.campaignService.updateCampaign(userId, campaignId, dto);

      return {
        statusCode: 200,
        message: 'Campaign updated successfully',
        data: updatedCampaign,
      };
    } catch (err) {
      const status = err.getStatus ? err.getStatus() : 500;
      return {
        statusCode: status,
        message: err.message || 'Error while updating campaign',
        data: null,
      };
    }
  }



}
