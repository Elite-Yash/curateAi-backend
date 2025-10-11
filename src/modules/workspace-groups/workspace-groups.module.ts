import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceGroupsService } from './workspace-groups.service';
import { WorkspaceGroupsController } from './workspace-groups.controller';
import { WorkspaceGroup } from './entities/workspace-group.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Workspace } from '../workspaces/entities/workspace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceGroup, User, Workspace]), forwardRef(() => UserModule),],
  controllers: [WorkspaceGroupsController],
  providers: [WorkspaceGroupsService],
  exports: [WorkspaceGroupsService],
})
export class WorkspaceGroupsModule { }
