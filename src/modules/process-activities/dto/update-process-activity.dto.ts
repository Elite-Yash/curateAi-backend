import { PartialType } from '@nestjs/mapped-types';
import { CreateProcessActivityDto } from './create-process-activity.dto';

export class UpdateProcessActivityDto extends PartialType(CreateProcessActivityDto) {}
