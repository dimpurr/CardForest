import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ModelService } from '../services/model.service';
import { Model } from '../interfaces/model.interface';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Resolver('Model')
export class ModelResolver {
  constructor(private readonly modelService: ModelService) {}

  @Query('models')
  async getModels() {
    return this.modelService.getModels();
  }

  @Query('model')
  async getModel(@Args('id') id: string) {
    return this.modelService.getModelById(id);
  }

  @Query('flattenedModel')
  async getFlattenedModel(@Args('id') id: string) {
    return this.modelService.getFullModelById(id);
  }

  @Mutation('createModel')
  @UseGuards(AuthGuard)
  async createModel(
    @Args('input') input: { name: string; fields: any[]; inherits_from?: string[] },
    @CurrentUser() user: any,
  ) {
    return this.modelService.createModel(input, user);
  }

  @Mutation('updateModel')
  @UseGuards(AuthGuard)
  async updateModel(
    @Args('id') id: string,
    @Args('input') input: Partial<Model>,
  ) {
    return this.modelService.updateModel(id, input);
  }

  @Mutation('deleteModel')
  @UseGuards(AuthGuard)
  async deleteModel(@Args('id') id: string) {
    return this.modelService.deleteModel(id);
  }
}
