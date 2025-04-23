import { Injectable, Logger } from '@nestjs/common';
import { aql } from 'arangojs';
import { BaseRepository } from './base.repository';
import { ArangoDBService } from '../services/arangodb.service';
import { User as UserInterface, OAuthProfile } from '../interfaces/user.interface';
export type User = UserInterface;
import { UserUtils } from '../utils/user.utils';

/**
 * 用户仓库类
 */
@Injectable()
export class UserRepository extends BaseRepository<User> {
  protected readonly logger = new Logger(UserRepository.name);

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
      this.logger.debug(`Finding user by username: ${username}`);

      const query = aql`
        FOR user IN users
        FILTER user.username == ${username}
        RETURN user
      `;

      const cursor = await this.db.query(query);
      const hasNext = await cursor.hasNext;
      const user = hasNext ? await cursor.next() : null;

      this.logger.debug(`User found: ${user ? 'yes' : 'no'}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to find user by username: ${error.message}`, error.stack);
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
      this.logger.debug(`Finding user by OAuth ID: ${provider}/${providerId}`);

      const query = aql`
        FOR user IN users
        FILTER user.provider == ${provider} AND user.providerId == ${providerId}
        RETURN user
      `;

      const cursor = await this.db.query(query);
      const hasNext = await cursor.hasNext;
      const user = hasNext ? await cursor.next() : null;

      this.logger.debug(`User found: ${user ? 'yes' : 'no'}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to find user by OAuth ID: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 根据用户 ID 查找用户
   * @param userId 用户 ID
   * @returns 用户或 null
   */
  async findByUserId(userId: string): Promise<User | null> {
    try {
      this.logger.debug(`Finding user by ID: ${userId}`);

      // 处理可能的完整路径
      const userKey = userId.includes('/') ? userId.split('/').pop() : userId;

      if (!userKey) {
        this.logger.warn(`Invalid user ID: ${userId}`);
        return null;
      }

      return this.findById(userKey);
    } catch (error) {
      this.logger.error(`Failed to find user by ID: ${error.message}`, error.stack);
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
      this.logger.debug(`Upserting OAuth user: ${provider}/${providerId}`);
      this.logger.debug('User data:', userData);

      const now = new Date().toISOString();

      const query = aql`
        UPSERT { provider: ${provider}, providerId: ${providerId} }
        INSERT ${{ ...userData, provider, providerId, createdAt: now }}
        UPDATE ${{ ...userData, updatedAt: now }}
        IN users
        RETURN NEW
      `;

      const cursor = await this.db.query(query);
      const user = await cursor.next();

      this.logger.debug(`User upserted: ${user._key}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to upsert OAuth user: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 从 OAuth 配置文件创建或更新用户
   * @param profile OAuth 配置文件
   * @param provider 认证提供商
   * @returns 创建或更新的用户
   */
  async upsertUserFromOAuthProfile(
    profile: OAuthProfile,
    provider: string
  ): Promise<User> {
    try {
      this.logger.debug(`Creating user from OAuth profile: ${provider}`);
      this.logger.debug('Profile:', profile);

      // 提取用户 ID
      const providerId = profile.id?.toString() || profile.sub;

      if (!providerId) {
        throw new Error('OAuth profile missing ID');
      }

      // 创建用户数据
      const userData = UserUtils.createUserFromOAuthProfile(profile, provider);

      // 创建或更新用户
      return this.upsertOAuthUser(provider, providerId, userData);
    } catch (error) {
      this.logger.error(`Failed to create user from OAuth profile: ${error.message}`, error.stack);
      throw error;
    }
  }
}
