import { Test, TestingModule } from '@nestjs/testing';
import { ProcessActivitiesService } from './process-activities.service';

describe('ProcessActivitiesService', () => {
  let service: ProcessActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessActivitiesService],
    }).compile();

    service = module.get<ProcessActivitiesService>(ProcessActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
