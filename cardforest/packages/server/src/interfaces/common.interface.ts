/**
 * 通用接口和类型定义
 */

/**
 * 分页参数
 */
export interface PaginationParams {
  /**
   * 页码，从 1 开始
   */
  page?: number;

  /**
   * 每页数量
   */
  limit?: number;

  /**
   * 偏移量，优先级高于 page
   */
  offset?: number;
}

/**
 * 排序参数
 */
export interface SortParams {
  /**
   * 排序字段
   */
  field: string;

  /**
   * 排序方向
   */
  direction: 'asc' | 'desc';
}

/**
 * 分页结果
 */
export interface PaginatedResult<T> {
  /**
   * 数据列表
   */
  items: T[];

  /**
   * 总数
   */
  total: number;

  /**
   * 页码
   */
  page: number;

  /**
   * 每页数量
   */
  limit: number;

  /**
   * 总页数
   */
  totalPages: number;

  /**
   * 是否有下一页
   */
  hasNext: boolean;

  /**
   * 是否有上一页
   */
  hasPrevious: boolean;
}

/**
 * ArangoDB 文档基础接口
 */
export interface ArangoDocument {
  /**
   * 文档 ID
   */
  _id?: string;

  /**
   * 文档 Key
   */
  _key?: string;

  /**
   * 文档版本
   */
  _rev?: string;
}

/**
 * 时间戳接口
 */
export interface Timestamps {
  /**
   * 创建时间
   */
  createdAt?: string;

  /**
   * 更新时间
   */
  updatedAt?: string;
}

/**
 * 查询过滤条件
 */
export type FilterCondition = 
  | { field: string; operator: '==' | '!=' | '>' | '>=' | '<' | '<='; value: any }
  | { field: string; operator: 'in' | 'not in'; value: any[] }
  | { field: string; operator: 'like' | 'not like'; value: string }
  | { field: string; operator: 'exists' | 'not exists'; value?: boolean }
  | { operator: 'and' | 'or'; conditions: FilterCondition[] };

/**
 * 查询选项
 */
export interface QueryOptions {
  /**
   * 过滤条件
   */
  filters?: FilterCondition[];

  /**
   * 排序参数
   */
  sort?: SortParams[];

  /**
   * 分页参数
   */
  pagination?: PaginationParams;

  /**
   * 关联查询
   */
  relations?: string[];
}
