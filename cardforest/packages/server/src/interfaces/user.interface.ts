/**
 * 用户接口
 * 定义用户对象的标准结构
 */
export interface User {
  /**
   * ArangoDB 文档 ID
   */
  _id?: string;

  /**
   * ArangoDB 文档 Key
   */
  _key?: string;

  /**
   * ArangoDB 文档版本
   */
  _rev?: string;

  /**
   * 用户名
   */
  username?: string;

  /**
   * 电子邮件
   */
  email?: string;

  /**
   * 显示名称
   */
  name?: string;

  /**
   * 头像 URL
   */
  avatar?: string;

  /**
   * 认证提供商
   */
  provider?: string;

  /**
   * 提供商用户 ID
   */
  providerId?: string;

  /**
   * OAuth 用户 ID (sub)
   */
  sub?: string;

  /**
   * 创建时间
   */
  createdAt?: string;

  /**
   * 更新时间
   */
  updatedAt?: string;

  /**
   * 是否为管理员
   */
  isAdmin?: boolean;

  /**
   * 密码哈希（仅用于本地认证）
   */
  password?: string;
}

/**
 * 用户引用
 * 用于在其他文档中引用用户
 */
export interface UserReference {
  /**
   * 用户 ID
   */
  _id?: string;

  /**
   * 用户 Key
   */
  _key?: string;

  /**
   * 用户名
   */
  username?: string;

  /**
   * 认证提供商
   */
  provider?: string;

  /**
   * 提供商用户 ID
   */
  providerId?: string;
}

/**
 * JWT 载荷
 * 用于生成和验证 JWT
 */
export interface UserPayload {
  /**
   * 用户 ID (subject)
   */
  sub: string;

  /**
   * 用户名
   */
  username?: string;

  /**
   * 电子邮件
   */
  email?: string;

  /**
   * 认证提供商
   */
  provider?: string;

  /**
   * 是否为管理员
   */
  isAdmin?: boolean;

  /**
   * JWT 过期时间
   */
  exp?: number;

  /**
   * JWT 签发时间
   */
  iat?: number;
}

/**
 * OAuth 用户配置文件
 * 从 OAuth 提供商获取的用户信息
 */
export interface OAuthProfile {
  /**
   * 用户 ID (subject)
   */
  sub?: string;

  /**
   * 用户 ID (GitHub 等使用)
   */
  id?: string | number;

  /**
   * 用户名
   */
  username?: string;

  /**
   * 登录名 (GitHub 等使用)
   */
  login?: string;

  /**
   * 电子邮件
   */
  email?: string;

  /**
   * 显示名称
   */
  name?: string;

  /**
   * 头像 URL
   */
  avatar?: string;

  /**
   * 头像 URL (GitHub 等使用)
   */
  avatar_url?: string;

  /**
   * 认证提供商
   */
  provider?: string;
}
