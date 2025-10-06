import { Test, TestingModule } from '@nestjs/testing';
import { ProcessActivitiesController } from './process-activities.controller';
import { ProcessActivitiesService } from './process-activities.service';

describe('ProcessActivitiesController', () => {
  let controller: ProcessActivitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessActivitiesController],
      providers: [ProcessActivitiesService],
    }).compile();

    controller = module.get<ProcessActivitiesController>(ProcessActivitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
