import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CrmService } from './crm.service';
import { CreateCrmDto } from './dto/create-crm.dto';
import { addToCRM } from './dto/add-to-crm.dto';

@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Post()
  create(@Body() createCrmDto: CreateCrmDto) {
    return this.crmService.create(createCrmDto);
  }

  @Post('/add-to-crm')
  addToCRM(@Body() addTOCRMDto: addToCRM) {
    return this.crmService.addToZenDeskCRMService(addTOCRMDto);
  }
}
