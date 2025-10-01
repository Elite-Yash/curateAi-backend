import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesService } from './campaigns-template.service';

describe('CampaignsTemplateService', () => {
  let service: TemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplatesService],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
