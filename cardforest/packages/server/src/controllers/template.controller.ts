import { Controller, Get } from '@nestjs/common';
import { TemplateService } from '../services/template.service';

@Controller('/template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  async getTemplates(): Promise<any[]> {
    const templates = await this.templateService.getTemplates();
    return templates;
  }

  @Get('full')
  async getTemplatesWithFields(): Promise<any[]> {
    const templates = await this.templateService.getTemplatesWithFields();
    return templates;
  }
}
