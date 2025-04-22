import { Database, aql } from 'arangojs';

/**
 * 基础仓库类，提供通用的数据库操作
 * @template T 实体类型
 */
export abstract class BaseRepository<T> {
  /**
   * 构造函数
   * @param db 数据库实例
   * @param collectionName 集合名称
   */
  constructor(
    protected readonly db: Database,
    protected readonly collectionName: string
  ) {}

  /**
   * 根据ID查找实体
   * @param id 实体ID
   * @returns 实体或null
   */
  async findById(id: string): Promise<T | null> {
    try {
      const query = aql`
        FOR doc IN ${this.collectionName}
        FILTER doc._key == ${id}
        RETURN doc
      `;
      const cursor = await this.db.query(query);
      return cursor.hasNext() ? cursor.next() : null;
    } catch (error) {
      console.error(`Failed to find ${this.collectionName} by id:`, error);
      throw error;
    }
  }

  /**
   * 查找所有实体
   * @returns 实体数组
   */
  async findAll(): Promise<T[]> {
    try {
      const query = aql`
        FOR doc IN ${this.collectionName}
        RETURN doc
      `;
      const cursor = await this.db.query(query);
      return cursor.all();
    } catch (error) {
      console.error(`Failed to find all ${this.collectionName}:`, error);
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
      const collection = this.db.collection(this.collectionName);
      const result = await collection.save(data);
      return { ...data, _id: result._id, _key: result._key, _rev: result._rev } as T;
    } catch (error) {
      console.error(`Failed to create ${this.collectionName}:`, error);
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
      const collection = this.db.collection(this.collectionName);
      const result = await collection.update(id, data, { returnNew: true });
      return result.new as T;
    } catch (error) {
      console.error(`Failed to update ${this.collectionName}:`, error);
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
      const collection = this.db.collection(this.collectionName);
      await collection.remove(id);
      return true;
    } catch (error) {
      console.error(`Failed to delete ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * 创建分页查询
   * @param filter 过滤条件
   * @param page 页码
   * @param pageSize 每页大小
   * @returns 查询结果
   */
  protected createPaginatedQuery(filter: string | null, page: number, pageSize: number): aql.Query {
    const offset = (page - 1) * pageSize;
    return aql`
      FOR doc IN ${this.collectionName}
      ${filter ? aql`FILTER ${filter}` : aql``}
      LIMIT ${offset}, ${pageSize}
      RETURN doc
    `;
  }

  /**
   * 创建排序查询
   * @param sortField 排序字段
   * @param sortDirection 排序方向
   * @returns 查询结果
   */
  protected createSortedQuery(sortField: string, sortDirection: 'ASC' | 'DESC'): aql.Query {
    return aql`
      FOR doc IN ${this.collectionName}
      SORT doc.${sortField} ${sortDirection === 'ASC' ? 'ASC' : 'DESC'}
      RETURN doc
    `;
  }
}
