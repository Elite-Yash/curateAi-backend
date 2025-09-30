import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsTemplateController } from './campaigns-template.controller';
import { CampaignsTemplateService } from './campaigns-template.service';

describe('CampaignsTemplateController', () => {
  let controller: CampaignsTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignsTemplateController],
      providers: [CampaignsTemplateService],
    }).compile();

    controller = module.get<CampaignsTemplateController>(CampaignsTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
