import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ArangoDBService } from './arangodb.service';
import * as bcrypt from 'bcrypt';
import { User, UserPayload, OAuthProfile } from '../interfaces/user.interface';
import { UserRepository } from '../repositories/user.repository';
import { UserUtils } from '../utils/user.utils';
import { UnauthorizedError } from '../common/errors';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly arangoDBService: ArangoDBService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * 生成 JWT 令牌
   * @param payload 载荷数据
   * @param expiresIn 过期时间，默认 24 小时
   * @returns JWT 令牌
   */
  private generateToken(payload: UserPayload, expiresIn: string = '24h'): string {
    this.logger.debug(`Generating token for user: ${payload.sub}`);
    return this.jwtService.sign(payload, { expiresIn });
  }

  /**
   * 验证用户凭证
   * @param username 用户名
   * @param pass 密码
   * @returns 用户对象（不包含密码）或 null
   */
  async validateUser(username: string, pass: string): Promise<Partial<User> | null> {
    try {
      this.logger.debug(`Validating user: ${username}`);

      // 使用用户仓库查找用户
      const user = await this.userRepository.findByUsername(username);

      if (!user) {
        this.logger.debug(`User not found: ${username}`);
        return null;
      }

      // 验证密码
      if (user.password && (await bcrypt.compare(pass, user.password))) {
        this.logger.debug(`User validated: ${username}`);

        // 移除敏感信息
        const { password, ...result } = user;
        return result;
      }

      this.logger.debug(`Invalid password for user: ${username}`);
      return null;
    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`, error.stack);
      return null;
    }
  }

  /**
   * 用户登录
   * @param user 用户对象
   * @returns 包含访问令牌的对象
   */
  async login(user: Partial<User>) {
    try {
      this.logger.debug(`User login: ${user.username}`);

      // 提取用户 ID
      const userId = UserUtils.extractUserId(user);

      if (!userId) {
        throw new UnauthorizedError('Invalid user ID');
      }

      // 创建载荷
      const payload: UserPayload = {
        sub: userId,
        username: user.username,
        email: user.email,
        provider: user.provider,
        isAdmin: user.isAdmin
      };

      // 生成令牌
      const token = this.generateToken(payload);

      return {
        access_token: token,
        user: UserUtils.toUserDto(user as User)
      };
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 验证 OAuth 登录
   * @param data OAuth 登录数据
   * @returns JWT 令牌
   */
  async validateOAuthLogin(data: {
    provider: string;
    providerId?: string;
    profile: OAuthProfile;
    accessToken: string;
  }): Promise<string> {
    const { provider, providerId, profile, accessToken } = data;

    this.logger.debug(`Validating OAuth login: ${provider}`);
    this.logger.debug('Profile:', profile);

    if (!profile || (!profile.login && !profile.username && !profile.name)) {
      throw new UnauthorizedError('Invalid OAuth profile');
    }

    try {
      // 使用用户仓库创建或更新用户
      const user = await this.userRepository.upsertUserFromOAuthProfile(profile, provider);

      if (!user) {
        throw new UnauthorizedError('Failed to create/update user');
      }

      // 生成 JWT
      const payload: UserPayload = {
        sub: user._key || '',
        username: user.username,
        email: user.email,
        provider: user.provider,
        isAdmin: user.isAdmin
      };

      return this.generateToken(payload);
    } catch (error) {
      this.logger.error(`OAuth validation error: ${error.message}`, error.stack);
      throw new UnauthorizedError('Failed to validate OAuth login', {
        provider,
        error: error.message
      });
    }
  }

  /**
   * 根据用户名验证用户
   * @param username 用户名
   * @returns 用户对象
   */
  async validateUserByUsername(username: string): Promise<User> {
    try {
      this.logger.debug(`Validating user by username: ${username}`);

      // 使用用户仓库查找用户
      const user = await this.userRepository.findByUsername(username);

      if (!user) {
        throw new UnauthorizedError('Invalid credentials');
      }

      return user;
    } catch (error) {
      this.logger.error(`Error validating user by username: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 根据用户名和密码登录
   * @param credentials 用户凭证
   * @returns JWT 令牌
   */
  async loginByUsername(credentials: { username: string; password: string }): Promise<string> {
    try {
      this.logger.debug(`Login by username: ${credentials.username}`);

      // 验证用户
      const user = await this.validateUser(credentials.username, credentials.password);

      if (!user) {
        throw new UnauthorizedError('Invalid credentials');
      }

      // 提取用户 ID
      const userId = UserUtils.extractUserId(user);

      if (!userId) {
        throw new UnauthorizedError('Invalid user ID');
      }

      // 创建载荷
      const payload: UserPayload = {
        sub: userId,
        username: user.username,
        email: user.email,
        provider: user.provider,
        isAdmin: user.isAdmin
      };

      // 生成令牌
      return this.generateToken(payload);
    } catch (error) {
      this.logger.error(`Login by username error: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 根据用户名和密码注册用户
   * @param username 用户名
   * @param password 密码
   * @returns 用户对象（不包含敏感信息）
   */
  async registerByUsername(username: string, password: string): Promise<Partial<User>> {
    try {
      this.logger.debug(`Registering user: ${username}`);

      // 检查用户名是否已存在
      const existingUser = await this.userRepository.findByUsername(username);

      if (existingUser) {
        throw new UnauthorizedError('Username already exists');
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10);

      // 创建用户数据
      const now = new Date().toISOString();
      const userData: User = {
        username,
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      };

      // 创建用户
      const user = await this.userRepository.create(userData);

      this.logger.debug(`User registered: ${user._key}`);

      // 返回用户对象（不包含敏感信息）
      return UserUtils.toUserDto(user);
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 验证 JWT 令牌
   * @param token JWT 令牌
   * @returns 令牌载荷
   */
  async verifyToken(token: string): Promise<UserPayload> {
    try {
      this.logger.debug('Verifying token');
      return this.jwtService.verify<UserPayload>(token);
    } catch (error) {
      this.logger.error(`Token verification failed: ${error.message}`, error.stack);
      throw new UnauthorizedError('Invalid token', { error: error.message });
    }
  }

  /**
   * 根据用户 ID 获取用户
   * @param userId 用户 ID
   * @returns 用户对象（不包含敏感信息）
   */
  async getUserById(userId: string): Promise<Partial<User>> {
    try {
      this.logger.debug(`Getting user by ID: ${userId}`);

      // 使用用户仓库查找用户
      const user = await this.userRepository.findByUserId(userId);

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      // 移除敏感信息
      const { password, ...result } = user;

      return result;
    } catch (error) {
      this.logger.error(`Failed to get user by ID: ${error.message}`, error.stack);
      throw error;
    }
  }
}
