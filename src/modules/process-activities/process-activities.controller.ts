import { Body, Controller, Post, Req, Res, HttpStatus } from '@nestjs/common';
import { ProcessActivitiesService } from './process-activities.service';
import { CreateProcessActivityDto } from './dto/create-process-activity.dto';

@Controller('process-activities')
export class ProcessActivitiesController {
  constructor(private readonly service: ProcessActivitiesService) { }

  @Post('create-activities')
  async saveLinkedInProfiles(@Req() req, @Body() body: CreateProcessActivityDto,) {
    const userId = req.user?.id;

    if (!userId) {
      return {
        statusCode: 400,
        message: 'Invalid user',
      };
    }

    try {
      await this.service.saveLinkedInProfiles(userId, body);
      return {
        statusCode: 201,
        message: 'Profiles saved successfully',
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'Error saving profiles',
      };
    }
  }

}
