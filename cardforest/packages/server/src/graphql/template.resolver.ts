import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TemplateService } from '../services/template.service';
import { Template } from '../interfaces/template.interface';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
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

  @Query('flattenedTemplate')
  async getFlattenedTemplate(@Args('id') id: string) {
    return this.templateService.getFullTemplateById(id);
  }

  @Mutation('createTemplate')
  @UseGuards(AuthGuard)
  async createTemplate(
    @Args('input') input: { name: string; fields: any[]; inherits_from?: string[] },
    @CurrentUser() user: any,
  ) {
    return this.templateService.createTemplate(input, user);
  }

  @Mutation('updateTemplate')
  @UseGuards(AuthGuard)
  async updateTemplate(
    @Args('id') id: string,
    @Args('input') input: Partial<Template>,
  ) {
    return this.templateService.updateTemplate(id, input);
  }

  @Mutation('deleteTemplate')
  @UseGuards(AuthGuard)
  async deleteTemplate(@Args('id') id: string) {
    return this.templateService.deleteTemplate(id);
  }
}
