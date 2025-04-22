import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { BaseRepository } from './base.repository';
import { ArangoDBService } from '../services/arangodb.service';

/**
 * 用户实体接口
 */
export interface User {
  _key?: string;
  _id?: string;
  _rev?: string;
  username: string;
  password?: string;
  email?: string;
  provider?: string;
  providerId?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * 用户仓库类
 */
@Injectable()
export class UserRepository extends BaseRepository<User> {
  /**
   * 构造函数
   * @param arangoDBService ArangoDB服务
   */
  constructor(private readonly arangoDBService: ArangoDBService) {
    super(arangoDBService.getDatabase(), 'users');
  }

  /**
   * 根据用户名查找用户
   * @param username 用户名
   * @returns 用户或null
   */
  async findByUsername(username: string): Promise<User | null> {
    try {
      const query = aql`
        FOR user IN users
        FILTER user.username == ${username}
        RETURN user
      `;
      const cursor = await this.db.query(query);
      return cursor.hasNext() ? cursor.next() : null;
    } catch (error) {
      console.error('Failed to find user by username:', error);
      throw error;
    }
  }

  /**
   * 根据OAuth提供商和ID查找用户
   * @param provider OAuth提供商
   * @param providerId 提供商ID
   * @returns 用户或null
   */
  async findByOAuthId(provider: string, providerId: string): Promise<User | null> {
    try {
      const query = aql`
        FOR user IN users
        FILTER user.provider == ${provider} AND user.providerId == ${providerId}
        RETURN user
      `;
      const cursor = await this.db.query(query);
      return cursor.hasNext() ? cursor.next() : null;
    } catch (error) {
      console.error('Failed to find user by OAuth ID:', error);
      throw error;
    }
  }

  /**
   * 创建或更新OAuth用户
   * @param provider OAuth提供商
   * @param providerId 提供商ID
   * @param userData 用户数据
   * @returns 创建或更新的用户
   */
  async upsertOAuthUser(
    provider: string,
    providerId: string,
    userData: Partial<User>
  ): Promise<User> {
    try {
      const query = aql`
        UPSERT { provider: ${provider}, providerId: ${providerId} }
        INSERT ${{ ...userData, provider, providerId, createdAt: new Date().toISOString() }}
        UPDATE ${{ ...userData, updatedAt: new Date().toISOString() }}
        IN users
        RETURN NEW
      `;
      const cursor = await this.db.query(query);
      return cursor.next();
    } catch (error) {
      console.error('Failed to upsert OAuth user:', error);
      throw error;
    }
  }
}
