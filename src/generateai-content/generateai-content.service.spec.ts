import { Test, TestingModule } from '@nestjs/testing';
import { GenerateaiContentService } from './generateai-content.service';

describe('GenerateaiContentService', () => {
  let service: GenerateaiContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateaiContentService],
    }).compile();

    service = module.get<GenerateaiContentService>(GenerateaiContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
