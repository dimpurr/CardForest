import { Injectable } from '@nestjs/common';
import { ArangoDBService } from './arangodb.service';
import { Database, aql } from 'arangojs';
import { Template, FieldDefinition, FieldGroup, FlattenedTemplate } from '../interfaces/template.interface';

@Injectable()
export class TemplateService {
  private db: Database;
  private templateCollection: any;

  constructor(private readonly arangoDBService: ArangoDBService) {
    this.db = this.arangoDBService.getDatabase();
    this.templateCollection = this.db.collection('templates');
  }

  async getTemplates(): Promise<FlattenedTemplate[]> {
    try {
      const templates = await this.getTemplatesWithFields();
      return templates.map(template => this.flattenTemplate(template));
    } catch (error) {
      console.error('Failed to get templates:', error);
      throw error;
    }
  }

  async getTemplatesWithFields(): Promise<Template[]> {
    try {
      const query = aql`
        FOR template IN templates
        SORT template.createdAt DESC
        RETURN template
      `;
      const cursor = await this.db.query(query);
      const templates = await cursor.all();
      return templates;
    } catch (error) {
      console.error('Failed to get templates with fields:', error);
      throw error;
    }
  }

  async getTemplateById(id: string): Promise<FlattenedTemplate> {
    try {
      const template = await this.getTemplateWithInheritance(id);
      if (!template) {
        throw new Error('Template not found');
      }
      return this.flattenTemplate(template);
    } catch (error) {
      console.error('Failed to get template by id:', error);
      throw error;
    }
  }

  async getFullTemplateById(id: string): Promise<Template> {
    try {
      const template = await this.templateCollection.document(id);
      if (!template) {
        throw new Error('Template not found');
      }
      return template;
    } catch (error) {
      if (error.message === 'Template not found') {
        throw error;
      }
      console.error('Failed to get full template by id:', error);
      throw new Error('Failed to get template');
    }
  }

  async getTemplateWithInheritance(templateId: string): Promise<Template> {
    const template = await this.getFullTemplateById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    if (!template.inherits_from || template.inherits_from.length === 0) {
      return template;
    }

    const inheritedTemplates = await Promise.all(
      template.inherits_from.map(parentId => this.getFullTemplateById(parentId))
    );

    // Merge fields from inherited templates
    const mergedFields: FieldGroup[] = [];
    for (const parent of inheritedTemplates) {
      if (parent) {
        mergedFields.push(...parent.fields);
      }
    }
    mergedFields.push(...template.fields);

    return {
      ...template,
      fields: mergedFields,
    };
  }

  flattenTemplate(template: Template): FlattenedTemplate {
    return {
      _key: template._key,
      _id: template._id,
      name: template.name,
      fields: template.fields,
      system: template.system,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
      createdBy: template.createdBy,
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

  validateCardData(template: Template, cardData: any): void {
    // Get all field groups
    const basicGroup = template.fields.find(g => g._inherit_from === '_self' || g._inherit_from === 'basic');
    const metaGroups = template.fields.filter(g => g._inherit_from !== '_self' && g._inherit_from !== 'basic');

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

  async createTemplate(
    input: { name: string; fields: FieldGroup[]; inherits_from?: string[] },
    user: any
  ): Promise<Template> {
    this.validateFields(input.fields);

    const template: Template = {
      name: input.name,
      fields: input.fields,
      inherits_from: input.inherits_from || [],
      system: false,
      createdAt: new Date().toISOString(),
      createdBy: `users/${user.sub}`,
    };

    try {
      const result = await this.templateCollection.save(template);
      return {
        ...template,
        _id: result._id,
        _key: result._key,
        _rev: result._rev,
      };
    } catch (error) {
      console.error('Failed to create template:', error);
      throw error;
    }
  }

  async updateTemplate(templateId: string, updates: Partial<Template>): Promise<Template> {
    const template = await this.getFullTemplateById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    if (updates.fields) {
      this.validateFields(updates.fields);
    }

    const updatedTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.templateCollection.update(templateId, updatedTemplate);
    return this.getFullTemplateById(templateId);
  }

  async deleteTemplate(templateId: string): Promise<boolean> {
    try {
      const template = await this.getTemplateById(templateId);
      if (!template) {
        throw new Error(`Template ${templateId} not found`);
      }

      if (template.system) {
        throw new Error('Cannot delete system template');
      }

      // 检查是否有其他模板继承自此模板
      const query = aql`
        FOR t IN templates
        FILTER t.inherits_from == ${templateId}
        RETURN t
      `;
      const cursor = await this.db.query(query);
      const children = await cursor.all();
      if (children.length > 0) {
        throw new Error('Cannot delete template with children');
      }

      // 检查是否有卡片使用此模板
      const cardQuery = aql`
        FOR card IN cards
        FILTER card.template == ${templateId}
        RETURN card
      `;
      const cardCursor = await this.db.query(cardQuery);
      const cards = await cardCursor.all();
      if (cards.length > 0) {
        throw new Error('Cannot delete template in use by cards');
      }

      await this.templateCollection.remove(templateId);
      return true;
    } catch (error) {
      console.error('Failed to delete template:', error);
      throw error;
    }
  }
}
