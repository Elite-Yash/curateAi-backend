import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkspaceDto } from './create-workspace.dto';
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {
    @IsString()
    @IsNotEmpty()
    name: string;
}

