import { Injectable, Logger } from '@nestjs/common';
import { NotFoundError, ValidationError, ForbiddenError } from '../common/errors';
import { ModelRepository } from '../repositories/model.repository';
import {
  Model,
  FieldDefinition,
  FieldGroup,
  FlattenedModel,
} from '../interfaces/model.interface';

@Injectable()
export class ModelService {
  private readonly logger = new Logger(ModelService.name);

  constructor(private readonly modelRepository: ModelRepository) {}

  async getModels(): Promise<FlattenedModel[]> {
    try {
      this.logger.log('Getting all models');
      const models = await this.getModelsWithFields();
      return models.map((model) => this.flattenModel(model));
    } catch (error) {
      this.logger.error(`Failed to get models: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getModelsWithFields(): Promise<Model[]> {
    try {
      this.logger.log('Getting all models with fields');
      return await this.modelRepository.findAllModels();
    } catch (error) {
      this.logger.error(`Failed to get models with fields: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getModelById(id: string): Promise<FlattenedModel> {
    try {
      this.logger.log(`Getting model by ID: ${id}`);
      const model = await this.getModelWithInheritance(id);
      if (!model) {
        throw new NotFoundError(`Model with ID ${id} not found`, { modelId: id });
      }
      return this.flattenModel(model);
    } catch (error) {
      this.logger.error(`Failed to get model by id: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getFullModelById(id: string): Promise<Model> {
    try {
      this.logger.log(`Getting full model by ID: ${id}`);
      const model = await this.modelRepository.findById(id);
      if (!model) {
        throw new NotFoundError(`Model with ID ${id} not found`, { modelId: id });
      }
      return model;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      this.logger.error(`Failed to get full model by id: ${error.message}`, error.stack);
      throw new NotFoundError('Failed to get model', { originalError: error.message });
    }
  }

  async getModelWithInheritance(modelId: string): Promise<Model> {
    try {
      this.logger.log(`Getting model with inheritance: ${modelId}`);
      return await this.modelRepository.findWithInheritance(modelId);
    } catch (error) {
      this.logger.error(`Failed to get model with inheritance: ${error.message}`, error.stack);
      throw error;
    }
  }

  flattenModel(model: Model): FlattenedModel {
    return {
      _key: model._key,
      _id: model._id,
      name: model.name,
      inherits_from: model.inherits_from || [],
      fields: model.fields,
      system: model.system,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      createdBy: model.createdBy,
    };
  }

  private isValidFieldType(type: string): boolean {
    const validTypes = [
      'text',
      'number',
      'boolean',
      'date',
      'richtext',
      'select',
      'multiselect',
      'file',
      'image',
      'url',
      'email',
      'reference',
    ];
    return validTypes.includes(type);
  }

  validateFields(fields: FieldGroup[]): void {
    const errors: Record<string, any> = {};

    fields.forEach((group, groupIndex) => {
      if (!group._inherit_from) {
        errors[`group[${groupIndex}]._inherit_from`] = 'Field group must have _inherit_from property';
        return;
      }

      group.fields.forEach((field, fieldIndex) => {
        const fieldPath = `group[${groupIndex}].fields[${fieldIndex}]`;

        if (!field.name || !field.type) {
          errors[fieldPath] = 'Field must have name and type';
          return;
        }

        if (!this.isValidFieldType(field.type)) {
          errors[`${fieldPath}.type`] = `Invalid field type: ${field.type}`;
        }

        // Validate select/multiselect options
        if (
          (field.type === 'select' || field.type === 'multiselect') &&
          (!field.config?.options || !Array.isArray(field.config.options))
        ) {
          errors[`${fieldPath}.config.options`] = `${field.type} field must have options array in config`;
        }
      });
    });

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid field definitions', { fields: errors });
    }
  }

  validateCardData(model: Model, cardData: any): void {
    // Get all field groups
    const basicGroup = model.fields.find(
      (g) => g._inherit_from === '_self' || g._inherit_from === 'basic',
    );
    const metaGroups = model.fields.filter(
      (g) => g._inherit_from !== '_self' && g._inherit_from !== 'basic',
    );

    const errors: Record<string, string> = {};

    // Validate basic fields
    if (basicGroup) {
      basicGroup.fields.forEach((field) => {
        const value = cardData[field.name];
        if (
          field.required &&
          (value === undefined || value === null || value === '')
        ) {
          errors[field.name] = `Missing required field: ${field.name}`;
        } else if (value !== undefined && value !== null) {
          try {
            this.validateFieldValue(field.name, value, field);
          } catch (error) {
            errors[field.name] = error.message;
          }
        }
      });
    }

    // Validate meta fields
    if (cardData.meta) {
      metaGroups.forEach((group) => {
        group.fields.forEach((field) => {
          const value = cardData.meta[field.name];
          if (
            field.required &&
            (value === undefined || value === null || value === '')
          ) {
            errors[`meta.${field.name}`] = `Missing required field: ${field.name}`;
          } else if (value !== undefined && value !== null) {
            try {
              this.validateFieldValue(`meta.${field.name}`, value, field);
            } catch (error) {
              errors[`meta.${field.name}`] = error.message;
            }
          }
        });
      });
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Card data validation failed', { fields: errors });
    }
  }

  private validateFieldValue(
    fieldName: string,
    value: any,
    field: FieldDefinition,
  ): void {
    if (value === undefined || value === null || value === '') {
      if (field.required) {
        throw new Error(`Required field ${fieldName} cannot be empty`);
      }
      return;
    }

    switch (field.type) {
      case 'text':
      case 'richtext':
      case 'url':
      case 'email':
        if (typeof value !== 'string') {
          throw new Error(`Field ${fieldName} must be a string`);
        }
        if (field.config?.maxLength && value.length > field.config.maxLength) {
          throw new Error(
            `Field ${fieldName} exceeds maximum length of ${field.config.maxLength}`,
          );
        }
        break;

      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          throw new Error(`Field ${fieldName} must be a number`);
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          throw new Error(`Field ${fieldName} must be a boolean`);
        }
        break;

      case 'date':
        if (isNaN(Date.parse(value))) {
          throw new Error(`Field ${fieldName} must be a valid date`);
        }
        break;

      case 'select':
        if (!field.config?.options?.includes(value)) {
          throw new Error(
            `Invalid value for field ${fieldName}. Must be one of: ${field.config?.options?.join(
              ', ',
            )}`,
          );
        }
        break;

      case 'multiselect':
        if (
          !Array.isArray(value) ||
          !value.every((v) => field.config?.options?.includes(v))
        ) {
          throw new Error(
            `Invalid values for field ${fieldName}. Each value must be one of: ${field.config?.options?.join(
              ', ',
            )}`,
          );
        }
        break;

      case 'reference':
        if (typeof value !== 'string' || !value.match(/^[a-zA-Z0-9-_/]+$/)) {
          throw new Error(`Field ${fieldName} must be a valid reference ID`);
        }
        break;
    }
  }

  async createModel(
    input: { name: string; fields: FieldGroup[]; inherits_from?: string[] },
    user: any,
  ): Promise<Model> {
    try {
      this.logger.log(`Creating model: ${input.name}`);
      this.validateFields(input.fields);

      const model: Model = {
        name: input.name,
        fields: input.fields,
        inherits_from: input.inherits_from || [],
        system: false,
        createdAt: new Date().toISOString(),
        createdBy: `users/${user.sub}`,
      };

      return await this.modelRepository.create(model);
    } catch (error) {
      this.logger.error(`Failed to create model: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateModel(modelId: string, updates: Partial<Model>): Promise<Model> {
    try {
      this.logger.log(`Updating model: ${modelId}`);
      const model = await this.getFullModelById(modelId);
      if (!model) {
        throw new Error('Model not found');
      }

      if (updates.fields) {
        this.validateFields(updates.fields);
      }

      const updatedModel = {
        ...model,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await this.modelRepository.update(modelId, updatedModel);
      return this.getFullModelById(modelId);
    } catch (error) {
      this.logger.error(`Failed to update model: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteModel(modelId: string): Promise<boolean> {
    try {
      this.logger.log(`Deleting model: ${modelId}`);
      const model = await this.getModelById(modelId);
      if (!model) {
        throw new Error(`Model ${modelId} not found`);
      }

      if (model.system) {
        throw new ForbiddenError('Cannot delete system model', {
          modelId,
          reason: 'system_model'
        });
      }

      // 检查是否有其他模型继承自此模型
      const hasChildren = await this.modelRepository.hasChildren(modelId);
      if (hasChildren) {
        throw new ForbiddenError('Cannot delete model with children', {
          modelId,
          reason: 'has_children'
        });
      }

      // 检查是否有卡片使用此模型
      const isUsedByCards = await this.modelRepository.isUsedByCards(modelId);
      if (isUsedByCards) {
        throw new ForbiddenError('Cannot delete model in use by cards', {
          modelId,
          reason: 'used_by_cards'
        });
      }

      await this.modelRepository.delete(modelId);
      this.logger.log(`Model ${modelId} deleted successfully`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete model: ${error.message}`, error.stack);
      throw error;
    }
  }
}
