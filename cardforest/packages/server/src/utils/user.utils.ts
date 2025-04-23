import { User, UserReference, OAuthProfile } from '../interfaces/user.interface';

/**
 * 用户工具类
 * 提供用户对象处理的通用方法
 */
export class UserUtils {
  /**
   * 从不同格式的用户对象中提取用户 ID
   * @param user 用户对象
   * @returns 用户 ID
   */
  static extractUserId(user: any): string | null {
    if (!user) {
      return null;
    }

    // 如果是字符串，直接返回
    if (typeof user === 'string') {
      // 如果是完整路径（如 'users/123'），提取 key 部分
      if (user.includes('/')) {
        return user.split('/').pop() || null;
      }
      return user;
    }

    // 如果是对象，按优先级尝试不同属性
    if (typeof user === 'object') {
      return (
        user.sub ||
        user._key ||
        user.id ||
        user._id?.split('/').pop() ||
        user.username ||
        null
      );
    }

    return null;
  }

  /**
   * 创建标准用户引用
   * @param user 用户对象
   * @returns 用户引用
   */
  static createUserReference(user: any): string | null {
    const userId = this.extractUserId(user);
    if (!userId) {
      return null;
    }

    // 如果已经是完整路径，直接返回
    if (typeof user === 'string' && user.includes('/')) {
      return user;
    }

    return `users/${userId}`;
  }

  /**
   * 标准化用户对象
   * @param user 用户对象
   * @returns 标准化的用户对象
   */
  static normalizeUser(user: any): User {
    if (!user) {
      return {};
    }

    // 如果是字符串，创建最小用户对象
    if (typeof user === 'string') {
      const userId = this.extractUserId(user);
      return {
        _key: userId,
        _id: `users/${userId}`,
      };
    }

    // 如果是对象，标准化属性
    const userId = this.extractUserId(user);
    return {
      _key: userId,
      _id: user._id || `users/${userId}`,
      _rev: user._rev,
      username: user.username || user.login || user.name || user.email || userId,
      email: user.email,
      name: user.name,
      avatar: user.avatar || user.avatar_url,
      provider: user.provider,
      providerId: user.providerId || user.id || user.sub,
      sub: user.sub,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.isAdmin || false,
    };
  }

  /**
   * 从 OAuth 配置文件创建用户对象
   * @param profile OAuth 配置文件
   * @param provider 认证提供商
   * @returns 用户对象
   */
  static createUserFromOAuthProfile(profile: OAuthProfile, provider: string): User {
    const now = new Date().toISOString();
    
    // 提取用户 ID
    const providerId = profile.id?.toString() || profile.sub;
    
    if (!providerId) {
      throw new Error('OAuth profile missing ID');
    }

    return {
      username: profile.username || profile.login || profile.name || profile.email || providerId,
      email: profile.email,
      name: profile.name,
      avatar: profile.avatar || profile.avatar_url,
      provider,
      providerId,
      sub: profile.sub || providerId,
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * 创建用户 DTO
   * @param user 用户对象
   * @returns 用户 DTO
   */
  static toUserDto(user: User): UserReference {
    return {
      _id: user._id,
      _key: user._key,
      username: user.username || user.name || user.email || user._key,
      provider: user.provider,
      providerId: user.providerId,
    };
  }

  /**
   * 获取用户显示名称
   * @param user 用户对象
   * @returns 用户显示名称
   */
  static getUserDisplayName(user: any): string {
    if (!user) {
      return 'Unknown User';
    }

    if (typeof user === 'string') {
      return user;
    }

    return user.username || user.name || user.email || user._key || 'Unknown User';
  }
}
