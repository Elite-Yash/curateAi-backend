import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.respository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { StripeModule } from 'src/stripe/stripe.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { WorkspaceGroupsModule } from '../workspace-groups/workspace-groups.module';

@Module({
  imports: [TypeOrmModule.forFeature([
    User,
  ]),
  forwardRef(() => StripeModule), // Add forwardRef here
  forwardRef(() => WorkspacesModule), 
  forwardRef(() => WorkspaceGroupsModule), 
  ],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule { }
