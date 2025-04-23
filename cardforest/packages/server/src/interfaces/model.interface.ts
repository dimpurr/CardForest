import { ArangoDocument, Timestamps } from './common.interface';
import { UserReference } from './user.interface';

/**
 * 字段类型
 */
export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'file'
  | 'image'
  | 'relation'
  | 'json';

/**
 * 字段定义
 */
export interface FieldDefinition {
  /**
   * 字段名称
   */
  name: string;

  /**
   * 字段类型
   */
  type: FieldType;

  /**
   * 字段标签
   */
  label?: string;

  /**
   * 是否必填
   */
  required?: boolean;

  /**
   * 默认值
   */
  default?: any;

  /**
   * 选项列表（用于 select 和 multiselect 类型）
   */
  options?: string[] | Array<{ label: string; value: string }>;

  /**
   * 字段配置
   */
  config?: Record<string, any>;

  /**
   * 字段描述
   */
  description?: string;

  /**
   * 字段顺序
   */
  order?: number;

  /**
   * 字段分组
   */
  group?: string;
}

/**
 * 字段组
 */
export interface FieldGroup {
  /**
   * 继承自哪个模型
   * _self 表示当前模型
   */
  _inherit_from: string;

  /**
   * 字段列表
   */
  fields: FieldDefinition[];
}

/**
 * 模型接口
 */
export interface Model extends ArangoDocument, Timestamps {
  /**
   * 模型名称
   */
  name: string;

  /**
   * 模型描述
   */
  description?: string;

  /**
   * 模型图标
   */
  icon?: string;

  /**
   * 模型颜色
   */
  color?: string;

  /**
   * 是否为系统模型
   */
  system?: boolean;

  /**
   * 模型字段
   */
  fields: FieldGroup[];

  /**
   * 继承自哪些模型
   */
  inherits_from?: string[];

  /**
   * 模型创建者
   */
  createdBy: UserReference | string;

  /**
   * 模型更新者
   */
  updatedBy?: UserReference | string;
}

/**
 * 平铺模型视图（用于 GraphQL API）
 */
export interface FlattenedModel extends Model {
  /**
   * 平铺后的字段
   */
  flattenedFields?: FieldDefinition[];
}

/**
 * 创建模型输入
 */
export interface CreateModelInput {
  /**
   * 模型名称
   */
  name: string;

  /**
   * 模型描述
   */
  description?: string;

  /**
   * 模型图标
   */
  icon?: string;

  /**
   * 模型颜色
   */
  color?: string;

  /**
   * 模型字段
   */
  fields: FieldGroup[];

  /**
   * 继承自哪些模型
   */
  inherits_from?: string[];
}

/**
 * 更新模型输入
 */
export interface UpdateModelInput {
  /**
   * 模型名称
   */
  name?: string;

  /**
   * 模型描述
   */
  description?: string;

  /**
   * 模型图标
   */
  icon?: string;

  /**
   * 模型颜色
   */
  color?: string;

  /**
   * 模型字段
   */
  fields?: FieldGroup[];

  /**
   * 继承自哪些模型
   */
  inherits_from?: string[];
}
