import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkspaceGroupDto } from './create-workspace-group.dto';

export class UpdateWorkspaceGroupDto extends PartialType(CreateWorkspaceGroupDto) {}
