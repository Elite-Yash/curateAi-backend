import { Test, TestingModule } from '@nestjs/testing';
import { GenerateaiContentController } from './generateai-content.controller';

describe('GenerateaiContentController', () => {
  let controller: GenerateaiContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerateaiContentController],
    }).compile();

    controller = module.get<GenerateaiContentController>(GenerateaiContentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
