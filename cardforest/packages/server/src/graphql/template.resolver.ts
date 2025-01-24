import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TemplateService } from '../services/template.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Template } from '../interfaces/template.interface';

interface CreateTemplateInput {
  name: string;
  extends?: string;
  fields: Record<string, any>;
}

interface UpdateTemplateInput {
  name?: string;
  fields?: Record<string, any>;
}

@Resolver('Template')
export class TemplateResolver {
  constructor(private readonly templateService: TemplateService) {}

  @Query('templates')
  async getTemplates(): Promise<Template[]> {
    return this.templateService.getTemplates();
  }

  @Query('template')
  async getTemplate(@Args('id') id: string): Promise<Template> {
    return this.templateService.getTemplateById(id);
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
      input.extends,
      user._key,
    );
  }

  @Mutation('updateTemplate')
  @UseGuards(JwtAuthGuard)
  async updateTemplate(
    @Args('id') id: string,
    @Args('input') input: UpdateTemplateInput,
  ): Promise<Template> {
    return this.templateService.updateTemplate(id, input);
  }

  @Mutation('deleteTemplate')
  @UseGuards(JwtAuthGuard)
  async deleteTemplate(@Args('id') id: string): Promise<boolean> {
    return this.templateService.deleteTemplate(id);
  }
}
