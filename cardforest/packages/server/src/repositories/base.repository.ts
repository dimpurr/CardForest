import { Database, aql } from 'arangojs';
import type { GeneratedAqlQuery } from 'arangojs/aql';
import type { AqlValue } from 'arangojs/aql';
import { Logger } from '@nestjs/common';
import { ArangoDocument, PaginationParams, SortParams, PaginatedResult, FilterCondition, QueryOptions } from '../interfaces/common.interface';

/**
 * 基础仓库类，提供通用的数据库操作
 * @template T 实体类型
 */
export abstract class BaseRepository<T extends ArangoDocument> {
  /**
   * 日志器
   */
  protected readonly logger: Logger;

  /**
   * 构造函数
   * @param db 数据库实例
   * @param collectionName 集合名称
   */
  constructor(
    protected readonly db: Database,
    protected readonly collectionName: string
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * 根据ID查找实体
   * @param id 实体ID
   * @returns 实体或null
   */
  async findById(id: string): Promise<T | null> {
    try {
      this.logger.debug(`Finding ${this.collectionName} by id: ${id}`);

      const query = aql`
        FOR doc IN ${this.collectionName}
        FILTER doc._key == ${id}
        RETURN doc
      `;

      const cursor = await this.db.query<T>(query);
      const hasNext = await cursor.hasNext;
      const result = hasNext ? await cursor.next() : null;

      this.logger.debug(`${this.collectionName} found: ${result ? 'yes' : 'no'}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to find ${this.collectionName} by id: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 查找所有实体
   * @param options 查询选项
   * @returns 实体数组
   */
  async findAll(options?: QueryOptions): Promise<T[]> {
    try {
      this.logger.debug(`Finding all ${this.collectionName}`, options);

      let queryStr = aql`FOR doc IN ${this.collectionName}`;

      // 处理过滤条件
      if (options?.filters && options.filters.length > 0) {
        const filterQuery = this.buildFilterQuery(options.filters);
        if (filterQuery) {
          queryStr = aql`${queryStr} FILTER ${filterQuery}`;
        }
      }

      // 处理排序
      if (options?.sort && options.sort.length > 0) {
        const sortParts: GeneratedAqlQuery[] = [];

        for (const sort of options.sort) {
          sortParts.push(aql`doc.${sort.field} ${sort.direction === 'asc' ? 'ASC' : 'DESC'}`);
        }

        if (sortParts.length > 0) {
          const joinedSortParts = sortParts.join(', ');
          queryStr = aql`${queryStr} SORT ${joinedSortParts}`;
        }
      }

      // 处理分页
      if (options?.pagination) {
        const { page = 1, limit = 20, offset } = options.pagination;
        const skip = offset !== undefined ? offset : (page - 1) * limit;

        queryStr = aql`${queryStr} LIMIT ${skip}, ${limit}`;
      }

      // 返回文档
      queryStr = aql`${queryStr} RETURN doc`;

      const cursor = await this.db.query<T>(queryStr);
      const results = await cursor.all();

      this.logger.debug(`Found ${results.length} ${this.collectionName}`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to find all ${this.collectionName}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 创建实体
   * @param data 实体数据
   * @returns 创建的实体
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      this.logger.debug(`Creating ${this.collectionName}`, data);

      // 添加时间戳
      const now = new Date().toISOString();
      const dataWithTimestamps = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const collection = this.db.collection(this.collectionName);
      const result = await collection.save(dataWithTimestamps);

      const createdEntity = {
        ...dataWithTimestamps,
        _id: result._id,
        _key: result._key,
        _rev: result._rev
      } as unknown as T;

      this.logger.debug(`Created ${this.collectionName} with id: ${result._key}`);
      return createdEntity;
    } catch (error) {
      this.logger.error(`Failed to create ${this.collectionName}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 更新实体
   * @param id 实体ID
   * @param data 更新的数据
   * @returns 更新后的实体
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      this.logger.debug(`Updating ${this.collectionName} with id: ${id}`, data);

      // 添加更新时间
      const dataWithTimestamp = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      const collection = this.db.collection(this.collectionName);
      const result = await collection.update(id, dataWithTimestamp, { returnNew: true });

      this.logger.debug(`Updated ${this.collectionName} with id: ${id}`);
      return result.new as T;
    } catch (error) {
      this.logger.error(`Failed to update ${this.collectionName}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 删除实体
   * @param id 实体ID
   * @returns 是否成功删除
   */
  async delete(id: string): Promise<boolean> {
    try {
      this.logger.debug(`Deleting ${this.collectionName} with id: ${id}`);

      const collection = this.db.collection(this.collectionName);
      await collection.remove(id);

      this.logger.debug(`Deleted ${this.collectionName} with id: ${id}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete ${this.collectionName}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 根据条件删除多个实体
   * @param filters 过滤条件
   * @returns 删除的数量
   */
  async deleteMany(filters: FilterCondition[]): Promise<number> {
    try {
      this.logger.debug(`Deleting multiple ${this.collectionName}`, { filters });

      let queryStr = aql`FOR doc IN ${this.collectionName}`;

      // 处理过滤条件
      if (filters && filters.length > 0) {
        const filterQuery = this.buildFilterQuery(filters);
        if (filterQuery) {
          queryStr = aql`${queryStr} FILTER ${filterQuery}`;
        }
      }

      // 执行删除
      queryStr = aql`${queryStr} REMOVE doc IN ${this.collectionName} RETURN OLD`;

      const cursor = await this.db.query(queryStr);
      const result = await cursor.all();

      this.logger.debug(`Deleted ${result.length} ${this.collectionName}`);
      return result.length;
    } catch (error) {
      this.logger.error(`Failed to delete multiple ${this.collectionName}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取分页结果
   * @param options 查询选项
   * @returns 分页结果
   */
  async findWithPagination(options?: QueryOptions): Promise<PaginatedResult<T>> {
    try {
      this.logger.debug(`Finding ${this.collectionName} with pagination`, options);

      // 默认分页参数
      const page = options?.pagination?.page || 1;
      const limit = options?.pagination?.limit || 20;

      // 构建计数查询
      let countQuery = aql`FOR doc IN ${this.collectionName}`;

      // 处理过滤条件
      if (options?.filters && options.filters.length > 0) {
        const filterQuery = this.buildFilterQuery(options.filters);
        if (filterQuery) {
          countQuery = aql`${countQuery} FILTER ${filterQuery}`;
        }
      }

      countQuery = aql`${countQuery} COLLECT WITH COUNT INTO total RETURN total`;

      // 执行计数查询
      const countCursor = await this.db.query<number>(countQuery);
      const total = await countCursor.next() || 0;

      // 获取数据
      const items = await this.findAll(options);

      // 计算分页信息
      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrevious = page > 1;

      return {
        items,
        total,
        page,
        limit,
        totalPages,
        hasNext,
        hasPrevious,
      };
    } catch (error) {
      this.logger.error(`Failed to find ${this.collectionName} with pagination: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 构建过滤查询
   * @param filters 过滤条件
   * @returns 查询字符串
   */
  protected buildFilterQuery(filters: FilterCondition[]): GeneratedAqlQuery | null {
    if (!filters || filters.length === 0) {
      return null;
    }

    const conditions: GeneratedAqlQuery[] = [];

    for (const filter of filters) {
      if ('operator' in filter && 'conditions' in filter) {
        // 处理逻辑运算符 (AND/OR)
        const subConditions = this.buildFilterQuery(filter.conditions);
        if (subConditions) {
          if (filter.operator === 'and') {
            conditions.push(subConditions);
          } else if (filter.operator === 'or') {
            conditions.push(aql`(${subConditions})`);
          }
        }
      } else if ('field' in filter) {
        // 处理字段过滤
        switch (filter.operator) {
          case '==':
            conditions.push(aql`doc.${filter.field} == ${filter.value}`);
            break;
          case '!=':
            conditions.push(aql`doc.${filter.field} != ${filter.value}`);
            break;
          case '>':
            conditions.push(aql`doc.${filter.field} > ${filter.value}`);
            break;
          case '>=':
            conditions.push(aql`doc.${filter.field} >= ${filter.value}`);
            break;
          case '<':
            conditions.push(aql`doc.${filter.field} < ${filter.value}`);
            break;
          case '<=':
            conditions.push(aql`doc.${filter.field} <= ${filter.value}`);
            break;
          case 'in':
            conditions.push(aql`doc.${filter.field} IN ${filter.value}`);
            break;
          case 'not in':
            conditions.push(aql`doc.${filter.field} NOT IN ${filter.value}`);
            break;
          case 'like':
            conditions.push(aql`LIKE(doc.${filter.field}, ${filter.value}, true)`);
            break;
          case 'not like':
            conditions.push(aql`NOT LIKE(doc.${filter.field}, ${filter.value}, true)`);
            break;
          case 'exists':
            conditions.push(aql`HAS(doc, ${filter.field})`);
            break;
          case 'not exists':
            conditions.push(aql`!HAS(doc, ${filter.field})`);
            break;
        }
      }
    }

    if (conditions.length === 0) {
      return null;
    }

    if (conditions.length === 1) {
      return conditions[0];
    }

    const joinedConditions = conditions.join(' AND ');
    return aql`${joinedConditions}`;
  }
}
