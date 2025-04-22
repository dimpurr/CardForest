import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { BaseRepository } from './base.repository';
import { ArangoDBService } from '../services/arangodb.service';
import { Model, FieldGroup, FlattenedModel } from '../interfaces/model.interface';

/**
 * 模型仓库类
 */
@Injectable()
export class ModelRepository extends BaseRepository<Model> {
  /**
   * 构造函数
   * @param arangoDBService ArangoDB服务
   */
  constructor(private readonly arangoDBService: ArangoDBService) {
    super(arangoDBService.getDatabase(), 'models');
  }

  /**
   * 获取所有模型
   * @returns 模型数组
   */
  async findAllModels(): Promise<Model[]> {
    try {
      const query = aql`
        FOR model IN models
        SORT model.createdAt DESC
        RETURN model
      `;
      const cursor = await this.db.query(query);
      return cursor.all();
    } catch (error) {
      console.error('Failed to find all models:', error);
      throw error;
    }
  }

  /**
   * 获取模型及其继承链
   * @param modelId 模型ID
   * @returns 模型及其继承链
   */
  async findWithInheritance(modelId: string): Promise<Model | null> {
    try {
      // 获取模型
      const model = await this.findById(modelId);
      if (!model) {
        return null;
      }

      // 如果没有继承，直接返回
      if (!model.inherits_from || model.inherits_from.length === 0) {
        return model;
      }

      // 获取所有继承的模型
      const inheritedModels: Model[] = [];
      for (const inheritId of model.inherits_from) {
        const inheritedModel = await this.findById(
          inheritId.startsWith('models/') ? inheritId.substring(7) : inheritId
        );
        if (inheritedModel) {
          inheritedModels.push(inheritedModel);
        }
      }

      // 合并字段
      const mergedFields: FieldGroup[] = [...model.fields];
      
      // 添加继承的字段
      for (const inheritedModel of inheritedModels) {
        if (inheritedModel.fields) {
          for (const fieldGroup of inheritedModel.fields) {
            // 检查是否已经存在相同来源的字段组
            const existingGroupIndex = mergedFields.findIndex(
              (group) => group._inherit_from === fieldGroup._inherit_from
            );
            
            if (existingGroupIndex === -1) {
              // 如果不存在，添加新的字段组
              mergedFields.push(fieldGroup);
            } else {
              // 如果存在，合并字段
              for (const field of fieldGroup.fields) {
                const existingFieldIndex = mergedFields[existingGroupIndex].fields.findIndex(
                  (f) => f.name === field.name
                );
                
                if (existingFieldIndex === -1) {
                  // 如果字段不存在，添加新字段
                  mergedFields[existingGroupIndex].fields.push(field);
                }
                // 如果字段已存在，保留现有字段（子模型优先）
              }
            }
          }
        }
      }

      // 返回合并后的模型
      return {
        ...model,
        fields: mergedFields,
      };
    } catch (error) {
      console.error('Failed to find model with inheritance:', error);
      throw error;
    }
  }

  /**
   * 检查模型是否有子模型
   * @param modelId 模型ID
   * @returns 是否有子模型
   */
  async hasChildren(modelId: string): Promise<boolean> {
    try {
      const query = aql`
        FOR model IN models
        FILTER ${modelId} IN model.inherits_from
        LIMIT 1
        RETURN 1
      `;
      const cursor = await this.db.query(query);
      return cursor.hasNext();
    } catch (error) {
      console.error('Failed to check if model has children:', error);
      throw error;
    }
  }

  /**
   * 检查模型是否被卡片使用
   * @param modelId 模型ID
   * @returns 是否被卡片使用
   */
  async isUsedByCards(modelId: string): Promise<boolean> {
    try {
      const query = aql`
        FOR card IN cards
        FILTER card.modelId == ${modelId}
        LIMIT 1
        RETURN 1
      `;
      const cursor = await this.db.query(query);
      return cursor.hasNext();
    } catch (error) {
      console.error('Failed to check if model is used by cards:', error);
      throw error;
    }
  }
}
