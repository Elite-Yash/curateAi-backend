import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsTemplateService } from './campaigns-template.service';

describe('CampaignsTemplateService', () => {
  let service: CampaignsTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CampaignsTemplateService],
    }).compile();

    service = module.get<CampaignsTemplateService>(CampaignsTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
