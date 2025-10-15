import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceGroupsService } from './workspace-groups.service';

describe('WorkspaceGroupsService', () => {
  let service: WorkspaceGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkspaceGroupsService],
    }).compile();

    service = module.get<WorkspaceGroupsService>(WorkspaceGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
