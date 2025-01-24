import { Injectable } from '@nestjs/common';
import { ArangoDBService } from './arangodb.service';
import { Database, aql } from 'arangojs';
import { Template, FieldDefinition } from '../interfaces/template.interface';

@Injectable()
export class TemplateService {
  private db: Database;
  private templateCollection: any;

  constructor(private readonly arangoDBService: ArangoDBService) {
    this.db = this.arangoDBService.getDatabase();
    this.templateCollection = this.db.collection('templates');
  }

  async getTemplates(): Promise<any[]> {
    try {
      const db = this.arangoDBService.getDatabase();
      const query = `
        FOR template IN templates
        SORT template.createdAt DESC
        RETURN {
          _id: template._id,
          _key: template._key,
          name: template.name,
          createdAt: template.createdAt,
          updatedAt: template.updatedAt,
          createdBy: template.createdBy
        }
      `;
      const cursor = await db.query(query);
      const templates = await cursor.all();
      return templates;
    } catch (error) {
      console.error('Failed to get templates:', error);
      throw error;
    }
  }

  async getTemplatesWithFields(): Promise<any[]> {
    try {
      const db = this.arangoDBService.getDatabase();
      const query = `
        FOR template IN templates
        SORT template.createdAt DESC
        RETURN {
          _id: template._id,
          _key: template._key,
          name: template.name,
          fields: template.fields,
          system: template.system,
          createdAt: template.createdAt,
          updatedAt: template.updatedAt,
          createdBy: template.createdBy
        }
      `;
      const cursor = await db.query(query);
      const templates = await cursor.all();
      return templates;
    } catch (error) {
      console.error('Failed to get templates with fields:', error);
      throw error;
    }
  }

  async getTemplateById(templateId: string): Promise<Template | null> {
    try {
      const query = aql`
        FOR template IN templates
        FILTER template._key == ${templateId}
        RETURN template
      `;
      const cursor = await this.db.query(query);
      return cursor.next();
    } catch (error) {
      console.error('Failed to get template:', error);
      throw error;
    }
  }

  async getTemplateWithInheritance(templateId: string): Promise<Template> {
    try {
      const template = await this.getTemplateById(templateId);
      if (!template) {
        throw new Error(`Template ${templateId} not found`);
      }

      if (!template.extends) {
        return template;
      }

      const parent = await this.getTemplateWithInheritance(template.extends);
      return {
        ...template,
        fields: {
          ...parent.fields,
          ...template.fields,
        },
      };
    } catch (error) {
      console.error('Failed to get template with inheritance:', error);
      throw error;
    }
  }

  async createTemplate(
    name: string,
    fields: Record<string, FieldDefinition>,
    extends_?: string,
    userId?: string,
  ): Promise<Template> {
    try {
      // 验证字段格式
      this.validateFields(fields);

      // 如果有继承，验证父模板
      if (extends_) {
        const parent = await this.getTemplateById(extends_);
        if (!parent) {
          throw new Error(`Parent template ${extends_} not found`);
        }
      }

      const now = new Date().toISOString();
      const template = await this.templateCollection.save({
        name,
        fields,
        extends: extends_,
        system: false,
        createdAt: now,
        updatedAt: now,
        createdBy: userId ? `users/${userId}` : null,
      });

      return template;
    } catch (error) {
      console.error('Failed to create template:', error);
      throw error;
    }
  }

  async updateTemplate(
    templateId: string,
    updates: Partial<Pick<Template, 'name' | 'fields'>>,
  ): Promise<Template> {
    try {
      const template = await this.getTemplateById(templateId);
      if (!template) {
        throw new Error(`Template ${templateId} not found`);
      }

      if (template.system) {
        throw new Error('Cannot modify system template');
      }

      if (updates.fields) {
        this.validateFields(updates.fields);
      }

      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await this.templateCollection.update(templateId, updateData);
      return this.getTemplateById(templateId);
    } catch (error) {
      console.error('Failed to update template:', error);
      throw error;
    }
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
        FILTER t.extends == ${templateId}
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

  validateFields(fields: Record<string, FieldDefinition>): void {
    if (!fields || typeof fields !== 'object') {
      throw new Error('Fields must be an object');
    }

    for (const [name, field] of Object.entries(fields)) {
      if (!field || typeof field !== 'object') {
        throw new Error(`Field ${name} must be an object`);
      }

      if (!field.type) {
        throw new Error(`Field ${name} must have a type`);
      }

      // 验证字段类型
      if (!this.isValidFieldType(field.type)) {
        throw new Error(`Invalid field type: ${field.type}`);
      }

      // 验证其他字段属性
      if (field.required !== undefined && typeof field.required !== 'boolean') {
        throw new Error(`Field ${name} required must be boolean`);
      }
    }
  }

  private isValidFieldType(type: string): boolean {
    const validTypes = [
      'text',
      'number',
      'boolean',
      'date',
      'reference',
      'richtext',
      'file',
      'image',
      'url',
      'email',
      'select',
      'multiselect',
    ];
    return validTypes.includes(type);
  }

  async validateCardData(templateId: string, cardData: any): Promise<boolean> {
    try {
      console.log('Validating card data for template:', templateId);
      console.log('Card data received:', JSON.stringify(cardData, null, 2));
      
      const template = await this.getTemplateWithInheritance(templateId);
      console.log('Template loaded:', JSON.stringify(template, null, 2));
      
      const fields = template.fields;
      console.log('Template fields:', JSON.stringify(fields, null, 2));

      // 检查根级别的必填字段
      const rootRequiredFields = ['title'];
      for (const field of rootRequiredFields) {
        console.log(`Checking root field ${field}:`, cardData[field]);
        if (!cardData[field]) {
          throw new Error(`Required field ${field} is missing`);
        }
      }

      // 初始化meta对象
      if (!cardData.meta) {
        console.log('Meta is missing, initializing empty object');
        cardData.meta = {};
      }

      // 检查meta中的必填字段
      for (const [name, field] of Object.entries(fields)) {
        // 跳过根级别字段的验证
        if (rootRequiredFields.includes(name)) {
          continue;
        }
        
        console.log(`Checking meta field ${name}:`, {
          required: field.required,
          value: cardData.meta[name],
        });
        
        if (field.required && !cardData.meta[name]) {
          throw new Error(`Required field ${name} is missing in meta`);
        }
      }

      // 验证meta中字段的类型
      for (const [name, value] of Object.entries(cardData.meta)) {
        const field = fields[name];
        if (!field) {
          throw new Error(`Unknown field ${name} in meta`);
        }

        console.log(`Validating meta field ${name}:`, {
          type: field.type,
          value: value,
        });
        
        if (!this.validateFieldValue(value, field)) {
          throw new Error(`Invalid value for field ${name}`);
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to validate card data:', error);
      throw error;
    }
  }

  private validateFieldValue(value: any, field: FieldDefinition): boolean {
    if (value === null || value === undefined) {
      return !field.required;
    }

    switch (field.type) {
      case 'text':
      case 'richtext':
      case 'url':
      case 'email':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number';
      case 'boolean':
        return typeof value === 'boolean';
      case 'date':
        return !isNaN(Date.parse(value));
      case 'reference':
        return typeof value === 'string';
      case 'select':
        return field.options?.includes(value);
      case 'multiselect':
        return Array.isArray(value) && value.every(v => field.options?.includes(v));
      default:
        return true;
    }
  }
}
