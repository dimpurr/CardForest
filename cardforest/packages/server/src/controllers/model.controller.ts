import { Controller, Get } from '@nestjs/common';
import { ModelService } from '../services/model.service';

@Controller('/model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Get()
  async getModels(): Promise<any[]> {
    const models = await this.modelService.getModels();
    return models;
  }

  @Get('full')
  async getModelsWithFields(): Promise<any[]> {
    const models = await this.modelService.getModelsWithFields();
    return models;
  }
}
