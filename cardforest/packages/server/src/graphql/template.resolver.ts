import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TemplateService } from '../services/template.service';
import { Template, FieldGroup } from '../interfaces/template.interface';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Resolver('Template')
export class TemplateResolver {
  constructor(private readonly templateService: TemplateService) {}

  @Query('templates')
  async getTemplates() {
    return this.templateService.getTemplates();
  }

  @Query('template')
  async getTemplate(@Args('id') id: string) {
    return this.templateService.getTemplateById(id);
  }

  @Query('templateWithInheritance')
  async getTemplateWithInheritance(@Args('id') id: string) {
    return this.templateService.getTemplateWithInheritance(id);
  }

  @Mutation('createTemplate')
  @UseGuards(JwtAuthGuard)
  async createTemplate(
    @Args('input') input: { name: string; fields: FieldGroup[]; inherits_from?: string[] },
    @CurrentUser() user: any,
  ) {
    return this.templateService.createTemplate(
      input.name,
      input.fields,
      input.inherits_from || [],
    );
  }

  @Mutation('updateTemplate')
  @UseGuards(JwtAuthGuard)
  async updateTemplate(
    @Args('id') id: string,
    @Args('input') input: Partial<Template>,
  ) {
    return this.templateService.updateTemplate(id, input);
  }

  @Mutation('deleteTemplate')
  @UseGuards(JwtAuthGuard)
  async deleteTemplate(@Args('id') id: string) {
    return this.templateService.deleteTemplate(id);
  }
}
