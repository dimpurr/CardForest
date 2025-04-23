import { ArangoDocument, Timestamps } from './common.interface';
import { UserReference } from './user.interface';

/**
 * 卡片接口
 */
export interface Card extends ArangoDocument, Timestamps {
  /**
   * 卡片标题
   */
  title: string;

  /**
   * 卡片内容
   */
  content?: string;

  /**
   * 卡片正文
   */
  body?: string;

  /**
   * 卡片元数据
   */
  meta?: Record<string, any>;

  /**
   * 卡片模板 ID
   */
  modelId: string;

  /**
   * 卡片创建者
   */
  createdBy: UserReference | string;

  /**
   * 卡片更新者
   */
  updatedBy?: UserReference | string;

  /**
   * 卡片标签
   */
  tags?: string[];

  /**
   * 卡片状态
   */
  status?: 'draft' | 'published' | 'archived';
}

/**
 * 卡片关系接口
 */
export interface CardRelation extends ArangoDocument, Timestamps {
  /**
   * 关系类型
   */
  type: string;

  /**
   * 来源卡片 ID
   */
  fromId: string;

  /**
   * 目标卡片 ID
   */
  toId: string;

  /**
   * 关系元数据
   */
  meta?: Record<string, any>;

  /**
   * 关系创建者
   */
  createdBy: UserReference | string;
}

/**
 * 创建卡片输入
 */
export interface CreateCardInput {
  /**
   * 卡片标题
   */
  title: string;

  /**
   * 卡片内容
   */
  content?: string;

  /**
   * 卡片正文
   */
  body?: string;

  /**
   * 卡片模板 ID
   */
  modelId: string;

  /**
   * 卡片元数据
   */
  meta?: Record<string, any>;

  /**
   * 卡片标签
   */
  tags?: string[];

  /**
   * 卡片状态
   */
  status?: 'draft' | 'published' | 'archived';
}

/**
 * 更新卡片输入
 */
export interface UpdateCardInput {
  /**
   * 卡片标题
   */
  title?: string;

  /**
   * 卡片内容
   */
  content?: string;

  /**
   * 卡片正文
   */
  body?: string;

  /**
   * 卡片元数据
   */
  meta?: Record<string, any>;

  /**
   * 卡片标签
   */
  tags?: string[];

  /**
   * 卡片状态
   */
  status?: 'draft' | 'published' | 'archived';
}

/**
 * 创建卡片关系输入
 */
export interface CreateCardRelationInput {
  /**
   * 关系类型
   */
  type: string;

  /**
   * 来源卡片 ID
   */
  fromId: string;

  /**
   * 目标卡片 ID
   */
  toId: string;

  /**
   * 关系元数据
   */
  meta?: Record<string, any>;
}
