import { Injectable } from '@nestjs/common';
import { ArangoDBService } from './arangodb.service';
import { Database, aql } from 'arangojs';
import { Model, FieldDefinition, FieldGroup, FlattenedModel } from '../interfaces/model.interface';

@Injectable()
export class ModelService {
  private db: Database;
  private modelCollection: any;

  constructor(private readonly arangoDBService: ArangoDBService) {
    this.db = this.arangoDBService.getDatabase();
    this.modelCollection = this.db.collection('models');
  }

  async getModels(): Promise<FlattenedModel[]> {
    try {
      const models = await this.getModelsWithFields();
      return models.map(model => this.flattenModel(model));
    } catch (error) {
      console.error('Failed to get models:', error);
      throw error;
    }
  }

  async getModelsWithFields(): Promise<Model[]> {
    try {
      const query = aql`
        FOR model IN models
        SORT model.createdAt DESC
        RETURN model
      `;
      const cursor = await this.db.query(query);
      const models = await cursor.all();
      return models;
    } catch (error) {
      console.error('Failed to get models with fields:', error);
      throw error;
    }
  }

  async getModelById(id: string): Promise<FlattenedModel> {
    try {
      const model = await this.getModelWithInheritance(id);
      if (!model) {
        throw new Error('Model not found');
      }
      return this.flattenModel(model);
    } catch (error) {
      console.error('Failed to get model by id:', error);
      throw error;
    }
  }

  async getFullModelById(id: string): Promise<Model> {
    try {
      const model = await this.modelCollection.document(id);
      if (!model) {
        throw new Error('Model not found');
      }
      return model;
    } catch (error) {
      if (error.message === 'Model not found') {
        throw error;
      }
      console.error('Failed to get full model by id:', error);
      throw new Error('Failed to get model');
    }
  }

  async getModelWithInheritance(modelId: string): Promise<Model> {
    const model = await this.getFullModelById(modelId);
    if (!model) {
      throw new Error('Model not found');
    }

    if (!model.inherits_from || model.inherits_from.length === 0) {
      return model;
    }

    const inheritedModels = await Promise.all(
      model.inherits_from.map(parentId => this.getFullModelById(parentId))
    );

    // Merge fields from inherited models
    const mergedFields: FieldGroup[] = [];
    for (const parent of inheritedModels) {
      if (parent) {
        mergedFields.push(...parent.fields);
      }
    }
    mergedFields.push(...model.fields);

    return {
      ...model,
      fields: mergedFields,
    };
  }

  flattenModel(model: Model): FlattenedModel {
    return {
      _key: model._key,
      _id: model._id,
      name: model.name,
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
    fields.forEach(group => {
      if (!group._inherit_from) {
        throw new Error('Field group must have _inherit_from property');
      }

      group.fields.forEach(field => {
        if (!field.name || !field.type) {
          throw new Error('Field must have name and type');
        }

        if (!this.isValidFieldType(field.type)) {
          throw new Error(`Invalid field type: ${field.type}`);
        }

        // Validate select/multiselect options
        if ((field.type === 'select' || field.type === 'multiselect') && 
            (!field.config?.options || !Array.isArray(field.config.options))) {
          throw new Error(`${field.type} field must have options array in config`);
        }
      });
    });
  }

  validateCardData(model: Model, cardData: any): void {
    // Get all field groups
    const basicGroup = model.fields.find(g => g._inherit_from === '_self' || g._inherit_from === 'basic');
    const metaGroups = model.fields.filter(g => g._inherit_from !== '_self' && g._inherit_from !== 'basic');

    // Validate basic fields
    if (basicGroup) {
      basicGroup.fields.forEach(field => {
        const value = cardData[field.name];
        if (field.required && (value === undefined || value === null || value === '')) {
          throw new Error(`Missing required field: ${field.name}`);
        }
        if (value !== undefined && value !== null) {
          this.validateFieldValue(field.name, value, field);
        }
      });
    }

    // Validate meta fields
    if (cardData.meta) {
      metaGroups.forEach(group => {
        group.fields.forEach(field => {
          const value = cardData.meta[field.name];
          if (field.required && (value === undefined || value === null || value === '')) {
            throw new Error(`Missing required field: ${field.name}`);
          }
          if (value !== undefined && value !== null) {
            this.validateFieldValue(`meta.${field.name}`, value, field);
          }
        });
      });
    }
  }

  private validateFieldValue(fieldName: string, value: any, field: FieldDefinition): void {
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
          throw new Error(`Field ${fieldName} exceeds maximum length of ${field.config.maxLength}`);
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
          throw new Error(`Invalid value for field ${fieldName}. Must be one of: ${field.config?.options?.join(', ')}`);
        }
        break;

      case 'multiselect':
        if (!Array.isArray(value) || !value.every(v => field.config?.options?.includes(v))) {
          throw new Error(`Invalid values for field ${fieldName}. Each value must be one of: ${field.config?.options?.join(', ')}`);
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
    user: any
  ): Promise<Model> {
    this.validateFields(input.fields);

    const model: Model = {
      name: input.name,
      fields: input.fields,
      inherits_from: input.inherits_from || [],
      system: false,
      createdAt: new Date().toISOString(),
      createdBy: `users/${user.sub}`,
    };

    try {
      const result = await this.modelCollection.save(model);
      return {
        ...model,
        _id: result._id,
        _key: result._key,
        _rev: result._rev,
      };
    } catch (error) {
      console.error('Failed to create model:', error);
      throw error;
    }
  }

  async updateModel(modelId: string, updates: Partial<Model>): Promise<Model> {
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

    await this.modelCollection.update(modelId, updatedModel);
    return this.getFullModelById(modelId);
  }

  async deleteModel(modelId: string): Promise<boolean> {
    try {
      const model = await this.getModelById(modelId);
      if (!model) {
        throw new Error(`Model ${modelId} not found`);
      }

      if (model.system) {
        throw new Error('Cannot delete system model');
      }

      // 检查是否有其他模板继承自此模板
      const query = aql`
        FOR t IN models
        FILTER t.inherits_from == ${modelId}
        RETURN t
      `;
      const cursor = await this.db.query(query);
      const children = await cursor.all();
      if (children.length > 0) {
        throw new Error('Cannot delete model with children');
      }

      // 检查是否有卡片使用此模板
      const cardQuery = aql`
        FOR card IN cards
        FILTER card.model == ${modelId}
        RETURN card
      `;
      const cardCursor = await this.db.query(cardQuery);
      const cards = await cardCursor.all();
      if (cards.length > 0) {
        throw new Error('Cannot delete model in use by cards');
      }

      await this.modelCollection.remove(modelId);
      return true;
    } catch (error) {
      console.error('Failed to delete model:', error);
      throw error;
    }
  }
}
