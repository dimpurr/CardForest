import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TemplateService } from '../services/template.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Template, FlattenedTemplate } from '../interfaces/template.interface';

interface CreateTemplateInput {
  name: string;
  inherits_from?: string;
  fields: Record<string, any>;
}

interface UpdateTemplateInput {
  name?: string;
  fields?: Record<string, any>;
  inherits_from?: string;
}

@Resolver('Template')
export class TemplateResolver {
  constructor(private readonly templateService: TemplateService) {}

  @Query('templates')
  async getTemplates(): Promise<Template[]> {
    return this.templateService.getTemplatesWithFields();
  }

  @Query('template')
  async getTemplate(@Args('id') id: string): Promise<Template> {
    return this.templateService.getFullTemplateById(id);
  }

  @ResolveField('flattenedFields')
  getFlattenedFields(@Parent() template: Template) {
    const flattened = this.templateService.flattenTemplate(template);
    return flattened.fields;
  }

  @Mutation('createTemplate')
  @UseGuards(JwtAuthGuard)
  async createTemplate(
    @Args('input') input: CreateTemplateInput,
    @CurrentUser() user: any,
  ): Promise<Template> {
    return this.templateService.createTemplate(
      input.name,
      input.fields,
      input.inherits_from,
      user?._key,
    );
  }

  @Mutation('updateTemplate')
  @UseGuards(JwtAuthGuard)
  async updateTemplate(
    @Args('id') id: string,
    @Args('input') input: UpdateTemplateInput,
  ): Promise<Template> {
    return this.templateService.updateTemplate(id, {
      name: input.name,
      fields: input.fields,
      inherits_from: input.inherits_from,
    });
  }

  @Mutation('deleteTemplate')
  @UseGuards(JwtAuthGuard)
  async deleteTemplate(@Args('id') id: string): Promise<boolean> {
    return this.templateService.deleteTemplate(id);
  }
}
